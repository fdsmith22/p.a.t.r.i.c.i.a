/**
 * Base Task Class - Abstract class for all assessment tasks
 */

export class BaseTask {
    constructor(taskData) {
        if (new.target === BaseTask) {
            throw new Error('BaseTask is an abstract class and cannot be instantiated directly');
        }
        
        this.id = taskData.id || this.generateId();
        this.type = taskData.type || 'unknown';
        this.question = taskData.question || '';
        this.instructions = taskData.instructions || '';
        this.category = taskData.category || 'general';
        this.timeLimit = taskData.timeLimit || null;
        this.data = taskData;
        
        // Timing
        this.startTime = null;
        this.endTime = null;
        
        // Response data
        this.response = null;
        this.metrics = {};
        
        // DOM elements
        this.container = null;
        this.cleanup = null;
    }
    
    /**
     * Generate unique task ID
     */
    generateId() {
        return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Render the task UI - must be implemented by subclasses
     */
    async render() {
        throw new Error('render() method must be implemented by subclass');
    }
    
    /**
     * Initialize the task (start timers, etc.)
     */
    async initialize() {
        this.startTime = performance.now();
        this.logEvent('task_started');
    }
    
    /**
     * Get task results
     */
    async getResults() {
        this.endTime = performance.now();
        const duration = this.endTime - this.startTime;
        
        return {
            id: this.id,
            type: this.type,
            category: this.category,
            question: this.question,
            response: this.response,
            metrics: {
                ...this.metrics,
                duration: duration,
                startTime: this.startTime,
                endTime: this.endTime
            },
            timestamp: Date.now()
        };
    }
    
    /**
     * Log task events for analysis
     */
    logEvent(eventType, data = {}) {
        if (!this.metrics.events) {
            this.metrics.events = [];
        }
        
        this.metrics.events.push({
            type: eventType,
            timestamp: performance.now() - this.startTime,
            data: data
        });
    }
    
    /**
     * Create base container with common elements
     */
    createContainer() {
        const container = document.createElement('div');
        container.className = 'task-content';
        
        // Add instructions if present
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
        
        // Add question
        if (this.question) {
            const questionEl = document.createElement('h3');
            questionEl.className = 'task-question';
            questionEl.textContent = this.question;
            container.appendChild(questionEl);
        }
        
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
        
        this.container = container;
        return container;
    }
    
    /**
     * Start countdown timer
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
     * Format milliseconds to MM:SS
     */
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Called when time runs out
     */
    onTimeUp() {
        this.logEvent('time_up');
        // Subclasses can override this
    }
    
    /**
     * Validate response
     */
    validateResponse() {
        return this.response !== null && this.response !== undefined;
    }
    
    /**
     * Clean up task resources
     */
    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        if (this.cleanup) {
            this.cleanup();
        }
        
        if (this.container) {
            this.container.remove();
        }
    }
    
    /**
     * Show feedback to user
     */
    showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.className = `task-feedback feedback-${type}`;
        feedback.textContent = message;
        
        if (this.container) {
            this.container.appendChild(feedback);
            
            // Auto-remove after 3 seconds
            setTimeout(() => {
                feedback.remove();
            }, 3000);
        }
    }
    
    /**
     * Animate element entry
     */
    animateIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    /**
     * Animate element exit
     */
    animateOut(element) {
        return new Promise((resolve) => {
            element.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            element.style.opacity = '0';
            element.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                element.remove();
                resolve();
            }, 200);
        });
    }
}