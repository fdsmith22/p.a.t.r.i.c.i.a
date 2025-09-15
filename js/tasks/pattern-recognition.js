/**
 * Pattern Recognition Task
 * Measures pattern detection, visual processing, and cognitive flexibility
 * Key indicator for autism spectrum traits and cognitive processing style
 */

import { BaseTask } from './base-task.js';

export class PatternRecognitionTask extends BaseTask {
    constructor(taskData) {
        super(taskData);
        
        this.type = 'pattern-recognition';
        this.difficulty = taskData.difficulty || 'adaptive';
        this.timeLimit = taskData.timeLimit || 120000; // 2 minutes
        
        // Pattern types for different cognitive assessments
        this.patternTypes = [
            'sequence', // Number/shape sequences
            'matrix', // Raven's matrix-style
            'rotation', // Mental rotation
            'symmetry', // Symmetry detection
            'rule-based' // Complex rule patterns
        ];
        
        // State
        this.currentPattern = 0;
        this.patterns = [];
        this.responses = [];
        this.currentDifficulty = 1;
        this.adaptiveHistory = [];
        
        // UI elements
        this.canvas = null;
        this.ctx = null;
        this.selectedOption = null;
        
        // Neurodivergent indicators
        this.detailFocus = 0;
        this.holisticProcessing = 0;
        this.processingSpeed = [];
        this.accuracyByType = {};
    }
    
    /**
     * Render the task UI
     */
    async render() {
        const container = this.createContainer();
        
        // Start screen
        const startScreen = document.createElement('div');
        startScreen.className = 'task-start-screen';
        startScreen.innerHTML = `
            <div class="task-intro-card">
                <div class="task-icon-large">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                </div>
                <h3>Pattern Recognition</h3>
                <p class="task-description">Find the pattern and select what comes next.</p>
                <div class="task-rules">
                    <div class="rule-item">
                        <span class="rule-icon">🧩</span>
                        <span>Look for <strong>patterns</strong> in shapes, colors, or positions</span>
                    </div>
                    <div class="rule-item">
                        <span class="rule-icon">🎯</span>
                        <span>Click the <strong>correct answer</strong> from the options</span>
                    </div>
                    <div class="rule-item">
                        <span class="rule-icon">📈</span>
                        <span>Difficulty <strong>adapts</strong> to your performance</span>
                    </div>
                </div>
                <button id="start-pattern-task" class="btn btn-primary btn-large">
                    Start Task
                    <svg width="20" height="20">
                        <use href="assets/icons/icons.svg#icon-arrow-right"></use>
                    </svg>
                </button>
            </div>
        `;
        container.appendChild(startScreen);
        
        // Main task screen
        const taskScreen = document.createElement('div');
        taskScreen.className = 'task-main-screen hidden';
        taskScreen.innerHTML = `
            <div class="pattern-header">
                <h3>Find the Pattern</h3>
                <div class="pattern-progress">
                    <span id="pattern-count">Pattern 1 of 10</span>
                    <span id="pattern-timer" class="timer-display">2:00</span>
                </div>
            </div>
            
            <div class="pattern-display">
                <canvas id="pattern-canvas" width="600" height="300"></canvas>
            </div>
            
            <div class="pattern-question">
                <p>What comes next in the sequence?</p>
            </div>
            
            <div class="pattern-options" id="pattern-options">
                <!-- Options will be generated dynamically -->
            </div>
            
            <div class="pattern-feedback hidden" id="pattern-feedback">
                <!-- Feedback will appear here -->
            </div>
        `;
        container.appendChild(taskScreen);
        
        // Add styles
        this.addStyles();
        
        return container;
    }
    
    /**
     * Initialize the task
     */
    async initialize() {
        await super.initialize();
        
        // Setup canvas
        this.canvas = document.getElementById('pattern-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Setup start button
        const startBtn = document.getElementById('start-pattern-task');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startTask());
        }
        
        // Generate patterns
        this.generatePatterns();
    }
    
    /**
     * Start the task
     */
    startTask() {
        const startScreen = document.querySelector('.task-start-screen');
        const mainScreen = document.querySelector('.task-main-screen');
        
        startScreen.classList.add('hidden');
        mainScreen.classList.remove('hidden');
        
        // Start timer
        this.startTimer();
        
        // Show first pattern
        this.showPattern(0);
    }
    
    /**
     * Generate adaptive patterns
     */
    generatePatterns() {
        const patterns = [];
        
        // Start with easier patterns
        patterns.push(this.createSequencePattern(1));
        patterns.push(this.createMatrixPattern(1));
        patterns.push(this.createRotationPattern(1));
        
        // Add more based on initial performance
        for (let i = 3; i < 10; i++) {
            const type = this.patternTypes[i % this.patternTypes.length];
            const difficulty = this.calculateAdaptiveDifficulty();
            patterns.push(this.createPattern(type, difficulty));
        }
        
        this.patterns = patterns;
    }
    
    /**
     * Create a sequence pattern
     */
    createSequencePattern(difficulty) {
        const pattern = {
            type: 'sequence',
            difficulty: difficulty,
            elements: [],
            answer: null,
            options: []
        };
        
        if (difficulty === 1) {
            // Simple number sequence
            const start = Math.floor(Math.random() * 5) + 1;
            const step = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < 4; i++) {
                pattern.elements.push({
                    type: 'number',
                    value: start + (i * step)
                });
            }
            
            pattern.answer = {
                type: 'number',
                value: start + (4 * step)
            };
            
            // Generate wrong options
            pattern.options = [pattern.answer];
            for (let i = 0; i < 3; i++) {
                pattern.options.push({
                    type: 'number',
                    value: pattern.answer.value + (Math.random() < 0.5 ? -(i+1) : (i+1)) * step
                });
            }
        } else if (difficulty === 2) {
            // Shape sequence with color
            const shapes = ['circle', 'square', 'triangle'];
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
            const shapeIndex = Math.floor(Math.random() * shapes.length);
            
            for (let i = 0; i < 4; i++) {
                pattern.elements.push({
                    type: 'shape',
                    shape: shapes[(shapeIndex + i) % shapes.length],
                    color: colors[i % colors.length]
                });
            }
            
            pattern.answer = {
                type: 'shape',
                shape: shapes[(shapeIndex + 4) % shapes.length],
                color: colors[4 % colors.length]
            };
            
            // Generate options
            pattern.options = this.generateShapeOptions(pattern.answer);
        }
        
        // Shuffle options
        pattern.options.sort(() => Math.random() - 0.5);
        
        return pattern;
    }
    
    /**
     * Create a matrix pattern (Raven's style)
     */
    createMatrixPattern(difficulty) {
        const pattern = {
            type: 'matrix',
            difficulty: difficulty,
            grid: [],
            answer: null,
            options: []
        };
        
        // Create 3x3 grid with missing element
        const grid = [];
        const rule = Math.floor(Math.random() * 3); // 0: row, 1: column, 2: diagonal
        
        for (let i = 0; i < 3; i++) {
            grid[i] = [];
            for (let j = 0; j < 3; j++) {
                if (i === 2 && j === 2) {
                    grid[i][j] = null; // Missing element
                } else {
                    grid[i][j] = this.generateMatrixElement(i, j, rule, difficulty);
                }
            }
        }
        
        pattern.grid = grid;
        pattern.answer = this.generateMatrixElement(2, 2, rule, difficulty);
        
        // Generate options
        pattern.options = [pattern.answer];
        for (let i = 0; i < 3; i++) {
            pattern.options.push(this.generateMatrixElement(
                Math.floor(Math.random() * 3),
                Math.floor(Math.random() * 3),
                (rule + i + 1) % 3,
                difficulty
            ));
        }
        
        pattern.options.sort(() => Math.random() - 0.5);
        
        return pattern;
    }
    
    /**
     * Create a rotation pattern
     */
    createRotationPattern(difficulty) {
        const pattern = {
            type: 'rotation',
            difficulty: difficulty,
            elements: [],
            answer: null,
            options: []
        };
        
        const baseShape = this.createComplexShape(difficulty);
        const rotationStep = difficulty === 1 ? 90 : 45;
        
        for (let i = 0; i < 4; i++) {
            pattern.elements.push({
                type: 'rotation',
                shape: baseShape,
                rotation: i * rotationStep
            });
        }
        
        pattern.answer = {
            type: 'rotation',
            shape: baseShape,
            rotation: 4 * rotationStep
        };
        
        // Generate options
        pattern.options = [pattern.answer];
        for (let i = 1; i <= 3; i++) {
            pattern.options.push({
                type: 'rotation',
                shape: baseShape,
                rotation: (4 * rotationStep + i * 30) % 360
            });
        }
        
        pattern.options.sort(() => Math.random() - 0.5);
        
        return pattern;
    }
    
    /**
     * Show a pattern
     */
    showPattern(index) {
        if (index >= this.patterns.length) {
            this.completeTask();
            return;
        }
        
        this.currentPattern = index;
        const pattern = this.patterns[index];
        
        // Update progress
        document.getElementById('pattern-count').textContent = 
            `Pattern ${index + 1} of ${this.patterns.length}`;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw pattern based on type
        if (pattern.type === 'sequence') {
            this.drawSequence(pattern);
        } else if (pattern.type === 'matrix') {
            this.drawMatrix(pattern);
        } else if (pattern.type === 'rotation') {
            this.drawRotation(pattern);
        }
        
        // Show options
        this.showOptions(pattern);
        
        // Start timing
        this.patternStartTime = performance.now();
    }
    
    /**
     * Draw sequence pattern
     */
    drawSequence(pattern) {
        const elementWidth = 100;
        const spacing = 120;
        const startX = (this.canvas.width - (pattern.elements.length * spacing)) / 2;
        const y = this.canvas.height / 2;
        
        pattern.elements.forEach((element, index) => {
            const x = startX + (index * spacing);
            
            if (element.type === 'number') {
                this.ctx.font = '48px Inter';
                this.ctx.fillStyle = '#333';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(element.value, x, y);
            } else if (element.type === 'shape') {
                this.drawShape(x, y, element.shape, element.color);
            }
        });
        
        // Draw question mark for missing element
        const questionX = startX + (pattern.elements.length * spacing);
        this.ctx.font = '48px Inter';
        this.ctx.fillStyle = '#999';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('?', questionX, y);
    }
    
    /**
     * Draw a shape
     */
    drawShape(x, y, shape, color) {
        this.ctx.fillStyle = color || '#6C9E83';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        
        if (shape === 'circle') {
            this.ctx.beginPath();
            this.ctx.arc(x, y, 30, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        } else if (shape === 'square') {
            this.ctx.fillRect(x - 30, y - 30, 60, 60);
            this.ctx.strokeRect(x - 30, y - 30, 60, 60);
        } else if (shape === 'triangle') {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - 30);
            this.ctx.lineTo(x - 30, y + 30);
            this.ctx.lineTo(x + 30, y + 30);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
    
    /**
     * Show options
     */
    showOptions(pattern) {
        const optionsContainer = document.getElementById('pattern-options');
        optionsContainer.innerHTML = '';
        
        pattern.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'pattern-option-btn';
            optionBtn.dataset.index = index;
            
            // Create mini canvas for option
            const optionCanvas = document.createElement('canvas');
            optionCanvas.width = 100;
            optionCanvas.height = 100;
            const ctx = optionCanvas.getContext('2d');
            
            // Draw option
            if (option.type === 'number') {
                ctx.font = '32px Inter';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(option.value, 50, 50);
            } else if (option.type === 'shape') {
                this.drawShapeOnContext(ctx, 50, 50, option.shape, option.color, 20);
            } else if (option.type === 'rotation') {
                ctx.save();
                ctx.translate(50, 50);
                ctx.rotate((option.rotation * Math.PI) / 180);
                this.drawShapeOnContext(ctx, 0, 0, option.shape.type, option.shape.color, 20);
                ctx.restore();
            }
            
            optionBtn.appendChild(optionCanvas);
            optionBtn.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionBtn);
        });
    }
    
    /**
     * Draw shape on specific context
     */
    drawShapeOnContext(ctx, x, y, shape, color, size) {
        ctx.fillStyle = color || '#6C9E83';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        
        if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else if (shape === 'square') {
            ctx.fillRect(x - size, y - size, size * 2, size * 2);
            ctx.strokeRect(x - size, y - size, size * 2, size * 2);
        } else if (shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.lineTo(x - size, y + size);
            ctx.lineTo(x + size, y + size);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
    
    /**
     * Handle option selection
     */
    selectOption(index) {
        const pattern = this.patterns[this.currentPattern];
        const selected = pattern.options[index];
        const correct = this.compareOptions(selected, pattern.answer);
        
        // Record response
        const responseTime = performance.now() - this.patternStartTime;
        this.responses.push({
            pattern: this.currentPattern,
            type: pattern.type,
            difficulty: pattern.difficulty,
            correct: correct,
            responseTime: responseTime,
            selected: selected,
            answer: pattern.answer
        });
        
        // Update indicators
        this.updateNeurodivergentIndicators(pattern, correct, responseTime);
        
        // Show feedback
        this.showFeedback(correct);
        
        // Move to next pattern after delay
        setTimeout(() => {
            this.showPattern(this.currentPattern + 1);
        }, 1500);
    }
    
    /**
     * Compare two options
     */
    compareOptions(opt1, opt2) {
        if (opt1.type !== opt2.type) return false;
        
        if (opt1.type === 'number') {
            return opt1.value === opt2.value;
        } else if (opt1.type === 'shape') {
            return opt1.shape === opt2.shape && opt1.color === opt2.color;
        } else if (opt1.type === 'rotation') {
            return opt1.rotation === opt2.rotation;
        }
        
        return false;
    }
    
    /**
     * Update neurodivergent indicators
     */
    updateNeurodivergentIndicators(pattern, correct, responseTime) {
        // Track accuracy by pattern type
        if (!this.accuracyByType[pattern.type]) {
            this.accuracyByType[pattern.type] = { correct: 0, total: 0 };
        }
        this.accuracyByType[pattern.type].total++;
        if (correct) {
            this.accuracyByType[pattern.type].correct++;
        }
        
        // Processing speed
        this.processingSpeed.push(responseTime);
        
        // Detail focus vs holistic processing
        if (pattern.type === 'matrix' && correct) {
            this.holisticProcessing++;
        } else if (pattern.type === 'sequence' && correct) {
            this.detailFocus++;
        }
        
        // Adaptive difficulty adjustment
        this.adaptiveHistory.push({
            difficulty: pattern.difficulty,
            correct: correct,
            responseTime: responseTime
        });
    }
    
    /**
     * Calculate adaptive difficulty
     */
    calculateAdaptiveDifficulty() {
        if (this.adaptiveHistory.length < 2) {
            return this.currentDifficulty;
        }
        
        const recent = this.adaptiveHistory.slice(-3);
        const accuracy = recent.filter(r => r.correct).length / recent.length;
        const avgTime = recent.reduce((sum, r) => sum + r.responseTime, 0) / recent.length;
        
        if (accuracy > 0.8 && avgTime < 5000) {
            this.currentDifficulty = Math.min(3, this.currentDifficulty + 1);
        } else if (accuracy < 0.4 || avgTime > 15000) {
            this.currentDifficulty = Math.max(1, this.currentDifficulty - 1);
        }
        
        return this.currentDifficulty;
    }
    
    /**
     * Create pattern by type
     */
    createPattern(type, difficulty) {
        switch (type) {
            case 'sequence':
                return this.createSequencePattern(difficulty);
            case 'matrix':
                return this.createMatrixPattern(difficulty);
            case 'rotation':
                return this.createRotationPattern(difficulty);
            case 'symmetry':
                return this.createSymmetryPattern(difficulty);
            case 'rule-based':
                return this.createRuleBasedPattern(difficulty);
            default:
                return this.createSequencePattern(difficulty);
        }
    }
    
    /**
     * Additional pattern types...
     */
    createSymmetryPattern(difficulty) {
        // Implementation for symmetry patterns
        return this.createSequencePattern(difficulty); // Placeholder
    }
    
    createRuleBasedPattern(difficulty) {
        // Implementation for rule-based patterns
        return this.createMatrixPattern(difficulty); // Placeholder
    }
    
    generateMatrixElement(row, col, rule, difficulty) {
        // Generate element based on position and rule
        const shapes = ['circle', 'square', 'triangle'];
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
        
        return {
            type: 'shape',
            shape: shapes[(row + col) % shapes.length],
            color: colors[(row * col) % colors.length]
        };
    }
    
    generateShapeOptions(answer) {
        const shapes = ['circle', 'square', 'triangle'];
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1'];
        const options = [answer];
        
        for (let i = 0; i < 3; i++) {
            options.push({
                type: 'shape',
                shape: shapes[Math.floor(Math.random() * shapes.length)],
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        
        return options;
    }
    
    createComplexShape(difficulty) {
        return {
            type: difficulty === 1 ? 'square' : 'triangle',
            color: '#6C9E83'
        };
    }
    
    drawMatrix(pattern) {
        // Implementation for drawing matrix patterns
        this.drawSequence(pattern); // Placeholder
    }
    
    drawRotation(pattern) {
        // Implementation for drawing rotation patterns
        this.drawSequence(pattern); // Placeholder
    }
    
    /**
     * Complete task
     */
    completeTask() {
        // Calculate scores
        const totalCorrect = this.responses.filter(r => r.correct).length;
        const accuracy = totalCorrect / this.responses.length;
        const avgResponseTime = this.processingSpeed.reduce((a, b) => a + b, 0) / this.processingSpeed.length;
        
        // Neurodivergent indicators
        const patternRecognitionScore = {
            accuracy: accuracy,
            speed: avgResponseTime,
            detailFocus: this.detailFocus / this.responses.length,
            holisticProcessing: this.holisticProcessing / this.responses.length,
            accuracyByType: this.accuracyByType,
            adaptiveLearning: this.calculateLearningCurve()
        };
        
        // Autism indicators
        const autismIndicators = {
            patternRecognition: accuracy > 0.8 ? 0.7 : 0.3,
            detailOriented: this.detailFocus > this.holisticProcessing ? 0.6 : 0.2,
            systemizing: this.accuracyByType.sequence?.correct / this.accuracyByType.sequence?.total || 0
        };
        
        this.response = {
            patternRecognition: patternRecognitionScore,
            autismIndicators: autismIndicators,
            responses: this.responses
        };
        
        this.showCompletionFeedback(accuracy, avgResponseTime);
    }
    
    /**
     * Calculate learning curve
     */
    calculateLearningCurve() {
        if (this.responses.length < 4) return 0;
        
        const firstHalf = this.responses.slice(0, Math.floor(this.responses.length / 2));
        const secondHalf = this.responses.slice(Math.floor(this.responses.length / 2));
        
        const firstAccuracy = firstHalf.filter(r => r.correct).length / firstHalf.length;
        const secondAccuracy = secondHalf.filter(r => r.correct).length / secondHalf.length;
        
        return secondAccuracy - firstAccuracy; // Positive = improvement
    }
    
    /**
     * Show completion feedback
     */
    showCompletionFeedback(accuracy, avgTime) {
        const feedback = document.createElement('div');
        feedback.className = 'task-completion-feedback';
        feedback.innerHTML = `
            <h3>Pattern Recognition Complete!</h3>
            <div class="completion-stats">
                <div class="stat">
                    <span class="stat-label">Accuracy</span>
                    <span class="stat-value">${Math.round(accuracy * 100)}%</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Avg Response Time</span>
                    <span class="stat-value">${(avgTime / 1000).toFixed(1)}s</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Pattern Strength</span>
                    <span class="stat-value">${accuracy > 0.8 ? 'High' : accuracy > 0.5 ? 'Medium' : 'Developing'}</span>
                </div>
            </div>
        `;
        
        const container = document.querySelector('.task-pattern-recognition');
        if (container) {
            container.innerHTML = '';
            container.appendChild(feedback);
        }
    }
    
    /**
     * Add task-specific styles
     */
    addStyles() {
        if (document.getElementById('pattern-recognition-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'pattern-recognition-styles';
        styles.textContent = `
            .pattern-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
            }
            
            .pattern-progress {
                display: flex;
                gap: 2rem;
                font-size: 0.9rem;
                color: #666;
            }
            
            .timer-display {
                font-weight: 600;
                color: #6C9E83;
            }
            
            .pattern-display {
                background: white;
                border: 2px solid #E0E0E0;
                border-radius: 12px;
                padding: 2rem;
                margin-bottom: 2rem;
                display: flex;
                justify-content: center;
            }
            
            #pattern-canvas {
                max-width: 100%;
                height: auto;
            }
            
            .pattern-question {
                text-align: center;
                font-size: 1.2rem;
                margin-bottom: 2rem;
                color: #333;
            }
            
            .pattern-options {
                display: flex;
                justify-content: center;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .pattern-option-btn {
                background: white;
                border: 3px solid #E0E0E0;
                border-radius: 12px;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .pattern-option-btn:hover {
                border-color: #6C9E83;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(108, 158, 131, 0.2);
            }
            
            .pattern-option-btn.selected {
                border-color: #6C9E83;
                background: rgba(108, 158, 131, 0.1);
            }
            
            .pattern-option-btn.correct {
                border-color: #4CAF50;
                background: rgba(76, 175, 80, 0.1);
            }
            
            .pattern-option-btn.incorrect {
                border-color: #F44336;
                background: rgba(244, 67, 54, 0.1);
            }
            
            .pattern-feedback {
                text-align: center;
                padding: 1rem;
                border-radius: 8px;
                margin-top: 1rem;
            }
            
            .pattern-feedback.correct {
                background: rgba(76, 175, 80, 0.1);
                color: #4CAF50;
            }
            
            .pattern-feedback.incorrect {
                background: rgba(244, 67, 54, 0.1);
                color: #F44336;
            }
            
            .task-completion-feedback {
                text-align: center;
                padding: 3rem;
            }
            
            .completion-stats {
                display: flex;
                justify-content: center;
                gap: 3rem;
                margin-top: 2rem;
            }
            
            .completion-stats .stat {
                text-align: center;
            }
            
            .completion-stats .stat-label {
                display: block;
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 0.5rem;
            }
            
            .completion-stats .stat-value {
                display: block;
                font-size: 1.8rem;
                font-weight: 600;
                color: #6C9E83;
            }
        `;
        
        document.head.appendChild(styles);
    }
}

export default PatternRecognitionTask;