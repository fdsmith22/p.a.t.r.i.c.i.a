/**
 * Risk Balloon Task - Gamified risk assessment through balloon inflation game
 * Measures risk tolerance, learning ability, and behavioral adaptation
 */

import { BaseTask } from './base-task.js';

export class RiskBalloonTask extends BaseTask {
    constructor(taskData) {
        super(taskData);
        
        this.type = 'risk-balloon';
        this.balloons = taskData.balloons || 5; // Reduced to 5 balloons for better UX
        this.maxPumps = taskData.maxPumps || 128; // Maximum pumps before guaranteed pop
        this.pumpValue = taskData.pumpValue || 0.05; // Points per pump
        this.currency = this.detectCurrency(); // Auto-detect user's currency
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6B3', '#F7DC6F'];
        
        // Game state
        this.currentBalloon = 0;
        this.currentPumps = 0;
        this.totalScore = 0;
        this.balloonHistory = [];
        
        // Canvas setup
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        
        // Balloon properties
        this.balloon = {
            x: 0,
            y: 0,
            baseRadius: 30,
            currentRadius: 30,
            targetRadius: 30,
            color: this.colors[0],
            popped: false,
            particles: []
        };
        
        // Risk calculation parameters
        this.explosionProbabilities = this.generateExplosionCurve();
    }
    
    /**
     * Detect user's currency based on locale and timezone
     */
    detectCurrency() {
        const locale = navigator.language || 'en-US';
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        
        // Currency mapping based on locale
        const currencyMap = {
            'en-GB': { symbol: '£', code: 'GBP', name: 'pound' },
            'en-US': { symbol: '$', code: 'USD', name: 'dollar' },
            'en-CA': { symbol: '$', code: 'CAD', name: 'dollar' },
            'en-AU': { symbol: '$', code: 'AUD', name: 'dollar' },
            'en-NZ': { symbol: '$', code: 'NZD', name: 'dollar' },
            'en-IN': { symbol: '₹', code: 'INR', name: 'rupee' },
            'de-DE': { symbol: '€', code: 'EUR', name: 'euro' },
            'fr-FR': { symbol: '€', code: 'EUR', name: 'euro' },
            'es-ES': { symbol: '€', code: 'EUR', name: 'euro' },
            'it-IT': { symbol: '€', code: 'EUR', name: 'euro' },
            'pt-BR': { symbol: 'R$', code: 'BRL', name: 'real' },
            'ja-JP': { symbol: '¥', code: 'JPY', name: 'yen' },
            'zh-CN': { symbol: '¥', code: 'CNY', name: 'yuan' },
            'ko-KR': { symbol: '₩', code: 'KRW', name: 'won' },
            'ru-RU': { symbol: '₽', code: 'RUB', name: 'ruble' },
            'ar-SA': { symbol: 'ر.س', code: 'SAR', name: 'riyal' },
            'he-IL': { symbol: '₪', code: 'ILS', name: 'shekel' },
            'sv-SE': { symbol: 'kr', code: 'SEK', name: 'krona' },
            'no-NO': { symbol: 'kr', code: 'NOK', name: 'krone' },
            'da-DK': { symbol: 'kr', code: 'DKK', name: 'krone' },
            'pl-PL': { symbol: 'zł', code: 'PLN', name: 'zloty' },
            'tr-TR': { symbol: '₺', code: 'TRY', name: 'lira' },
            'th-TH': { symbol: '฿', code: 'THB', name: 'baht' },
            'id-ID': { symbol: 'Rp', code: 'IDR', name: 'rupiah' },
            'ms-MY': { symbol: 'RM', code: 'MYR', name: 'ringgit' },
            'vi-VN': { symbol: '₫', code: 'VND', name: 'dong' },
            'hi-IN': { symbol: '₹', code: 'INR', name: 'rupee' }
        };
        
        // Check locale first
        let currency = currencyMap[locale];
        
        // If not found, check by country code
        if (!currency) {
            const countryCode = locale.split('-')[1];
            if (countryCode === 'GB') currency = currencyMap['en-GB'];
            else if (countryCode === 'US') currency = currencyMap['en-US'];
            else if (countryCode === 'CA') currency = currencyMap['en-CA'];
            else if (countryCode === 'AU') currency = currencyMap['en-AU'];
            else if (countryCode === 'IN') currency = currencyMap['en-IN'];
            else if (timezone.includes('Europe')) currency = currencyMap['de-DE'];
            else currency = currencyMap['en-US']; // Default to USD
        }
        
        return currency || { symbol: '$', code: 'USD', name: 'dollar' };
    }
    
    /**
     * Format currency value
     */
    formatCurrency(value) {
        return `${this.currency.symbol}${value.toFixed(2)}`;
    }
    
    /**
     * Generate explosion probability curve
     */
    generateExplosionCurve() {
        const curve = [];
        for (let i = 0; i <= this.maxPumps; i++) {
            // Exponential increase in explosion probability
            const probability = Math.pow(i / this.maxPumps, 2);
            curve.push(probability);
        }
        return curve;
    }
    
    /**
     * Render the task UI
     */
    async render() {
        const container = this.createContainer();
        
        // Game info panel
        const infoPanel = document.createElement('div');
        infoPanel.className = 'balloon-info-panel';
        infoPanel.innerHTML = `
            <div class="balloon-stats">
                <div class="stat-item">
                    <span class="stat-label">Balloon</span>
                    <span class="stat-value" id="balloon-number">1 / ${this.balloons}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Current Value</span>
                    <span class="stat-value" id="current-value">${this.formatCurrency(0)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Total Earned</span>
                    <span class="stat-value" id="total-score">${this.formatCurrency(0)}</span>
                </div>
            </div>
        `;
        container.appendChild(infoPanel);
        
        // Canvas for balloon animation
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'balloon-canvas';
        this.canvas.width = 600;
        this.canvas.height = 400;
        container.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        
        // Control panel
        const controls = document.createElement('div');
        controls.className = 'balloon-controls';
        controls.innerHTML = `
            <button id="pump-button" class="btn btn-primary balloon-btn">
                <svg width="20" height="20">
                    <use href="assets/icons/icons.svg#icon-arrow-up"></use>
                </svg>
                Pump Balloon
            </button>
            <button id="collect-button" class="btn btn-secondary balloon-btn">
                <svg width="20" height="20">
                    <use href="assets/icons/icons.svg#icon-check"></use>
                </svg>
                Collect Money
            </button>
        `;
        container.appendChild(controls);
        
        // Risk indicator
        const riskIndicator = document.createElement('div');
        riskIndicator.className = 'risk-indicator';
        riskIndicator.innerHTML = `
            <div class="risk-bar">
                <div id="risk-fill" class="risk-fill"></div>
            </div>
            <span class="risk-label">Risk Level</span>
        `;
        container.appendChild(riskIndicator);
        
        // Add styles
        this.addStyles();
        
        return container;
    }
    
    /**
     * Initialize the task
     */
    async initialize() {
        await super.initialize();
        
        // Setup balloon position
        this.balloon.x = this.canvas.width / 2;
        this.balloon.y = this.canvas.height / 2;
        
        // Setup event listeners
        const pumpButton = document.getElementById('pump-button');
        const collectButton = document.getElementById('collect-button');
        
        pumpButton.addEventListener('click', () => this.pumpBalloon());
        collectButton.addEventListener('click', () => this.collectMoney());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.pumpBalloon();
            } else if (e.code === 'Enter') {
                e.preventDefault();
                this.collectMoney();
            }
        });
        
        // Start new balloon
        this.newBalloon();
        
        // Start animation loop
        this.animate();
    }
    
    /**
     * Start a new balloon
     */
    newBalloon() {
        this.currentBalloon++;
        this.currentPumps = 0;
        
        // Random color
        this.balloon.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.balloon.baseRadius = 30;
        this.balloon.currentRadius = 30;
        this.balloon.targetRadius = 30;
        this.balloon.popped = false;
        this.balloon.particles = [];
        
        // Update display
        document.getElementById('balloon-number').textContent = 
            `${this.currentBalloon} / ${this.balloons}`;
        document.getElementById('current-value').textContent = this.formatCurrency(0);
        document.getElementById('risk-fill').style.width = '0%';
        
        // Enable buttons
        document.getElementById('pump-button').disabled = false;
        document.getElementById('collect-button').disabled = false;
        
        this.logEvent('new_balloon', {
            number: this.currentBalloon,
            color: this.balloon.color
        });
    }
    
    /**
     * Pump the balloon
     */
    pumpBalloon() {
        if (this.balloon.popped || this.currentBalloon > this.balloons) return;
        
        this.currentPumps++;
        const currentValue = this.currentPumps * this.pumpValue;
        
        // Check if balloon pops
        const popProbability = this.explosionProbabilities[Math.min(this.currentPumps, this.maxPumps)];
        const shouldPop = Math.random() < popProbability;
        
        if (shouldPop || this.currentPumps >= this.maxPumps) {
            this.popBalloon();
        } else {
            // Increase balloon size
            this.balloon.targetRadius = this.balloon.baseRadius + (this.currentPumps * 2);
            
            // Update display
            document.getElementById('current-value').textContent = this.formatCurrency(currentValue);
            
            // Update risk indicator
            const riskPercent = (this.currentPumps / this.maxPumps) * 100;
            const riskFill = document.getElementById('risk-fill');
            riskFill.style.width = `${riskPercent}%`;
            
            // Change color based on risk
            if (riskPercent < 30) {
                riskFill.style.background = '#96E6B3';
            } else if (riskPercent < 60) {
                riskFill.style.background = '#F7DC6F';
            } else {
                riskFill.style.background = '#FF6B6B';
            }
            
            // Haptic feedback (if available)
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
            
            this.logEvent('pump', {
                balloon: this.currentBalloon,
                pumps: this.currentPumps,
                value: currentValue,
                risk: popProbability
            });
        }
    }
    
    /**
     * Pop the balloon
     */
    popBalloon() {
        this.balloon.popped = true;
        
        // Create explosion particles
        for (let i = 0; i < 20; i++) {
            this.balloon.particles.push({
                x: this.balloon.x,
                y: this.balloon.y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                radius: Math.random() * 5 + 2,
                color: this.balloon.color,
                life: 1
            });
        }
        
        // Disable buttons
        document.getElementById('pump-button').disabled = true;
        document.getElementById('collect-button').disabled = true;
        
        // Record data
        this.balloonHistory.push({
            balloon: this.currentBalloon,
            pumps: this.currentPumps,
            earned: 0,
            popped: true,
            color: this.balloon.color
        });
        
        // Show feedback
        this.showFeedback('💥 Balloon Popped! No money earned.', 'error');
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }
        
        this.logEvent('balloon_popped', {
            balloon: this.currentBalloon,
            pumps: this.currentPumps,
            potentialValue: this.currentPumps * this.pumpValue
        });
        
        // Next balloon after delay
        setTimeout(() => {
            if (this.currentBalloon < this.balloons) {
                this.newBalloon();
            } else {
                this.endTask();
            }
        }, 2000);
    }
    
    /**
     * Collect money from current balloon
     */
    collectMoney() {
        if (this.balloon.popped || this.currentPumps === 0) return;
        
        const earned = this.currentPumps * this.pumpValue;
        this.totalScore += earned;
        
        // Update display
        document.getElementById('total-score').textContent = `$${this.totalScore.toFixed(2)}`;
        
        // Record data
        this.balloonHistory.push({
            balloon: this.currentBalloon,
            pumps: this.currentPumps,
            earned: earned,
            popped: false,
            color: this.balloon.color
        });
        
        // Deflate animation
        this.balloon.targetRadius = 0;
        
        // Show feedback
        this.showFeedback(`✓ Collected $${earned.toFixed(2)}!`, 'success');
        
        this.logEvent('money_collected', {
            balloon: this.currentBalloon,
            pumps: this.currentPumps,
            earned: earned,
            total: this.totalScore
        });
        
        // Disable buttons during animation
        document.getElementById('pump-button').disabled = true;
        document.getElementById('collect-button').disabled = true;
        
        // Next balloon after animation
        setTimeout(() => {
            if (this.currentBalloon < this.balloons) {
                this.newBalloon();
            } else {
                this.endTask();
            }
        }, 1000);
    }
    
    /**
     * Animation loop
     */
    animate() {
        this.animationFrame = requestAnimationFrame(() => this.animate());
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw balloon shadow
        if (!this.balloon.popped && this.balloon.currentRadius > 0) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.beginPath();
            this.ctx.ellipse(
                this.balloon.x,
                this.balloon.y + this.balloon.currentRadius + 20,
                this.balloon.currentRadius * 0.8,
                this.balloon.currentRadius * 0.3,
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.restore();
        }
        
        // Animate balloon size
        if (this.balloon.currentRadius !== this.balloon.targetRadius) {
            const diff = this.balloon.targetRadius - this.balloon.currentRadius;
            this.balloon.currentRadius += diff * 0.1;
            
            if (Math.abs(diff) < 0.5) {
                this.balloon.currentRadius = this.balloon.targetRadius;
            }
        }
        
        // Draw balloon
        if (!this.balloon.popped && this.balloon.currentRadius > 0) {
            // Balloon body
            this.ctx.save();
            this.ctx.fillStyle = this.balloon.color;
            this.ctx.beginPath();
            this.ctx.arc(
                this.balloon.x,
                this.balloon.y,
                this.balloon.currentRadius,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            // Highlight
            const gradient = this.ctx.createRadialGradient(
                this.balloon.x - this.balloon.currentRadius * 0.3,
                this.balloon.y - this.balloon.currentRadius * 0.3,
                0,
                this.balloon.x,
                this.balloon.y,
                this.balloon.currentRadius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            this.ctx.restore();
            
            // String
            this.ctx.save();
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.balloon.x, this.balloon.y + this.balloon.currentRadius);
            this.ctx.lineTo(this.balloon.x, this.balloon.y + this.balloon.currentRadius + 100);
            this.ctx.stroke();
            this.ctx.restore();
        }
        
        // Draw particles
        this.balloon.particles = this.balloon.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.3; // Gravity
            particle.life -= 0.02;
            
            if (particle.life > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
                return true;
            }
            return false;
        });
    }
    
    /**
     * End the task
     */
    endTask() {
        cancelAnimationFrame(this.animationFrame);
        
        // Calculate risk metrics
        const riskMetrics = this.calculateRiskMetrics();
        
        this.response = {
            totalScore: this.totalScore,
            balloonHistory: this.balloonHistory,
            riskMetrics: riskMetrics
        };
        
        // Show completion message
        const avgPumps = riskMetrics.averagePumps.toFixed(1);
        const popRate = (riskMetrics.popRate * 100).toFixed(0);
        
        this.showFeedback(
            `Task Complete! Total: $${this.totalScore.toFixed(2)} | Avg Pumps: ${avgPumps} | Pop Rate: ${popRate}%`,
            'success'
        );
        
        this.logEvent('task_completed', {
            totalScore: this.totalScore,
            metrics: riskMetrics
        });
    }
    
    /**
     * Calculate risk-taking metrics
     */
    calculateRiskMetrics() {
        const collected = this.balloonHistory.filter(b => !b.popped);
        const popped = this.balloonHistory.filter(b => b.popped);
        
        // Average pumps before collection
        const avgPumpsCollected = collected.length > 0 ?
            collected.reduce((sum, b) => sum + b.pumps, 0) / collected.length : 0;
        
        // Average pumps before popping
        const avgPumpsPopped = popped.length > 0 ?
            popped.reduce((sum, b) => sum + b.pumps, 0) / popped.length : 0;
        
        // Learning curve - compare first half to second half
        const halfPoint = Math.floor(this.balloonHistory.length / 2);
        const firstHalf = this.balloonHistory.slice(0, halfPoint);
        const secondHalf = this.balloonHistory.slice(halfPoint);
        
        const firstHalfAvg = firstHalf.reduce((sum, b) => sum + b.pumps, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, b) => sum + b.pumps, 0) / secondHalf.length;
        
        // Color preference analysis
        const colorPerformance = {};
        this.colors.forEach(color => {
            const colorBalloons = this.balloonHistory.filter(b => b.color === color);
            if (colorBalloons.length > 0) {
                colorPerformance[color] = {
                    count: colorBalloons.length,
                    avgPumps: colorBalloons.reduce((sum, b) => sum + b.pumps, 0) / colorBalloons.length,
                    popRate: colorBalloons.filter(b => b.popped).length / colorBalloons.length
                };
            }
        });
        
        return {
            totalBalloons: this.balloonHistory.length,
            balloonsCollected: collected.length,
            balloonsPopped: popped.length,
            popRate: popped.length / this.balloonHistory.length,
            averagePumps: this.balloonHistory.reduce((sum, b) => sum + b.pumps, 0) / this.balloonHistory.length,
            avgPumpsCollected: avgPumpsCollected,
            avgPumpsPopped: avgPumpsPopped,
            learningCurve: secondHalfAvg - firstHalfAvg,
            adaptationRate: (secondHalfAvg - firstHalfAvg) / firstHalfAvg,
            colorPerformance: colorPerformance,
            riskTolerance: this.calculateRiskTolerance(),
            consistency: this.calculateConsistency()
        };
    }
    
    /**
     * Calculate risk tolerance score
     */
    calculateRiskTolerance() {
        const avgPumps = this.balloonHistory.reduce((sum, b) => sum + b.pumps, 0) / this.balloonHistory.length;
        
        // Normalize to 0-1 scale (assuming 64 pumps is maximum risk-taking)
        return Math.min(1, avgPumps / 64);
    }
    
    /**
     * Calculate behavioral consistency
     */
    calculateConsistency() {
        if (this.balloonHistory.length < 2) return 0;
        
        const pumps = this.balloonHistory.map(b => b.pumps);
        const mean = pumps.reduce((a, b) => a + b, 0) / pumps.length;
        const variance = pumps.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / pumps.length;
        const stdDev = Math.sqrt(variance);
        
        // Coefficient of variation (lower = more consistent)
        const cv = stdDev / mean;
        
        // Convert to 0-1 scale (1 = highly consistent)
        return Math.max(0, 1 - cv);
    }
    
    /**
     * Add custom styles
     */
    addStyles() {
        if (document.getElementById('balloon-task-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'balloon-task-styles';
        styles.textContent = `
            .task-risk-balloon {
                padding: var(--space-4);
            }
            
            .balloon-info-panel {
                background: var(--white);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                padding: var(--space-4);
                margin-bottom: var(--space-4);
            }
            
            .balloon-stats {
                display: flex;
                justify-content: space-between;
                gap: var(--space-4);
            }
            
            .stat-item {
                text-align: center;
                flex: 1;
            }
            
            .stat-label {
                display: block;
                font-size: var(--text-sm);
                color: var(--gray-600);
                margin-bottom: var(--space-1);
            }
            
            .stat-value {
                display: block;
                font-size: var(--text-xl);
                font-weight: var(--font-semibold);
                color: var(--sage-600);
            }
            
            .balloon-canvas {
                display: block;
                width: 100%;
                max-width: 600px;
                height: 400px;
                margin: 0 auto var(--space-4);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                background: linear-gradient(to bottom, #E3F2FD 0%, #FFFFFF 100%);
            }
            
            .balloon-controls {
                display: flex;
                gap: var(--space-3);
                justify-content: center;
                margin-bottom: var(--space-4);
            }
            
            .balloon-btn {
                min-width: 150px;
            }
            
            .risk-indicator {
                max-width: 400px;
                margin: 0 auto;
                text-align: center;
            }
            
            .risk-bar {
                height: 20px;
                background: var(--gray-200);
                border-radius: var(--radius-full);
                overflow: hidden;
                margin-bottom: var(--space-2);
            }
            
            .risk-fill {
                height: 100%;
                width: 0%;
                background: #96E6B3;
                transition: width 0.3s ease, background-color 0.3s ease;
            }
            
            .risk-label {
                font-size: var(--text-sm);
                color: var(--gray-600);
            }
            
            .task-feedback {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: var(--space-4);
                border-radius: var(--radius-lg);
                background: var(--white);
                box-shadow: var(--shadow-xl);
                z-index: 1000;
                animation: feedbackPulse 0.3s ease;
            }
            
            .feedback-success {
                border-left: 4px solid var(--sage-500);
                color: var(--sage-700);
            }
            
            .feedback-error {
                border-left: 4px solid #FF6B6B;
                color: #CC5555;
            }
            
            @keyframes feedbackPulse {
                0% {
                    transform: translate(-50%, -50%) scale(0.9);
                    opacity: 0;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.05);
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Export for use in task controller
export default RiskBalloonTask;