/**
 * Task Controller - Manages different assessment types
 * Supports Likert scales, gamified tasks, and behavioral assessments
 */

export class TaskController {
    constructor() {
        this.taskTypes = {
            'likert': 'LikertTask',
            'lateral': 'LateralTask',
            'risk-balloon': 'RiskBalloonTask',
            'word-association': 'WordAssociationTask',
            'visual-attention': 'VisualAttentionTask',
            'pattern-recognition': 'PatternRecognitionTask'
            // Note: Other task types (microexpression, tat-digital, etc.) will be added when their files are created
        };
        
        this.loadedTasks = new Map();
        this.currentTask = null;
        this.behavioralData = [];
        
        // Validate all task mappings on initialization
        this.validateTaskMappings();
    }
    
    /**
     * Validate that all task type mappings have corresponding files and classes
     */
    async validateTaskMappings() {
        console.log('🔍 Validating task type mappings...');
        const validationResults = {
            valid: [],
            invalid: [],
            warnings: []
        };
        
        for (const [taskType, className] of Object.entries(this.taskTypes)) {
            try {
                // Try to import the module
                const module = await import(`../tasks/${taskType}.js`);
                const TaskClass = module[className];
                
                if (TaskClass) {
                    validationResults.valid.push({ taskType, className });
                    console.log(`✅ ${taskType} → ${className}`);
                } else {
                    validationResults.invalid.push({ 
                        taskType, 
                        className, 
                        error: `Class '${className}' not found in module`
                    });
                    console.error(`❌ ${taskType} → ${className} (class not found)`);
                }
            } catch (error) {
                validationResults.invalid.push({ 
                    taskType, 
                    className, 
                    error: error.message 
                });
                console.error(`❌ ${taskType} → ${className} (${error.message})`);
            }
        }
        
        // Check for commonly used task types that might be missing
        const commonTaskTypes = ['lateral', 'likert', 'choice', 'multiple-choice', 'scale'];
        commonTaskTypes.forEach(taskType => {
            if (!this.taskTypes[taskType]) {
                validationResults.warnings.push(`Warning: Common task type '${taskType}' not in mapping`);
                console.warn(`⚠️  Common task type '${taskType}' not in mapping`);
            }
        });
        
        console.log(`📊 Validation complete: ${validationResults.valid.length} valid, ${validationResults.invalid.length} invalid, ${validationResults.warnings.length} warnings`);
        
        if (validationResults.invalid.length > 0) {
            console.warn('Some task types may not work correctly:', validationResults.invalid);
        }
        
        return validationResults;
    }
    
    /**
     * Dynamically load and initialize a task based on type
     */
    async loadTask(taskType, taskData) {
        const originalTaskType = taskType;
        
        if (!this.taskTypes[taskType]) {
            console.error(`CRITICAL: Unknown task type: '${taskType}'. This will cause incorrect question rendering!`);
            console.error(`Available task types:`, Object.keys(this.taskTypes));
            console.error(`Question data:`, { type: taskData.type, question: taskData.question?.substring(0, 100) + '...' });
            
            // Create user-visible error for debugging
            if (typeof window !== 'undefined' && window.neurlynApp) {
                window.neurlynApp.showToast(`ERROR: Task type '${taskType}' not found. Falling back to Likert.`, 'error');
            }
            
            taskType = 'likert';
        }
        
        // Dynamic import for code splitting
        if (!this.loadedTasks.has(taskType)) {
            try {
                const module = await import(`../tasks/${taskType}.js`);
                const TaskClass = module[this.taskTypes[taskType]];
                
                if (!TaskClass) {
                    throw new Error(`Task class '${this.taskTypes[taskType]}' not found in module ${taskType}.js`);
                }
                
                this.loadedTasks.set(taskType, TaskClass);
                
                // Log successful loading for debugging
                if (originalTaskType !== taskType) {
                    console.warn(`Successfully loaded fallback task: ${taskType}`);
                } else {
                    console.log(`Successfully loaded task: ${taskType}`);
                }
                
            } catch (error) {
                console.error(`Failed to load task module: ${taskType}`, error);
                console.error(`Module path attempted: ../tasks/${taskType}.js`);
                console.error(`Expected class name: ${this.taskTypes[taskType]}`);
                
                // Fall back to Likert task
                try {
                    const module = await import(`../tasks/likert.js`);
                    const TaskClass = module.LikertTask;
                    this.loadedTasks.set(taskType, TaskClass);
                    
                    // Alert user about fallback
                    if (typeof window !== 'undefined' && window.neurlynApp) {
                        window.neurlynApp.showToast(`Failed to load ${originalTaskType} task. Using Likert fallback.`, 'error');
                    }
                } catch (fallbackError) {
                    console.error(`FATAL: Even Likert fallback failed:`, fallbackError);
                    throw new Error(`Cannot load any task type. Original: ${originalTaskType}, Fallback: likert`);
                }
            }
        }
        
        const TaskClass = this.loadedTasks.get(taskType);
        this.currentTask = new TaskClass(taskData);
        return this.currentTask;
    }
    
    /**
     * Render the current task to the DOM
     */
    async renderTask(container) {
        if (!this.currentTask) {
            throw new Error('No task loaded');
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Add task-specific CSS class
        container.className = `task-container task-${this.currentTask.type}`;
        
        // Render task
        const taskElement = await this.currentTask.render();
        container.appendChild(taskElement);
        
        // Initialize task (start timers, etc.)
        await this.currentTask.initialize();
        
        // Start behavioral tracking
        this.startBehavioralTracking(container);
    }
    
    /**
     * Start tracking behavioral data for the current task
     */
    startBehavioralTracking(container) {
        const startTime = performance.now();
        const behavioralEvents = [];
        
        // Mouse tracking
        const mouseTracker = (e) => {
            behavioralEvents.push({
                type: 'mouse',
                x: e.clientX,
                y: e.clientY,
                timestamp: performance.now() - startTime,
                target: e.target.className
            });
        };
        
        // Click tracking
        const clickTracker = (e) => {
            behavioralEvents.push({
                type: 'click',
                x: e.clientX,
                y: e.clientY,
                timestamp: performance.now() - startTime,
                target: e.target.className
            });
        };
        
        // Keyboard tracking
        const keyTracker = (e) => {
            behavioralEvents.push({
                type: 'key',
                key: e.key,
                timestamp: performance.now() - startTime
            });
        };
        
        // Focus tracking
        const focusTracker = (e) => {
            behavioralEvents.push({
                type: 'focus',
                target: e.target.className,
                timestamp: performance.now() - startTime
            });
        };
        
        // Scroll tracking
        const scrollTracker = (e) => {
            behavioralEvents.push({
                type: 'scroll',
                scrollY: window.scrollY,
                timestamp: performance.now() - startTime
            });
        };
        
        // Attach listeners
        container.addEventListener('mousemove', mouseTracker, { passive: true });
        container.addEventListener('click', clickTracker);
        container.addEventListener('keydown', keyTracker);
        container.addEventListener('focus', focusTracker, true);
        window.addEventListener('scroll', scrollTracker, { passive: true });
        
        // Store cleanup function
        this.currentTask.cleanup = () => {
            container.removeEventListener('mousemove', mouseTracker);
            container.removeEventListener('click', clickTracker);
            container.removeEventListener('keydown', keyTracker);
            container.removeEventListener('focus', focusTracker);
            window.removeEventListener('scroll', scrollTracker);
            
            // Save behavioral data
            this.behavioralData.push({
                taskId: this.currentTask.id,
                taskType: this.currentTask.type,
                events: behavioralEvents,
                duration: performance.now() - startTime
            });
        };
    }
    
    /**
     * Get results from the current task
     */
    async getTaskResults() {
        if (!this.currentTask) {
            throw new Error('No task loaded');
        }
        
        // Clean up behavioral tracking
        if (this.currentTask.cleanup) {
            this.currentTask.cleanup();
        }
        
        // Get task-specific results
        const taskResults = await this.currentTask.getResults();
        
        // Combine with behavioral data
        const behavioralMetrics = this.analyzeBehavioralData();
        
        return {
            ...taskResults,
            behavioral: behavioralMetrics,
            taskType: this.currentTask.type,
            taskId: this.currentTask.id,
            timestamp: Date.now()
        };
    }
    
    /**
     * Analyze collected behavioral data
     */
    analyzeBehavioralData() {
        if (this.behavioralData.length === 0) {
            return null;
        }
        
        const latestData = this.behavioralData[this.behavioralData.length - 1];
        const events = latestData.events;
        
        // Calculate metrics
        const metrics = {
            totalDuration: latestData.duration,
            mouseMovements: events.filter(e => e.type === 'mouse').length,
            clicks: events.filter(e => e.type === 'click').length,
            keystrokes: events.filter(e => e.type === 'key').length,
            averageResponseTime: this.calculateAverageResponseTime(events),
            hesitationScore: this.calculateHesitationScore(events),
            engagementScore: this.calculateEngagementScore(events),
            mousePathLength: this.calculateMousePathLength(events),
            focusChanges: events.filter(e => e.type === 'focus').length
        };
        
        return metrics;
    }
    
    /**
     * Calculate average response time between interactions
     */
    calculateAverageResponseTime(events) {
        const interactions = events.filter(e => e.type === 'click' || e.type === 'key');
        if (interactions.length < 2) return 0;
        
        let totalTime = 0;
        for (let i = 1; i < interactions.length; i++) {
            totalTime += interactions[i].timestamp - interactions[i-1].timestamp;
        }
        
        return totalTime / (interactions.length - 1);
    }
    
    /**
     * Calculate hesitation score based on pauses in activity
     */
    calculateHesitationScore(events) {
        const interactions = events.filter(e => e.type === 'click' || e.type === 'key');
        if (interactions.length < 2) return 0;
        
        let hesitations = 0;
        const hesitationThreshold = 2000; // 2 seconds
        
        for (let i = 1; i < interactions.length; i++) {
            const gap = interactions[i].timestamp - interactions[i-1].timestamp;
            if (gap > hesitationThreshold) {
                hesitations++;
            }
        }
        
        return hesitations / interactions.length;
    }
    
    /**
     * Calculate engagement score based on activity patterns
     */
    calculateEngagementScore(events) {
        if (events.length === 0) return 0;
        
        const duration = events[events.length - 1].timestamp;
        const activityRate = events.length / (duration / 1000); // Events per second
        
        // Normalize to 0-1 scale (assuming 2-10 events per second is normal)
        return Math.min(1, Math.max(0, (activityRate - 2) / 8));
    }
    
    /**
     * Calculate total mouse path length
     */
    calculateMousePathLength(events) {
        const mouseEvents = events.filter(e => e.type === 'mouse');
        if (mouseEvents.length < 2) return 0;
        
        let totalDistance = 0;
        for (let i = 1; i < mouseEvents.length; i++) {
            const dx = mouseEvents[i].x - mouseEvents[i-1].x;
            const dy = mouseEvents[i].y - mouseEvents[i-1].y;
            totalDistance += Math.sqrt(dx * dx + dy * dy);
        }
        
        return totalDistance;
    }
    
    /**
     * Destroy current task and clean up
     */
    destroy() {
        if (this.currentTask) {
            if (this.currentTask.cleanup) {
                this.currentTask.cleanup();
            }
            if (this.currentTask.destroy) {
                this.currentTask.destroy();
            }
            this.currentTask = null;
        }
    }
}

// Export as singleton
export const taskController = new TaskController();