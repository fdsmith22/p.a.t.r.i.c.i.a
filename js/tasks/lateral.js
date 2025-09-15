/**
 * Lateral Thinking Task
 * Displays creative scenario-based questions with multiple choice answers
 */

import { BaseTask } from './base-task.js';

export class LateralTask extends BaseTask {
    constructor(taskData) {
        super(taskData);
        
        this.type = 'lateral';
        this.question = taskData.question || taskData.text;
        this.options = taskData.options || [];
        this.measures = taskData.measures || [];
        this.response = null;
        this.responseTime = null;
        this.startTime = null;
    }
    
    /**
     * Render the lateral question
     */
    async render() {
        // Create container but skip the default question rendering
        const container = document.createElement('div');
        container.className = 'task-content';
        
        // Add instructions if present (but skip default question)
        if (this.instructions) {
            const instructions = document.createElement('div');
            instructions.className = 'task-instructions';
            instructions.innerHTML = `
                <svg class="instruction-icon" width="16" height="16">
                    <use href="assets/icons/icons.svg#icon-info"></use>
                </svg>
                <p>${this.instructions}</p>
            `;
            container.appendChild(instructions);
        }
        
        // Question display with enhanced styling
        const questionDiv = document.createElement('div');
        questionDiv.className = 'lateral-question-container';
        questionDiv.innerHTML = `
            <div class="lateral-question-text">
                ${this.question}
            </div>
        `;
        container.appendChild(questionDiv);
        
        // Add timer if time limit exists
        if (this.timeLimit) {
            const timerEl = document.createElement('div');
            timerEl.className = 'task-timer';
            timerEl.innerHTML = `
                <svg width="16" height="16">
                    <use href="assets/icons/icons.svg#icon-clock"></use>
                </svg>
                <span id="task-timer-display">${this.formatTime(this.timeLimit)}</span>
            `;
            container.appendChild(timerEl);
            
            // Start countdown
            this.startTimer(timerEl.querySelector('#task-timer-display'));
        }
        
        // Store container reference
        this.container = container;
        
        // Options container
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'lateral-options-container';
        
        // Render each option
        this.options.forEach((option, index) => {
            const optionElement = document.createElement('button');
            optionElement.className = 'lateral-option-btn';
            optionElement.dataset.index = index;
            
            // Add letter indicator
            const letter = String.fromCharCode(65 + index); // A, B, C, D, E
            
            optionElement.innerHTML = `
                <span class="option-letter">${letter}</span>
                <span class="option-text">${option}</span>
            `;
            
            optionElement.addEventListener('click', () => this.selectOption(index));
            
            // Keyboard shortcut
            this.addKeyboardShortcut(letter.toLowerCase(), () => this.selectOption(index));
            
            optionsDiv.appendChild(optionElement);
        });
        
        container.appendChild(optionsDiv);
        
        // Add hint text
        const hintDiv = document.createElement('div');
        hintDiv.className = 'lateral-hint';
        hintDiv.innerHTML = `
            <p>💡 Tip: There's no "right" answer - choose what resonates with you most!</p>
        `;
        container.appendChild(hintDiv);
        
        // Add styles
        this.addStyles();
        
        // Start timing
        this.startTime = performance.now();
        
        return container;
    }
    
    /**
     * Initialize the task
     */
    async initialize() {
        await super.initialize();
        
        // Track that a lateral question was shown
        this.logEvent('lateral_question_shown', {
            question: this.question,
            measures: this.measures
        });
    }
    
    /**
     * Format milliseconds to MM:SS (needed for timer)
     */
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Start countdown timer (needed for timer)
     */
    startTimer(displayElement) {
        let remaining = this.timeLimit;
        
        this.timerInterval = setInterval(() => {
            remaining -= 1000;
            
            if (remaining <= 0) {
                clearInterval(this.timerInterval);
                this.onTimeUp();
                displayElement.textContent = '0:00';
            } else {
                displayElement.textContent = this.formatTime(remaining);
                
                // Add warning class when < 10 seconds
                if (remaining < 10000) {
                    displayElement.parentElement.classList.add('timer-warning');
                }
            }
        }, 1000);
    }
    
    /**
     * Called when time runs out (needed for timer)
     */
    onTimeUp() {
        this.logEvent('time_up');
        // Could auto-select a random option or disable interaction
    }
    
    /**
     * Add keyboard shortcuts
     */
    addKeyboardShortcut(key, callback) {
        const handler = (e) => {
            if (e.key === key && !this.response) {
                callback();
            }
        };
        document.addEventListener('keypress', handler);
        
        // Store handler for cleanup
        if (!this.keyHandlers) {
            this.keyHandlers = [];
        }
        this.keyHandlers.push({ event: 'keypress', handler });
    }
    
    /**
     * Handle option selection
     */
    selectOption(index) {
        if (this.response !== null) return; // Already answered
        
        // Record response
        this.response = index;
        this.responseTime = performance.now() - this.startTime;
        
        // Visual feedback
        const options = document.querySelectorAll('.lateral-option-btn');
        options.forEach((opt, i) => {
            opt.classList.remove('selected');
            if (i === index) {
                opt.classList.add('selected');
            }
            opt.disabled = true;
        });
        
        // Show feedback
        this.showFeedback();
        
        // Log the response
        this.logEvent('lateral_response', {
            question: this.question,
            selectedIndex: index,
            selectedOption: this.options[index],
            responseTime: this.responseTime,
            measures: this.measures
        });
        
        // Enable next button
        const nextBtn = document.getElementById('next-button');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.classList.add('pulse');
        }
    }
    
    /**
     * Show feedback after selection
     */
    showFeedback() {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'lateral-feedback show';
        
        const insights = this.getInsight(this.response);
        feedbackDiv.innerHTML = `
            <div class="feedback-content">
                <svg width="24" height="24" class="feedback-icon">
                    <use href="assets/icons/icons.svg#icon-check-circle"></use>
                </svg>
                <span>Response recorded! ${insights}</span>
            </div>
        `;
        
        const container = document.querySelector('.task-lateral');
        if (container) {
            container.appendChild(feedbackDiv);
        }
    }
    
    /**
     * Get insight based on response
     */
    getInsight(index) {
        const insights = [
            'Interesting choice!',
            'That reveals something unique about your thinking style.',
            'Your perspective is valuable.',
            'That\'s a thoughtful response.',
            'Thanks for sharing your view!'
        ];
        
        return insights[index % insights.length];
    }
    
    /**
     * Cleanup
     */
    destroy() {
        // Clean up timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Remove keyboard handlers
        if (this.keyHandlers) {
            this.keyHandlers.forEach(({ event, handler }) => {
                document.removeEventListener(event, handler);
            });
        }
        
        // Clean up container
        if (this.container) {
            this.container.remove();
        }
        
        super.destroy();
    }
    
    /**
     * Add styles for lateral questions
     */
    addStyles() {
        if (document.getElementById('lateral-task-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'lateral-task-styles';
        styles.textContent = `
            .lateral-question-container {
                margin-bottom: 2rem;
            }
            
            .lateral-question-text {
                font-size: 1.3rem;
                line-height: 1.6;
                color: #333;
                text-align: center;
                padding: 1.5rem;
                background: linear-gradient(135deg, rgba(108, 158, 131, 0.05) 0%, rgba(108, 158, 131, 0.02) 100%);
                border-radius: 12px;
                border: 1px solid rgba(108, 158, 131, 0.1);
            }
            
            .lateral-options-container {
                display: grid;
                gap: 1rem;
                margin: 2rem 0;
            }
            
            .lateral-option-btn {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.25rem 1.5rem;
                background: white;
                border: 2px solid rgba(108, 158, 131, 0.2);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                font-size: 1.05rem;
                color: #444;
                position: relative;
                overflow: hidden;
            }
            
            .lateral-option-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(108, 158, 131, 0.1), transparent);
                transition: left 0.5s ease;
            }
            
            .lateral-option-btn:hover:not(:disabled) {
                border-color: #6C9E83;
                transform: translateX(4px);
                box-shadow: 0 4px 20px rgba(108, 158, 131, 0.15);
            }
            
            .lateral-option-btn:hover:not(:disabled)::before {
                left: 100%;
            }
            
            .lateral-option-btn.selected {
                background: linear-gradient(135deg, rgba(108, 158, 131, 0.15) 0%, rgba(108, 158, 131, 0.08) 100%);
                border-color: #6C9E83;
                box-shadow: 0 4px 20px rgba(108, 158, 131, 0.2);
            }
            
            .lateral-option-btn:disabled {
                cursor: default;
                opacity: 0.7;
            }
            
            .option-letter {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                background: linear-gradient(135deg, #6C9E83 0%, #5A8A70 100%);
                color: white;
                border-radius: 50%;
                font-weight: 600;
                flex-shrink: 0;
            }
            
            .lateral-option-btn.selected .option-letter {
                background: linear-gradient(135deg, #5A8A70 0%, #4A7059 100%);
                box-shadow: 0 2px 8px rgba(108, 158, 131, 0.3);
            }
            
            .option-text {
                flex: 1;
                line-height: 1.4;
            }
            
            .lateral-hint {
                text-align: center;
                color: #666;
                font-size: 0.95rem;
                margin-top: 1.5rem;
                padding: 1rem;
                background: rgba(255, 193, 7, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(255, 193, 7, 0.15);
            }
            
            .lateral-hint p {
                margin: 0;
            }
            
            .lateral-feedback {
                margin-top: 1.5rem;
                padding: 1rem;
                background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
                border: 1px solid rgba(76, 175, 80, 0.2);
                border-radius: 8px;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
            }
            
            .lateral-feedback.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .feedback-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #2E7D32;
            }
            
            .feedback-icon {
                fill: #4CAF50;
            }
            
            /* Dark mode support */
            .dark-mode .lateral-question-text {
                color: #E0E0E0;
                background: linear-gradient(135deg, rgba(108, 158, 131, 0.1) 0%, rgba(108, 158, 131, 0.05) 100%);
            }
            
            .dark-mode .lateral-option-btn {
                background: rgba(30, 30, 50, 0.5);
                color: #E0E0E0;
                border-color: rgba(108, 158, 131, 0.3);
            }
            
            .dark-mode .lateral-option-btn.selected {
                background: linear-gradient(135deg, rgba(108, 158, 131, 0.25) 0%, rgba(108, 158, 131, 0.15) 100%);
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .lateral-question-text {
                    font-size: 1.1rem;
                    padding: 1rem;
                }
                
                .lateral-option-btn {
                    padding: 1rem;
                    font-size: 0.95rem;
                }
                
                .option-letter {
                    width: 28px;
                    height: 28px;
                    font-size: 0.9rem;
                }
            }
            
            /* Animation for option appearance */
            @keyframes slideInOption {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .lateral-option-btn {
                animation: slideInOption 0.3s ease forwards;
            }
            
            .lateral-option-btn:nth-child(1) { animation-delay: 0s; }
            .lateral-option-btn:nth-child(2) { animation-delay: 0.1s; }
            .lateral-option-btn:nth-child(3) { animation-delay: 0.2s; }
            .lateral-option-btn:nth-child(4) { animation-delay: 0.3s; }
            .lateral-option-btn:nth-child(5) { animation-delay: 0.4s; }
        `;
        
        document.head.appendChild(styles);
    }
}

export default LateralTask;