/**
 * P.A.T.R.I.C.I.A Enhanced Application
 * Advanced interactions and animations
 */

import { AssessmentEngine } from './modules/AssessmentEngine.js';
import { ErrorHandler } from './modules/ErrorHandler.js';
import { ParticleSystem } from './modules/ParticleSystem.js';
import { UIManager } from './modules/UIManager.js';
import { StorageManager } from './modules/StorageManager.js';
import { AnimationController } from './modules/AnimationController.js';

class PatriciaEnhancedApp {
    constructor() {
        this.state = {
            isInitialized: false,
            currentMode: null,
            currentScreen: 'welcome',
            assessmentStarted: false,
            titleAnimated: false
        };
        
        this.modules = {};
        this.init();
    }
    
    async init() {
        try {
            // Initialize modules
            this.modules.errorHandler = new ErrorHandler();
            this.modules.ui = new UIManager();
            this.modules.storage = new StorageManager();
            this.modules.assessment = new AssessmentEngine();
            this.modules.particles = new ParticleSystem({
                maxParticles: 60,
                enabled: true
            });
            this.modules.animations = new AnimationController();
            
            // Setup enhanced interactions
            this.setupEnhancedInteractions();
            this.animateTitle();
            this.setupRippleEffects();
            this.setupHoverEffects();
            this.setupModeSelection();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Check for saved progress
            await this.checkSavedProgress();
            
            this.state.isInitialized = true;
            console.log('P.A.T.R.I.C.I.A Enhanced initialized');
            
        } catch (error) {
            console.error('Failed to initialize:', error);
            this.showError('Failed to initialize the assessment.');
        }
    }
    
    animateTitle() {
        if (this.state.titleAnimated) return;
        
        const letters = document.querySelectorAll('.title-letter');
        letters.forEach((letter, index) => {
            // Add staggered entrance animation
            setTimeout(() => {
                letter.style.animation = 'letterEntrance 0.5s ease forwards';
            }, index * 50);
            
            // Add hover sound effect (optional)
            letter.addEventListener('mouseenter', () => {
                this.playHoverSound();
                this.createLetterParticles(letter);
            });
            
            // Add click interaction
            letter.addEventListener('click', () => {
                this.explodeLetter(letter);
            });
        });
        
        // Animate acronym breakdown
        setTimeout(() => {
            const acronymWords = document.querySelectorAll('.acronym-word');
            acronymWords.forEach((word, index) => {
                setTimeout(() => {
                    word.style.animation = 'fadeInUp 0.5s ease forwards';
                    word.style.opacity = '1';
                }, 1000 + (index * 100));
            });
        }, 500);
        
        this.state.titleAnimated = true;
    }
    
    createLetterParticles(letter) {
        const rect = letter.getBoundingClientRect();
        const particles = 5;
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('span');
            particle.className = 'letter-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 4px;
                height: 4px;
                background: linear-gradient(135deg, var(--neural-purple), var(--neural-blue));
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: particleBurst 1s ease forwards;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }
    
    explodeLetter(letter) {
        letter.style.animation = 'letterExplode 0.5s ease';
        setTimeout(() => {
            letter.style.animation = 'letterFloat 3s ease-in-out infinite';
            letter.style.animationDelay = `calc(var(--index) * 0.1s)`;
        }, 500);
    }
    
    setupRippleEffects() {
        document.querySelectorAll('.btn, .mode-option, .feature-card').forEach(element => {
            element.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                element.style.position = 'relative';
                element.style.overflow = 'hidden';
                element.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
    
    setupHoverEffects() {
        // Feature cards 3D tilt effect
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
        
        // Progress stats counter animation
        document.querySelectorAll('.progress-stat').forEach(stat => {
            stat.addEventListener('mouseenter', () => {
                const value = stat.querySelector('.progress-stat-value');
                if (value) {
                    value.style.animation = 'countUp 0.5s ease';
                }
            });
        });
    }
    
    setupModeSelection() {
        const modeOptions = document.querySelectorAll('.mode-option');
        const startBtn = document.getElementById('start-assessment');
        
        modeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove previous selection
                modeOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selection with animation
                option.classList.add('selected');
                option.style.animation = 'selectPulse 0.5s ease';
                
                // Store mode
                this.state.currentMode = option.dataset.mode;
                
                // Enable start button with animation
                startBtn.disabled = false;
                startBtn.style.animation = 'buttonReady 0.5s ease';
                
                // Update button text
                const modeName = option.querySelector('h4').textContent;
                startBtn.querySelector('span').textContent = `Begin ${modeName}`;
                
                // Show notification
                this.modules.ui.showNotification(
                    `Selected: ${modeName}`,
                    'success',
                    3000
                );
                
                // Trigger confetti for selection
                this.triggerMiniConfetti(option);
            });
        });
    }
    
    triggerMiniConfetti(element) {
        const rect = element.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 30,
                spread: 40,
                origin: { x, y },
                colors: ['#6B9BD1', '#A584B7', '#5EBAA0'],
                ticks: 100,
                gravity: 0.5,
                scalar: 0.5
            });
        }
    }
    
    setupEnhancedInteractions() {
        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
        
        // Magnetic cursor effect for buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
        
        // Tooltip system
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.getElementById('tooltip');
                tooltip.textContent = element.dataset.tooltip;
                tooltip.classList.remove('hidden');
                
                const rect = element.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 + 'px';
                tooltip.style.top = rect.top - 40 + 'px';
            });
            
            element.addEventListener('mouseleave', () => {
                document.getElementById('tooltip').classList.add('hidden');
            });
        });
    }
    
    setupEventListeners() {
        // Start assessment
        document.getElementById('start-assessment')?.addEventListener('click', () => {
            this.startAssessment();
        });
        
        // Navigation
        document.getElementById('prev-button')?.addEventListener('click', () => {
            this.navigateQuestion('prev');
        });
        
        document.getElementById('next-button')?.addEventListener('click', () => {
            this.navigateQuestion('next');
        });
        
        document.getElementById('skip-button')?.addEventListener('click', () => {
            this.skipQuestion();
        });
        
        document.getElementById('flag-button')?.addEventListener('click', () => {
            this.flagQuestion();
        });
        
        // Progress toggle
        document.querySelector('.progress-toggle')?.addEventListener('click', () => {
            this.toggleProgress();
        });
        
        // Results actions
        document.getElementById('download-results')?.addEventListener('click', () => {
            this.downloadResults();
        });
        
        document.getElementById('share-results')?.addEventListener('click', () => {
            this.shareResults();
        });
        
        document.getElementById('retake-assessment')?.addEventListener('click', () => {
            this.retakeAssessment();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveProgress();
                        break;
                    case 'Enter':
                        e.preventDefault();
                        this.navigateQuestion('next');
                        break;
                }
            }
        });
    }
    
    async startAssessment() {
        if (!this.state.currentMode) {
            this.modules.ui.showNotification('Please select an assessment mode', 'warning');
            return;
        }
        
        // Animate transition
        const welcomeScreen = document.getElementById('welcome-screen');
        welcomeScreen.style.animation = 'fadeOutScale 0.5s ease forwards';
        
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            
            this.modules.assessment.startAssessment(this.state.currentMode, 'validated');
            this.state.assessmentStarted = true;
            
            const questionScreen = document.getElementById('question-screen');
            questionScreen.classList.remove('hidden');
            questionScreen.style.animation = 'fadeInScale 0.5s ease forwards';
            
            this.displayCurrentQuestion();
            this.startProgressTracking();
            
            // Celebration for starting
            this.triggerMiniConfetti(questionScreen);
        }, 500);
    }
    
    displayCurrentQuestion() {
        const question = this.modules.assessment.getCurrentQuestion();
        if (!question) return;
        
        // Update header with animation
        const questionNum = document.getElementById('question-num');
        questionNum.style.animation = 'numberFlip 0.5s ease';
        questionNum.textContent = this.modules.assessment.state.currentQuestionIndex + 1;
        
        document.getElementById('question-category').textContent = question.category;
        
        // Render question with entrance animation
        const contentEl = document.getElementById('question-content');
        contentEl.style.animation = 'questionEntrance 0.5s ease';
        contentEl.innerHTML = this.renderEnhancedQuestion(question);
        
        this.setupQuestionInteractions(question);
        this.updateProgress();
    }
    
    renderEnhancedQuestion(question) {
        let html = `<h2 class="question-text gradient-text">${question.text}</h2>`;
        
        // Add enhanced rendering based on question type
        switch (question.type) {
            case 'visual':
                html += this.renderEnhancedVisualOptions(question.options);
                break;
            case 'scenario':
                html += this.renderEnhancedScenarioOptions(question.options);
                break;
            case 'spectrum':
                html += this.renderEnhancedSpectrum(question);
                break;
            default:
                html += this.renderEnhancedStandardOptions(question.options);
        }
        
        return html;
    }
    
    renderEnhancedVisualOptions(options) {
        let html = '<div class="visual-grid">';
        options.forEach((option, index) => {
            html += `
                <div class="visual-option glass hover-lift" data-value="${option.value || index}">
                    <span class="emoji animate-float">${option.emoji || '🔵'}</span>
                    <span class="label">${option.label}</span>
                    <div class="selection-indicator"></div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }
    
    renderEnhancedScenarioOptions(options) {
        let html = '<div class="scenario-options">';
        options.forEach((option, index) => {
            html += `
                <div class="scenario-option glass hover-lift" data-value="${option.value || index}">
                    <div class="scenario-content">
                        <h4 class="gradient-text">${option.title}</h4>
                        <p>${option.description}</p>
                    </div>
                    <div class="scenario-hover-effect"></div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }
    
    renderEnhancedSpectrum(question) {
        return `
            <div class="spectrum-container glass p-4">
                <div class="spectrum-labels flex justify-between mb-2">
                    <span class="text-sm font-semibold">${question.leftLabel || 'Strongly Disagree'}</span>
                    <span class="text-sm font-semibold">${question.rightLabel || 'Strongly Agree'}</span>
                </div>
                <div class="spectrum-slider" id="spectrum-slider">
                    <div class="spectrum-track"></div>
                    <div class="spectrum-handle animate-pulse-glow" id="spectrum-handle" style="left: 50%">
                        <span class="spectrum-value">50</span>
                    </div>
                </div>
                <div class="spectrum-markers flex justify-between mt-2">
                    <span class="spectrum-marker" data-value="0">0</span>
                    <span class="spectrum-marker" data-value="25">25</span>
                    <span class="spectrum-marker" data-value="50">50</span>
                    <span class="spectrum-marker" data-value="75">75</span>
                    <span class="spectrum-marker" data-value="100">100</span>
                </div>
                <input type="hidden" id="spectrum-value" value="50">
            </div>
        `;
    }
    
    renderEnhancedStandardOptions(options) {
        let html = '<div class="standard-options grid gap-3">';
        options.forEach((option, index) => {
            html += `
                <button class="option-button glass hover-lift" data-value="${option.value || index}">
                    <span class="option-text">${option.label}</span>
                    <span class="option-indicator"></span>
                </button>
            `;
        });
        html += '</div>';
        return html;
    }
    
    setupQuestionInteractions(question) {
        // Enhanced interactions based on question type
        if (question.type === 'spectrum') {
            this.setupEnhancedSpectrum();
        } else {
            this.setupEnhancedOptions();
        }
    }
    
    setupEnhancedOptions() {
        const options = document.querySelectorAll('.visual-option, .scenario-option, .option-button');
        
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                // Remove previous selection with animation
                options.forEach(opt => {
                    opt.classList.remove('selected');
                    opt.style.animation = '';
                });
                
                // Add selection with animation
                e.currentTarget.classList.add('selected');
                e.currentTarget.style.animation = 'selectionPulse 0.5s ease';
                
                // Store response
                this.storeResponse(e.currentTarget.dataset.value);
                
                // Enable next button
                const nextBtn = document.getElementById('next-button');
                nextBtn.disabled = false;
                nextBtn.style.animation = 'buttonReady 0.5s ease';
            });
        });
    }
    
    setupEnhancedSpectrum() {
        const slider = document.getElementById('spectrum-slider');
        const handle = document.getElementById('spectrum-handle');
        const valueInput = document.getElementById('spectrum-value');
        const valueDisplay = handle?.querySelector('.spectrum-value');
        
        if (!slider || !handle) return;
        
        let isDragging = false;
        
        const updatePosition = (e) => {
            const rect = slider.getBoundingClientRect();
            const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const relativeX = x - rect.left;
            const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
            
            handle.style.left = `${percentage}%`;
            const value = Math.round(percentage);
            valueInput.value = value;
            if (valueDisplay) valueDisplay.textContent = value;
            
            // Update color based on position
            const hue = percentage * 1.2; // 0 to 120 (red to green)
            handle.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${hue + 30}, 70%, 60%))`;
            
            this.storeResponse(value);
        };
        
        handle.addEventListener('mousedown', () => isDragging = true);
        handle.addEventListener('touchstart', () => isDragging = true);
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) updatePosition(e);
        });
        
        document.addEventListener('touchmove', (e) => {
            if (isDragging) updatePosition(e);
        });
        
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('touchend', () => isDragging = false);
        
        slider.addEventListener('click', updatePosition);
        
        // Enable next button
        const nextBtn = document.getElementById('next-button');
        nextBtn.disabled = false;
    }
    
    storeResponse(value) {
        this.modules.assessment.saveResponse({ value });
        
        // Visual feedback
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.animation = 'progressPulse 0.5s ease';
        }
    }
    
    navigateQuestion(direction) {
        const contentEl = document.getElementById('question-content');
        
        // Animate out
        contentEl.style.animation = direction === 'next' ? 
            'questionExitLeft 0.3s ease' : 
            'questionExitRight 0.3s ease';
        
        setTimeout(() => {
            let moved = false;
            
            if (direction === 'next') {
                moved = this.modules.assessment.nextQuestion();
                if (!moved) {
                    this.completeAssessment();
                    return;
                }
            } else {
                moved = this.modules.assessment.previousQuestion();
            }
            
            if (moved) {
                this.displayCurrentQuestion();
            }
        }, 300);
    }
    
    skipQuestion() {
        this.modules.ui.showNotification('Question skipped - you can return to it later', 'info');
        this.navigateQuestion('next');
    }
    
    flagQuestion() {
        const currentIndex = this.modules.assessment.state.currentQuestionIndex;
        this.modules.storage.set(`flagged_${currentIndex}`, true);
        
        const flagBtn = document.getElementById('flag-button');
        flagBtn.textContent = '🚩 Flagged';
        flagBtn.style.animation = 'flagPulse 0.5s ease';
        
        this.modules.ui.showNotification('Question flagged for review', 'success');
    }
    
    toggleProgress() {
        const container = document.querySelector('.progress-container');
        container.classList.toggle('minimized');
        
        const icon = document.querySelector('.progress-toggle-icon');
        icon.style.transform = container.classList.contains('minimized') ? 
            'rotate(180deg)' : 'rotate(0)';
    }
    
    updateProgress() {
        const progress = this.modules.assessment.getProgress();
        
        // Animate number changes
        this.animateNumber('current-question', progress.currentQuestion);
        this.animateNumber('total-questions', progress.totalQuestions);
        this.animateNumber('answered-questions', progress.answeredQuestions);
        this.animateNumber('completion-rate', `${progress.percentComplete}%`);
        
        // Update progress bar with animation
        const progressFill = document.getElementById('progress-fill');
        progressFill.style.width = `${progress.percentComplete}%`;
        
        // Update time
        const minutes = Math.floor(progress.timeElapsed / 60000);
        const seconds = Math.floor((progress.timeElapsed % 60000) / 1000);
        document.getElementById('time-elapsed').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    animateNumber(elementId, value) {
        const element = document.getElementById(elementId);
        if (element && element.textContent !== value.toString()) {
            element.style.animation = 'numberChange 0.3s ease';
            setTimeout(() => {
                element.textContent = value;
                element.style.animation = '';
            }, 150);
        }
    }
    
    startProgressTracking() {
        this.progressInterval = setInterval(() => {
            this.updateProgress();
        }, 1000);
    }
    
    async completeAssessment() {
        clearInterval(this.progressInterval);
        
        // Show loading with progress
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.remove('hidden');
        
        const loadingProgress = loadingScreen.querySelector('.progress-bar-fill');
        let progress = 0;
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 30;
            progress = Math.min(progress, 95);
            loadingProgress.style.width = `${progress}%`;
        }, 200);
        
        // Calculate results
        const results = await this.modules.assessment.completeAssessment();
        
        // Complete loading
        clearInterval(loadingInterval);
        loadingProgress.style.width = '100%';
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            this.displayResults(results);
            
            // Celebration
            this.celebrateCompletion();
        }, 500);
    }
    
    displayResults(results) {
        const questionScreen = document.getElementById('question-screen');
        const resultsScreen = document.getElementById('results-screen');
        
        questionScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        resultsScreen.style.animation = 'resultsReveal 1s ease';
        
        // Render results content
        const contentEl = document.getElementById('results-content');
        contentEl.innerHTML = this.renderEnhancedResults(results);
    }
    
    renderEnhancedResults(results) {
        // Enhanced results visualization
        return `
            <div class="results-grid grid gap-4">
                <div class="result-card glass p-4 hover-lift">
                    <h3 class="text-xl font-bold gradient-text mb-3">Personality Profile</h3>
                    <div class="trait-bars">
                        ${this.renderTraitBars(results)}
                    </div>
                </div>
                
                <div class="result-card glass p-4 hover-lift">
                    <h3 class="text-xl font-bold gradient-text mb-3">Key Insights</h3>
                    <div class="insights">
                        ${this.renderInsights(results)}
                    </div>
                </div>
                
                <div class="result-card glass p-4 hover-lift">
                    <h3 class="text-xl font-bold gradient-text mb-3">Recommendations</h3>
                    <div class="recommendations">
                        ${this.renderRecommendations(results)}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTraitBars(results) {
        // Placeholder for trait visualization
        return '<p>Detailed trait analysis...</p>';
    }
    
    renderInsights(results) {
        // Placeholder for insights
        return '<p>Personalized insights based on your responses...</p>';
    }
    
    renderRecommendations(results) {
        // Placeholder for recommendations
        return '<p>Growth recommendations and action items...</p>';
    }
    
    celebrateCompletion() {
        if (typeof confetti === 'function') {
            // Multiple confetti bursts
            const count = 5;
            const defaults = {
                origin: { y: 0.7 },
                zIndex: 10000
            };
            
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    confetti({
                        ...defaults,
                        particleCount: 100,
                        spread: 70,
                        startVelocity: 30 + (i * 10),
                        colors: ['#6B9BD1', '#A584B7', '#5EBAA0', '#F09090', '#E5B055']
                    });
                }, i * 200);
            }
        }
    }
    
    downloadResults() {
        this.modules.ui.showNotification('Preparing your report...', 'info');
        // Implementation for downloading results
    }
    
    shareResults() {
        this.modules.ui.showNotification('Share feature coming soon!', 'info');
        // Implementation for sharing results
    }
    
    retakeAssessment() {
        if (confirm('Are you sure you want to start over?')) {
            this.modules.assessment.resetAssessment();
            location.reload();
        }
    }
    
    saveProgress() {
        this.modules.assessment.saveState();
        this.modules.ui.showNotification('Progress saved!', 'success');
    }
    
    async checkSavedProgress() {
        const hasSaved = this.modules.storage.get('assessment_progress');
        if (hasSaved) {
            const resume = await this.modules.ui.confirm('Resume your previous assessment?');
            if (resume) {
                this.modules.assessment.loadState();
                // Resume from saved state
            }
        }
    }
    
    playHoverSound() {
        // Optional: Add sound effects
    }
}

// Add required animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes letterEntrance {
        from {
            opacity: 0;
            transform: translateY(-50px) rotateZ(-10deg);
        }
        to {
            opacity: 1;
            transform: translateY(0) rotateZ(0);
        }
    }
    
    @keyframes letterExplode {
        0% { transform: scale(1) rotateZ(0); }
        50% { transform: scale(1.5) rotateZ(180deg); }
        100% { transform: scale(1) rotateZ(360deg); }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes particleBurst {
        to {
            transform: translate(
                calc(var(--random-x, 1) * 100px - 50px),
                calc(var(--random-y, 1) * 100px - 50px)
            );
            opacity: 0;
        }
    }
    
    @keyframes fadeOutScale {
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(1.1);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes selectPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes buttonReady {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes numberFlip {
        0% { transform: rotateX(0); }
        50% { transform: rotateX(90deg); }
        100% { transform: rotateX(0); }
    }
    
    @keyframes questionEntrance {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes questionExitLeft {
        to {
            opacity: 0;
            transform: translateX(-50px);
        }
    }
    
    @keyframes questionExitRight {
        to {
            opacity: 0;
            transform: translateX(50px);
        }
    }
    
    @keyframes selectionPulse {
        0%, 100% { 
            box-shadow: 0 0 0 0 rgba(139, 108, 193, 0.7);
        }
        50% { 
            box-shadow: 0 0 0 10px rgba(139, 108, 193, 0);
        }
    }
    
    @keyframes progressPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
    
    @keyframes flagPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes numberChange {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes resultsReveal {
        from {
            opacity: 0;
            transform: scale(0.9) rotateX(10deg);
        }
        to {
            opacity: 1;
            transform: scale(1) rotateX(0);
        }
    }
    
    .letter-particle {
        --random-x: ${Math.random()};
        --random-y: ${Math.random()};
    }
`;
document.head.appendChild(style);

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.patriciaEnhancedApp = new PatriciaEnhancedApp();
    });
} else {
    window.patriciaEnhancedApp = new PatriciaEnhancedApp();
}

export default PatriciaEnhancedApp;