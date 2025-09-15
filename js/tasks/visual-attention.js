/**
 * Visual Attention Task - Eye tracking simulation and attention pattern analysis
 * Measures focus, distractibility, and visual processing patterns
 */

import { BaseTask } from './base-task.js';

export class VisualAttentionTask extends BaseTask {
    constructor(taskData) {
        super(taskData);
        
        this.type = 'visual-attention';
        this.timeLimit = taskData.timeLimit || 120000; // 2 minutes
        this.targetCount = taskData.targetCount || 20; // Total targets to find
        
        // Game state
        this.score = 0;
        this.targetsFound = 0;
        this.missedTargets = 0;
        this.falsePositives = 0;
        this.reactionTimes = [];
        this.clickPositions = [];
        
        // Canvas setup
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        
        // Visual elements
        this.targets = [];
        this.distractors = [];
        this.currentTarget = null;
        this.targetAppearTime = null;
        
        // Timing
        this.targetInterval = 3000; // New target every 3 seconds
        this.targetDuration = 2000; // Target visible for 2 seconds
        this.lastTargetTime = 0;
    }
    
    /**
     * Render the task UI
     */
    async render() {
        const container = this.createContainer();
        
        // Instructions
        const instructions = document.createElement('div');
        instructions.className = 'visual-attention-instructions';
        instructions.innerHTML = `
            <h3>Visual Attention Task</h3>
            <p>Click on the <span class="target-preview">⭐ stars</span> as quickly as you can.</p>
            <p>Ignore the <span class="distractor-preview">● dots</span> - they're distractors!</p>
        `;
        container.appendChild(instructions);
        
        // Score panel
        const scorePanel = document.createElement('div');
        scorePanel.className = 'visual-score-panel';
        scorePanel.innerHTML = `
            <div class="score-items">
                <div class="score-item">
                    <span class="score-label">Found</span>
                    <span class="score-value" id="targets-found">0</span>
                </div>
                <div class="score-item">
                    <span class="score-label">Missed</span>
                    <span class="score-value" id="targets-missed">0</span>
                </div>
                <div class="score-item">
                    <span class="score-label">Accuracy</span>
                    <span class="score-value" id="accuracy">100%</span>
                </div>
                <div class="score-item">
                    <span class="score-label">Time</span>
                    <span class="score-value" id="time-left">2:00</span>
                </div>
            </div>
        `;
        container.appendChild(scorePanel);
        
        // Canvas for visual field
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'visual-attention-canvas';
        this.canvas.width = 800;
        this.canvas.height = 500;
        container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        
        // Add click handler
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Heatmap toggle
        const controls = document.createElement('div');
        controls.className = 'visual-controls';
        controls.innerHTML = `
            <label class="heatmap-toggle">
                <input type="checkbox" id="show-heatmap">
                <span>Show attention heatmap</span>
            </label>
        `;
        container.appendChild(controls);
        
        // Add styles
        this.addStyles();
        
        return container;
    }
    
    /**
     * Initialize the task
     */
    async initialize() {
        await super.initialize();
        
        // Start game loop
        this.startGameLoop();
        
        // Start countdown timer
        this.startCountdown();
        
        // Initialize distractors
        this.createDistractors();
        
        this.logEvent('task_started');
    }
    
    /**
     * Create initial distractors
     */
    createDistractors() {
        for (let i = 0; i < 15; i++) {
            this.distractors.push({
                x: Math.random() * (this.canvas.width - 40) + 20,
                y: Math.random() * (this.canvas.height - 40) + 20,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: 8 + Math.random() * 4,
                color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`, // Blue-ish colors
                opacity: 0.3 + Math.random() * 0.4
            });
        }
    }
    
    /**
     * Start the game loop
     */
    startGameLoop() {
        const gameLoop = () => {
            this.animationFrame = requestAnimationFrame(gameLoop);
            
            // Clear canvas
            this.ctx.fillStyle = '#f8f9fa';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw grid pattern (subtle)
            this.drawGrid();
            
            // Update and draw distractors
            this.updateDistractors();
            
            // Spawn new target if needed
            const now = performance.now();
            if (now - this.lastTargetTime > this.targetInterval && this.targetsFound + this.missedTargets < this.targetCount) {
                this.spawnTarget();
                this.lastTargetTime = now;
            }
            
            // Update and draw current target
            if (this.currentTarget) {
                this.updateTarget();
            }
            
            // Draw heatmap if enabled
            if (document.getElementById('show-heatmap')?.checked) {
                this.drawHeatmap();
            }
        };
        
        gameLoop();
    }
    
    /**
     * Draw subtle grid pattern
     */
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Update and draw distractors
     */
    updateDistractors() {
        this.distractors.forEach(distractor => {
            // Update position
            distractor.x += distractor.vx;
            distractor.y += distractor.vy;
            
            // Bounce off walls
            if (distractor.x <= distractor.radius || distractor.x >= this.canvas.width - distractor.radius) {
                distractor.vx *= -1;
            }
            if (distractor.y <= distractor.radius || distractor.y >= this.canvas.height - distractor.radius) {
                distractor.vy *= -1;
            }
            
            // Draw distractor
            this.ctx.save();
            this.ctx.globalAlpha = distractor.opacity;
            this.ctx.fillStyle = distractor.color;
            this.ctx.beginPath();
            this.ctx.arc(distractor.x, distractor.y, distractor.radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    /**
     * Spawn a new target
     */
    spawnTarget() {
        // Random position, avoiding edges
        const margin = 50;
        const x = margin + Math.random() * (this.canvas.width - 2 * margin);
        const y = margin + Math.random() * (this.canvas.height - 2 * margin);
        
        this.currentTarget = {
            x: x,
            y: y,
            radius: 20,
            pulsePhase: 0,
            appearTime: performance.now(),
            fadeIn: true
        };
        
        this.targetAppearTime = performance.now();
        
        this.logEvent('target_spawned', { x, y });
    }
    
    /**
     * Update and draw current target
     */
    updateTarget() {
        if (!this.currentTarget) return;
        
        const now = performance.now();
        const age = now - this.currentTarget.appearTime;
        
        // Check if target expired
        if (age > this.targetDuration) {
            this.missTarget();
            return;
        }
        
        // Fade in/out effect
        let alpha = 1;
        if (age < 200) {
            alpha = age / 200;
        } else if (age > this.targetDuration - 200) {
            alpha = (this.targetDuration - age) / 200;
        }
        
        // Pulsing effect
        this.currentTarget.pulsePhase += 0.05;
        const pulseScale = 1 + Math.sin(this.currentTarget.pulsePhase) * 0.1;
        
        // Draw target (star shape)
        this.ctx.save();
        this.ctx.globalAlpha = alpha;
        this.ctx.translate(this.currentTarget.x, this.currentTarget.y);
        this.ctx.scale(pulseScale, pulseScale);
        
        // Draw star
        this.ctx.fillStyle = '#FFD700';
        this.ctx.strokeStyle = '#FFA500';
        this.ctx.lineWidth = 2;
        this.drawStar(0, 0, this.currentTarget.radius);
        
        this.ctx.restore();
    }
    
    /**
     * Draw a star shape
     */
    drawStar(cx, cy, radius) {
        const spikes = 5;
        const outerRadius = radius;
        const innerRadius = radius * 0.5;
        
        this.ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const angle = (Math.PI / spikes) * i - Math.PI / 2;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    /**
     * Handle canvas click
     */
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Record click position for heatmap
        this.clickPositions.push({ x, y, timestamp: performance.now() });
        
        // Check if target was clicked
        if (this.currentTarget) {
            const distance = Math.sqrt(
                Math.pow(x - this.currentTarget.x, 2) + 
                Math.pow(y - this.currentTarget.y, 2)
            );
            
            if (distance <= this.currentTarget.radius * 1.5) {
                // Hit!
                this.hitTarget();
            } else {
                // Miss - false positive
                this.falsePositives++;
                this.showFeedback(x, y, 'Miss!', '#FF6B6B');
            }
        } else {
            // No target - false positive
            this.falsePositives++;
            this.showFeedback(x, y, 'No target!', '#FF6B6B');
        }
        
        this.updateScore();
    }
    
    /**
     * Handle mouse movement for tracking
     */
    handleMouseMove(event) {
        // Could be used for more detailed attention tracking
        // Currently not implemented to reduce data volume
    }
    
    /**
     * Target was successfully hit
     */
    hitTarget() {
        const reactionTime = performance.now() - this.targetAppearTime;
        this.reactionTimes.push(reactionTime);
        
        this.targetsFound++;
        this.score += Math.max(100 - Math.floor(reactionTime / 20), 10);
        
        // Visual feedback
        this.showFeedback(
            this.currentTarget.x, 
            this.currentTarget.y, 
            `+${Math.max(100 - Math.floor(reactionTime / 20), 10)}`, 
            '#4ECDC4'
        );
        
        this.currentTarget = null;
        
        this.logEvent('target_hit', { 
            reactionTime, 
            targetsFound: this.targetsFound 
        });
        
        this.updateScore();
    }
    
    /**
     * Target was missed (timed out)
     */
    missTarget() {
        this.missedTargets++;
        
        // Visual feedback
        if (this.currentTarget) {
            this.showFeedback(
                this.currentTarget.x, 
                this.currentTarget.y, 
                'Missed!', 
                '#FF6B6B'
            );
        }
        
        this.currentTarget = null;
        
        this.logEvent('target_missed', { 
            missedTargets: this.missedTargets 
        });
        
        this.updateScore();
    }
    
    /**
     * Show visual feedback at position
     */
    showFeedback(x, y, text, color) {
        const feedback = {
            x, y, text, color,
            opacity: 1,
            offsetY: 0
        };
        
        const animate = () => {
            if (feedback.opacity <= 0) return;
            
            this.ctx.save();
            this.ctx.globalAlpha = feedback.opacity;
            this.ctx.fillStyle = color;
            this.ctx.font = 'bold 20px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, feedback.x, feedback.y - feedback.offsetY);
            this.ctx.restore();
            
            feedback.opacity -= 0.02;
            feedback.offsetY += 1;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Update score display
     */
    updateScore() {
        document.getElementById('targets-found').textContent = this.targetsFound;
        document.getElementById('targets-missed').textContent = this.missedTargets;
        
        const total = this.targetsFound + this.missedTargets + this.falsePositives;
        const accuracy = total > 0 ? (this.targetsFound / total * 100) : 100;
        document.getElementById('accuracy').textContent = `${accuracy.toFixed(0)}%`;
    }
    
    /**
     * Start countdown timer
     */
    startCountdown() {
        const startTime = performance.now();
        
        const updateTimer = () => {
            const elapsed = performance.now() - startTime;
            const remaining = Math.max(0, this.timeLimit - elapsed);
            
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            
            document.getElementById('time-left').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (remaining > 0 && this.targetsFound + this.missedTargets < this.targetCount) {
                requestAnimationFrame(updateTimer);
            } else {
                this.completeTask();
            }
        };
        
        updateTimer();
    }
    
    /**
     * Draw attention heatmap
     */
    drawHeatmap() {
        if (this.clickPositions.length === 0) return;
        
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        
        this.clickPositions.forEach(click => {
            const gradient = this.ctx.createRadialGradient(
                click.x, click.y, 0,
                click.x, click.y, 50
            );
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(click.x - 50, click.y - 50, 100, 100);
        });
        
        this.ctx.restore();
    }
    
    /**
     * Complete the task
     */
    completeTask() {
        // Stop animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Calculate metrics
        const avgReactionTime = this.reactionTimes.length > 0 ?
            this.reactionTimes.reduce((a, b) => a + b, 0) / this.reactionTimes.length : 0;
        
        const accuracy = (this.targetsFound / (this.targetsFound + this.missedTargets + this.falsePositives)) * 100;
        
        // Analyze click distribution
        const clickDistribution = this.analyzeClickDistribution();
        
        this.response = {
            targetsFound: this.targetsFound,
            targetsMissed: this.missedTargets,
            falsePositives: this.falsePositives,
            accuracy: accuracy,
            averageReactionTime: avgReactionTime,
            reactionTimes: this.reactionTimes,
            clickDistribution: clickDistribution,
            score: this.score
        };
        
        // Show completion
        this.showCompletion();
        
        this.logEvent('task_completed', this.response);
    }
    
    /**
     * Analyze click distribution for attention patterns
     */
    analyzeClickDistribution() {
        if (this.clickPositions.length === 0) return null;
        
        // Divide canvas into quadrants
        const quadrants = [0, 0, 0, 0]; // TL, TR, BL, BR
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.clickPositions.forEach(click => {
            if (click.x < centerX && click.y < centerY) quadrants[0]++;
            else if (click.x >= centerX && click.y < centerY) quadrants[1]++;
            else if (click.x < centerX && click.y >= centerY) quadrants[2]++;
            else quadrants[3]++;
        });
        
        // Calculate spread (standard deviation from center)
        const distances = this.clickPositions.map(click => 
            Math.sqrt(Math.pow(click.x - centerX, 2) + Math.pow(click.y - centerY, 2))
        );
        const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
        
        return {
            quadrants: quadrants,
            averageDistanceFromCenter: avgDistance,
            totalClicks: this.clickPositions.length,
            clicksPerSecond: this.clickPositions.length / (this.timeLimit / 1000)
        };
    }
    
    /**
     * Show completion screen
     */
    showCompletion() {
        const container = document.querySelector('.task-content');
        
        const performanceLevel = this.response.accuracy > 80 ? 'Excellent' :
                                this.response.accuracy > 60 ? 'Good' :
                                this.response.accuracy > 40 ? 'Fair' : 'Needs Practice';
        
        container.innerHTML = `
            <div class="visual-completion">
                <h3>Visual Attention Task Complete!</h3>
                <div class="completion-stats">
                    <div class="stat-row">
                        <span class="stat-label">Targets Found:</span>
                        <span class="stat-value">${this.targetsFound} / ${this.targetCount}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Accuracy:</span>
                        <span class="stat-value">${this.response.accuracy.toFixed(1)}%</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Avg Reaction Time:</span>
                        <span class="stat-value">${this.response.averageReactionTime.toFixed(0)}ms</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Performance:</span>
                        <span class="stat-value">${performanceLevel}</span>
                    </div>
                </div>
                <p class="completion-message">Your visual attention patterns have been recorded.</p>
            </div>
        `;
    }
    
    /**
     * Add custom styles
     */
    addStyles() {
        if (document.getElementById('visual-attention-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'visual-attention-styles';
        styles.textContent = `
            .visual-attention-instructions {
                margin-bottom: var(--space-4);
                padding: var(--space-3);
                background: var(--sage-50);
                border-radius: var(--radius-lg);
                text-align: center;
            }
            
            .visual-attention-instructions h3 {
                color: var(--sage-700);
                margin-bottom: var(--space-2);
            }
            
            .target-preview {
                color: #FFD700;
                font-size: var(--text-xl);
                font-weight: bold;
            }
            
            .distractor-preview {
                color: #4A90E2;
                font-size: var(--text-xl);
            }
            
            .visual-score-panel {
                margin-bottom: var(--space-4);
                padding: var(--space-3);
                background: var(--white);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
            }
            
            .score-items {
                display: flex;
                justify-content: space-around;
                gap: var(--space-4);
            }
            
            .score-item {
                text-align: center;
            }
            
            .score-label {
                display: block;
                font-size: var(--text-sm);
                color: var(--gray-600);
                margin-bottom: var(--space-1);
            }
            
            .score-value {
                display: block;
                font-size: var(--text-xl);
                font-weight: var(--font-semibold);
                color: var(--sage-600);
            }
            
            .visual-attention-canvas {
                display: block;
                width: 100%;
                max-width: 800px;
                height: auto;
                margin: 0 auto var(--space-4);
                border: 2px solid var(--border-color);
                border-radius: var(--radius-lg);
                cursor: crosshair;
                background: #f8f9fa;
            }
            
            .visual-controls {
                text-align: center;
            }
            
            .heatmap-toggle {
                display: inline-flex;
                align-items: center;
                gap: var(--space-2);
                cursor: pointer;
                padding: var(--space-2) var(--space-3);
                background: var(--white);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-full);
                transition: all 0.2s ease;
            }
            
            .heatmap-toggle:hover {
                background: var(--sage-50);
                border-color: var(--sage-300);
            }
            
            .visual-completion {
                text-align: center;
                padding: var(--space-6);
                background: linear-gradient(135deg, var(--sage-50) 0%, var(--white) 100%);
                border-radius: var(--radius-xl);
                border: 2px solid var(--sage-200);
            }
            
            /* Dark mode adjustments */
            [data-theme="dark"] .visual-attention-canvas {
                background: #2a2a2a;
                border-color: var(--gray-600);
            }
            
            [data-theme="dark"] .visual-score-panel {
                background: var(--gray-100);
                border-color: var(--gray-300);
            }
            
            [data-theme="dark"] .visual-completion {
                background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-50) 100%);
                border-color: var(--sage-600);
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export for use in task controller
export default VisualAttentionTask;