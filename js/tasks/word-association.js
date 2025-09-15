/**
 * Word Association Task - Rapid semantic association analysis
 * Measures cognitive processing, emotional responses, and unconscious patterns
 */

import { BaseTask } from './base-task.js';

export class WordAssociationTask extends BaseTask {
    constructor(taskData) {
        super(taskData);
        
        this.type = 'word-association';
        this.words = taskData.words || [
            'home', 'mother', 'success', 'fear', 'love', 
            'work', 'future', 'past', 'friend', 'alone',
            'happy', 'angry', 'dream', 'failure', 'power'
        ];
        this.timeLimit = taskData.timeLimit || 90000; // 90 seconds total
        this.responseTimeLimit = 5000; // 5 seconds per word
        
        // State
        this.currentWordIndex = 0;
        this.associations = [];
        this.startTimes = [];
        this.wordTimer = null;
        
        // UI elements
        this.inputField = null;
        this.currentWordElement = null;
        this.progressElement = null;
    }
    
    /**
     * Render the task UI
     */
    async render() {
        const container = this.createContainer();
        
        // Start screen with instructions
        const startScreen = document.createElement('div');
        startScreen.className = 'task-start-screen';
        startScreen.innerHTML = `
            <div class="task-intro-card">
                <div class="task-icon-large">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        <circle cx="9" cy="10" r="1"/>
                        <circle cx="15" cy="10" r="1"/>
                    </svg>
                </div>
                <h3>Rapid Word Association</h3>
                <p class="task-description">This task measures your semantic networks and unconscious associations.</p>
                <div class="task-rules">
                    <div class="rule-item">
                        <span class="rule-icon">⚡</span>
                        <span>You have <strong>5 seconds</strong> per word</span>
                    </div>
                    <div class="rule-item">
                        <span class="rule-icon">🧠</span>
                        <span>Type the <strong>first word</strong> that comes to mind</span>
                    </div>
                    <div class="rule-item">
                        <span class="rule-icon">✨</span>
                        <span>Don't overthink - be spontaneous!</span>
                    </div>
                </div>
                <button id="start-task-btn" class="btn btn-primary btn-large">
                    Start Task
                    <svg width="20" height="20">
                        <use href="assets/icons/icons.svg#icon-arrow-right"></use>
                    </svg>
                </button>
            </div>
        `;
        container.appendChild(startScreen);
        
        // Main task screen (initially hidden)
        const taskScreen = document.createElement('div');
        taskScreen.className = 'task-main-screen hidden';
        taskScreen.innerHTML = `
            <div class="word-association-header">
                <h3>Word Association</h3>
                <p class="instruction-emphasis">Type the first word that comes to mind!</p>
            </div>
        `;
        container.appendChild(taskScreen);
        
        // Progress indicator
        const progressContainer = document.createElement('div');
        progressContainer.className = 'word-progress-container';
        progressContainer.innerHTML = `
            <div class="word-progress-bar">
                <div id="word-progress-fill" class="word-progress-fill" style="width: 0%"></div>
            </div>
            <div class="word-progress-text">
                <span id="word-count">Word 1 of ${this.words.length}</span>
                <span id="time-remaining" class="time-indicator">
                    <svg width="16" height="16" class="timer-icon">
                        <use href="assets/icons/icons.svg#icon-clock"></use>
                    </svg>
                    <span id="timer-text">5s</span>
                </span>
            </div>
        `;
        taskScreen.appendChild(progressContainer);
        
        // Main word display with enhanced visuals
        const wordDisplay = document.createElement('div');
        wordDisplay.className = 'word-display-container';
        wordDisplay.innerHTML = `
            <div class="stimulus-word-container">
                <div class="stimulus-label">Respond to:</div>
                <div id="stimulus-word" class="stimulus-word">
                    <!-- Word will appear here -->
                </div>
                <div class="word-pulse-effect"></div>
            </div>
        `;
        taskScreen.appendChild(wordDisplay);
        
        // Input field with enhanced design
        const inputContainer = document.createElement('div');
        inputContainer.className = 'word-input-container';
        inputContainer.innerHTML = `
            <div class="input-wrapper">
                <input 
                    type="text" 
                    id="word-input" 
                    class="word-input-field" 
                    placeholder="Type your association..."
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                    disabled
                />
                <button id="submit-word" class="btn btn-primary word-submit-btn" disabled>
                    Submit
                    <svg width="16" height="16">
                        <use href="assets/icons/icons.svg#icon-arrow-right"></use>
                    </svg>
                </button>
            </div>
            <div class="input-hint">Press Enter or click Submit</div>
        `;
        taskScreen.appendChild(inputContainer);
        
        // Visual feedback area
        const feedbackArea = document.createElement('div');
        feedbackArea.id = 'word-feedback';
        feedbackArea.className = 'word-feedback-area';
        taskScreen.appendChild(feedbackArea);
        
        // Add custom styles
        this.addStyles();
        
        return container;
    }
    
    /**
     * Initialize the task
     */
    async initialize() {
        await super.initialize();
        
        // Get UI elements
        this.inputField = document.getElementById('word-input');
        this.currentWordElement = document.getElementById('stimulus-word');
        this.progressElement = document.getElementById('word-progress-fill');
        
        // Setup start button
        const startBtn = document.getElementById('start-task-btn');
        startBtn.addEventListener('click', () => this.startTask());
        
        // Setup submit button (initially disabled)
        const submitBtn = document.getElementById('submit-word');
        submitBtn.addEventListener('click', () => this.submitAssociation());
        
        // Enter key submits
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.inputField.disabled) {
                this.submitAssociation();
            }
        });
    }
    
    /**
     * Start the task after instructions
     */
    startTask() {
        // Hide start screen, show main screen
        const startScreen = document.querySelector('.task-start-screen');
        const mainScreen = document.querySelector('.task-main-screen');
        
        startScreen.style.opacity = '0';
        setTimeout(() => {
            startScreen.classList.add('hidden');
            mainScreen.classList.remove('hidden');
            
            // Enable input
            this.inputField.disabled = false;
            document.getElementById('submit-word').disabled = false;
            
            // Focus on input
            this.inputField.focus();
            
            // Start with first word
            this.presentWord();
        }, 300);
    }
    
    /**
     * Present a word stimulus
     */
    presentWord() {
        if (this.currentWordIndex >= this.words.length) {
            this.completeTask();
            return;
        }
        
        const word = this.words[this.currentWordIndex];
        
        // Animate word presentation
        this.currentWordElement.style.opacity = '0';
        this.currentWordElement.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            this.currentWordElement.textContent = word.toUpperCase();
            this.currentWordElement.style.opacity = '1';
            this.currentWordElement.style.transform = 'scale(1)';
        }, 200);
        
        // Clear input
        this.inputField.value = '';
        this.inputField.focus();
        
        // Update progress
        document.getElementById('word-count').textContent = 
            `Word ${this.currentWordIndex + 1} of ${this.words.length}`;
        
        const progressPercent = ((this.currentWordIndex) / this.words.length) * 100;
        this.progressElement.style.width = `${progressPercent}%`;
        
        // Start timing
        this.startTimes[this.currentWordIndex] = performance.now();
        
        // Start countdown timer
        this.startWordTimer();
        
        // Log event
        this.logEvent('word_presented', {
            word: word,
            index: this.currentWordIndex
        });
    }
    
    /**
     * Start countdown timer for current word
     */
    startWordTimer() {
        let timeLeft = this.responseTimeLimit / 1000;
        const timerElement = document.getElementById('time-remaining');
        
        // Clear previous timer
        if (this.wordTimer) {
            clearInterval(this.wordTimer);
        }
        
        this.wordTimer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time: ${timeLeft}s`;
            
            // Warning color when low on time
            if (timeLeft <= 2) {
                timerElement.classList.add('time-warning');
            } else {
                timerElement.classList.remove('time-warning');
            }
            
            // Time's up
            if (timeLeft <= 0) {
                clearInterval(this.wordTimer);
                this.submitAssociation(true); // Auto-submit with timeout flag
            }
        }, 1000);
    }
    
    /**
     * Submit the current association
     */
    submitAssociation(isTimeout = false) {
        const response = this.inputField.value.trim();
        const responseTime = performance.now() - this.startTimes[this.currentWordIndex];
        
        // Record association
        this.associations.push({
            stimulus: this.words[this.currentWordIndex],
            response: response || (isTimeout ? '[no response]' : '[skipped]'),
            responseTime: responseTime,
            isTimeout: isTimeout,
            isEmpty: !response
        });
        
        // Visual feedback
        this.showQuickFeedback(response ? 'Good!' : (isTimeout ? 'Time\'s up!' : 'Skipped'));
        
        // Log event
        this.logEvent('association_submitted', {
            stimulus: this.words[this.currentWordIndex],
            response: response,
            responseTime: responseTime,
            isTimeout: isTimeout
        });
        
        // Move to next word
        this.currentWordIndex++;
        
        // Small delay before next word
        setTimeout(() => {
            this.presentWord();
        }, 500);
    }
    
    /**
     * Show quick feedback message
     */
    showQuickFeedback(message) {
        const feedbackArea = document.getElementById('word-feedback');
        
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = 'word-feedback-message';
        feedback.textContent = message;
        
        // Add to feedback area
        feedbackArea.innerHTML = '';
        feedbackArea.appendChild(feedback);
        
        // Animate in
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 1500);
    }
    
    /**
     * Complete the task
     */
    completeTask() {
        // Clear timer
        if (this.wordTimer) {
            clearInterval(this.wordTimer);
        }
        
        // Analyze associations
        const analysis = this.analyzeAssociations();
        
        // Store response
        this.response = {
            associations: this.associations,
            analysis: analysis
        };
        
        // Show completion
        this.showCompletion(analysis);
        
        this.logEvent('task_completed', {
            totalWords: this.words.length,
            completedWords: this.associations.filter(a => !a.isEmpty).length,
            averageResponseTime: analysis.averageResponseTime
        });
    }
    
    /**
     * Analyze word associations for patterns
     */
    analyzeAssociations() {
        const validAssociations = this.associations.filter(a => !a.isEmpty);
        
        // Response time analysis
        const responseTimes = validAssociations.map(a => a.responseTime);
        const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
        
        // Emotional valence (simplified - in production would use NLP)
        const emotionalWords = {
            positive: ['happy', 'love', 'joy', 'good', 'great', 'wonderful', 'beautiful', 'success', 'friend', 'hope'],
            negative: ['sad', 'fear', 'angry', 'bad', 'terrible', 'awful', 'ugly', 'failure', 'alone', 'death'],
            neutral: ['thing', 'object', 'place', 'time', 'person', 'work', 'day', 'year', 'way', 'life']
        };
        
        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;
        
        validAssociations.forEach(assoc => {
            const response = assoc.response.toLowerCase();
            if (emotionalWords.positive.some(word => response.includes(word))) positiveCount++;
            else if (emotionalWords.negative.some(word => response.includes(word))) negativeCount++;
            else neutralCount++;
        });
        
        // Response patterns
        const uniqueResponses = new Set(validAssociations.map(a => a.response.toLowerCase())).size;
        const repetitionRate = 1 - (uniqueResponses / validAssociations.length);
        
        // Speed categories
        const fastResponses = responseTimes.filter(t => t < 1500).length;
        const slowResponses = responseTimes.filter(t => t > 3000).length;
        
        return {
            totalResponses: this.associations.length,
            validResponses: validAssociations.length,
            averageResponseTime: avgResponseTime,
            fastResponseRate: fastResponses / validAssociations.length,
            slowResponseRate: slowResponses / validAssociations.length,
            emotionalValence: {
                positive: positiveCount / validAssociations.length,
                negative: negativeCount / validAssociations.length,
                neutral: neutralCount / validAssociations.length
            },
            repetitionRate: repetitionRate,
            timeouts: this.associations.filter(a => a.isTimeout).length,
            skipped: this.associations.filter(a => !a.isTimeout && a.isEmpty).length
        };
    }
    
    /**
     * Show completion screen
     */
    showCompletion(analysis) {
        const container = document.querySelector('.task-content');
        
        const emotionalTone = analysis.emotionalValence.positive > 0.5 ? 'positive' :
                             analysis.emotionalValence.negative > 0.5 ? 'cautious' : 'balanced';
        
        const responseSpeed = analysis.fastResponseRate > 0.6 ? 'quick' :
                            analysis.slowResponseRate > 0.4 ? 'thoughtful' : 'moderate';
        
        container.innerHTML = `
            <div class="task-completion">
                <h3>Word Association Complete!</h3>
                <div class="completion-stats">
                    <div class="stat-row">
                        <span class="stat-label">Responses:</span>
                        <span class="stat-value">${analysis.validResponses} / ${analysis.totalResponses}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Response Style:</span>
                        <span class="stat-value">${responseSpeed}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Emotional Tone:</span>
                        <span class="stat-value">${emotionalTone}</span>
                    </div>
                </div>
                <p class="completion-message">Your responses have been recorded for analysis.</p>
            </div>
        `;
    }
    
    /**
     * Get task results
     */
    async getResults() {
        const results = await super.getResults();
        
        return {
            ...results,
            associations: this.associations,
            analysis: this.response?.analysis
        };
    }
    
    /**
     * Add custom styles
     */
    addStyles() {
        if (document.getElementById('word-association-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'word-association-styles';
        styles.textContent = `
            .word-association-instructions {
                margin-bottom: var(--space-6);
                padding: var(--space-4);
                background: linear-gradient(135deg, var(--sage-50) 0%, var(--white) 100%);
                border-radius: var(--radius-lg);
                border: 1px solid var(--sage-200);
            }
            
            .instruction-content h3 {
                color: var(--sage-700);
                margin-bottom: var(--space-3);
            }
            
            .instruction-emphasis {
                color: var(--sage-600);
                font-weight: var(--font-semibold);
                font-style: italic;
            }
            
            .word-progress-container {
                margin-bottom: var(--space-4);
            }
            
            .word-progress-bar {
                height: 8px;
                background: var(--gray-200);
                border-radius: var(--radius-full);
                overflow: hidden;
                margin-bottom: var(--space-2);
            }
            
            .word-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--sage-400) 0%, var(--sage-600) 100%);
                transition: width 0.3s ease;
            }
            
            .word-progress-text {
                display: flex;
                justify-content: space-between;
                font-size: var(--text-sm);
                color: var(--gray-600);
            }
            
            .time-indicator {
                font-weight: var(--font-semibold);
                transition: color 0.3s ease;
            }
            
            .time-indicator.time-warning {
                color: var(--red-500);
                animation: pulse 1s infinite;
            }
            
            .word-display-container {
                text-align: center;
                margin: var(--space-8) 0;
            }
            
            .stimulus-word-container {
                display: inline-block;
                padding: var(--space-6) var(--space-8);
                background: var(--white);
                border: 3px solid var(--sage-300);
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-lg);
            }
            
            .stimulus-label {
                font-size: var(--text-sm);
                color: var(--gray-500);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: var(--space-2);
            }
            
            .stimulus-word {
                font-size: var(--text-4xl);
                font-weight: var(--font-bold);
                color: var(--sage-700);
                letter-spacing: 2px;
                transition: all 0.3s ease;
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .word-input-container {
                display: flex;
                gap: var(--space-3);
                max-width: 500px;
                margin: 0 auto var(--space-6);
            }
            
            .word-input-field {
                flex: 1;
                padding: var(--space-3) var(--space-4);
                font-size: var(--text-lg);
                border: 2px solid var(--gray-300);
                border-radius: var(--radius-lg);
                transition: all 0.2s ease;
            }
            
            .word-input-field:focus {
                outline: none;
                border-color: var(--sage-500);
                box-shadow: 0 0 0 3px rgba(108, 158, 131, 0.1);
            }
            
            .word-submit-btn {
                min-width: 120px;
            }
            
            .word-feedback-area {
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .word-feedback-message {
                padding: var(--space-2) var(--space-4);
                background: var(--sage-100);
                color: var(--sage-700);
                border-radius: var(--radius-full);
                font-weight: var(--font-semibold);
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
            }
            
            .word-feedback-message.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .task-completion {
                text-align: center;
                padding: var(--space-6);
                background: linear-gradient(135deg, var(--sage-50) 0%, var(--white) 100%);
                border-radius: var(--radius-xl);
                border: 2px solid var(--sage-200);
            }
            
            .completion-stats {
                margin: var(--space-4) 0;
                padding: var(--space-4);
                background: var(--white);
                border-radius: var(--radius-lg);
            }
            
            .stat-row {
                display: flex;
                justify-content: space-between;
                padding: var(--space-2) 0;
                border-bottom: 1px solid var(--gray-100);
            }
            
            .stat-row:last-child {
                border-bottom: none;
            }
            
            .completion-message {
                color: var(--gray-600);
                font-style: italic;
            }
            
            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.6;
                }
            }
            
            /* Dark mode adjustments */
            [data-theme="dark"] .word-association-instructions {
                background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-50) 100%);
                border-color: var(--gray-300);
            }
            
            [data-theme="dark"] .stimulus-word-container {
                background: var(--gray-100);
                border-color: var(--sage-600);
            }
            
            [data-theme="dark"] .word-input-field {
                background: var(--gray-50);
                border-color: var(--gray-400);
                color: var(--gray-900);
            }
            
            [data-theme="dark"] .task-completion {
                background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-50) 100%);
                border-color: var(--sage-600);
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export for use in task controller
export default WordAssociationTask;