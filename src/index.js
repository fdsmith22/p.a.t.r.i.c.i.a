/**
 * P.A.T.R.I.C.I.A Main Entry Point
 * Webpack entry file for the application
 */

// Import styles
import '../styles/patricia-main.css';
import '../styles/patricia-enhanced.css';

// Import modules - using dynamic imports for better code splitting
class PatriciaApp {
    constructor() {
        this.modules = {};
        this.state = {
            isInitialized: false,
            currentMode: null,
            currentScreen: 'welcome',
            assessmentStarted: false
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Show loading state
            this.showLoading();
            
            // Dynamic imports for code splitting
            const [
                { AssessmentEngine },
                { ErrorHandler },
                { ParticleSystem },
                { UIManager },
                { StorageManager },
                { AnimationController }
            ] = await Promise.all([
                import('../js/modules/AssessmentEngine.js'),
                import('../js/modules/ErrorHandler.js'),
                import('../js/modules/ParticleSystem.js'),
                import('../js/modules/UIManager.js'),
                import('../js/modules/StorageManager.js'),
                import('../js/modules/AnimationController.js')
            ]);
            
            // Initialize modules
            this.modules.errorHandler = new ErrorHandler({
                logToConsole: true,
                showUserNotifications: true
            });
            
            this.modules.ui = new UIManager();
            this.modules.storage = new StorageManager();
            
            this.modules.assessment = new AssessmentEngine({
                autoSave: true,
                validateResponses: true
            });
            
            this.modules.particles = new ParticleSystem({
                maxParticles: this.getOptimalParticleCount(),
                enabled: this.shouldEnableParticles()
            });
            
            this.modules.animations = new AnimationController();
            
            // Setup interactions
            this.setupEventListeners();
            this.animateTitle();
            await this.checkSavedProgress();
            
            // Hide loading state
            this.hideLoading();
            
            this.state.isInitialized = true;
            console.log('P.A.T.R.I.C.I.A initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize the assessment. Please refresh the page.');
        }
    }
    
    animateTitle() {
        const letters = document.querySelectorAll('.title-letter');
        letters.forEach((letter, index) => {
            setTimeout(() => {
                letter.style.animation = 'letterFloat 3s ease-in-out infinite';
                letter.style.animationDelay = `${index * 0.1}s`;
            }, index * 50);
        });
        
        // Animate acronym breakdown
        setTimeout(() => {
            const acronymWords = document.querySelectorAll('.acronym-word');
            acronymWords.forEach((word, index) => {
                setTimeout(() => {
                    word.style.opacity = '1';
                    word.style.transform = 'translateY(0)';
                }, 1000 + (index * 100));
            });
        }, 500);
    }
    
    setupEventListeners() {
        // Mode selection
        document.querySelectorAll('.mode-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectMode(e.currentTarget.dataset.mode);
            });
        });
        
        // Start assessment
        const startBtn = document.getElementById('start-assessment');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startAssessment());
        }
        
        // Navigation
        const prevBtn = document.getElementById('prev-button');
        const nextBtn = document.getElementById('next-button');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateQuestion('prev'));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateQuestion('next'));
        }
        
        // Progress toggle
        const progressToggle = document.querySelector('.progress-toggle');
        if (progressToggle) {
            progressToggle.addEventListener('click', () => this.toggleProgress());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    selectMode(mode) {
        this.state.currentMode = mode;
        
        // Update UI
        document.querySelectorAll('.mode-option').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.mode === mode) {
                btn.classList.add('selected');
            }
        });
        
        // Enable start button
        const startBtn = document.getElementById('start-assessment');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.textContent = `Start ${mode.charAt(0).toUpperCase() + mode.slice(1)} Assessment`;
        }
        
        this.modules.ui?.showNotification(`Selected: ${mode} assessment`, 'info');
    }
    
    async startAssessment() {
        if (!this.state.currentMode) {
            this.modules.ui?.showNotification('Please select an assessment mode', 'warning');
            return;
        }
        
        try {
            this.modules.assessment.startAssessment(this.state.currentMode, 'validated');
            this.state.assessmentStarted = true;
            
            this.transitionToScreen('question');
            this.displayCurrentQuestion();
            this.startProgressTracking();
            
        } catch (error) {
            console.error('Failed to start assessment:', error);
            this.modules.ui?.showNotification('Failed to start assessment. Please try again.', 'error');
        }
    }
    
    displayCurrentQuestion() {
        const question = this.modules.assessment?.getCurrentQuestion();
        if (!question) return;
        
        // Update question header
        document.getElementById('question-num').textContent = 
            this.modules.assessment.state.currentQuestionIndex + 1;
        document.getElementById('question-category').textContent = question.category;
        
        // Render question content
        const contentEl = document.getElementById('question-content');
        contentEl.innerHTML = this.renderQuestion(question);
        
        this.setupQuestionInteractions(question);
        this.updateProgress();
        
        // Animate entrance
        this.modules.animations?.animateQuestionEntrance();
    }
    
    renderQuestion(question) {
        let html = `<h2 class="question-text">${question.text}</h2>`;
        
        switch (question.type) {
            case 'visual':
                html += this.renderVisualOptions(question.options);
                break;
            case 'scenario':
                html += this.renderScenarioOptions(question.options);
                break;
            case 'spectrum':
                html += this.renderSpectrumSlider(question);
                break;
            default:
                html += this.renderStandardOptions(question.options);
        }
        
        return html;
    }
    
    renderVisualOptions(options) {
        let html = '<div class="visual-grid">';
        options.forEach((option, index) => {
            html += `
                <div class="visual-option" data-value="${option.value || index}">
                    <span class="emoji">${option.emoji || '🔵'}</span>
                    <span class="label">${option.label}</span>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }
    
    renderScenarioOptions(options) {
        let html = '<div class="scenario-options">';
        options.forEach((option, index) => {
            html += `
                <div class="scenario-option" data-value="${option.value || index}">
                    <h4>${option.title}</h4>
                    <p>${option.description}</p>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }
    
    renderSpectrumSlider(question) {
        return `
            <div class="spectrum-container">
                <div class="spectrum-slider" id="spectrum-slider">
                    <div class="spectrum-handle" id="spectrum-handle" style="left: 50%"></div>
                </div>
                <div class="spectrum-labels">
                    <span>${question.leftLabel || 'Strongly Disagree'}</span>
                    <span>${question.rightLabel || 'Strongly Agree'}</span>
                </div>
                <input type="hidden" id="spectrum-value" value="50">
            </div>
        `;
    }
    
    renderStandardOptions(options) {
        let html = '<div class="standard-options">';
        options.forEach((option, index) => {
            html += `
                <button class="option-button" data-value="${option.value || index}">
                    ${option.label}
                </button>
            `;
        });
        html += '</div>';
        return html;
    }
    
    setupQuestionInteractions(question) {
        if (question.type === 'spectrum') {
            this.setupSpectrumSlider();
        } else {
            this.setupClickableOptions();
        }
    }
    
    setupClickableOptions() {
        const options = document.querySelectorAll('.visual-option, .scenario-option, .option-button');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                options.forEach(opt => opt.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.storeResponse(e.currentTarget.dataset.value);
            });
        });
    }
    
    setupSpectrumSlider() {
        const slider = document.getElementById('spectrum-slider');
        const handle = document.getElementById('spectrum-handle');
        const valueInput = document.getElementById('spectrum-value');
        
        if (!slider || !handle) return;
        
        let isDragging = false;
        
        const updatePosition = (e) => {
            const rect = slider.getBoundingClientRect();
            const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const relativeX = x - rect.left;
            const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
            
            handle.style.left = `${percentage}%`;
            valueInput.value = Math.round(percentage);
            this.storeResponse(Math.round(percentage));
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
    }
    
    storeResponse(value) {
        this.modules.assessment?.saveResponse({ value });
        
        const nextBtn = document.getElementById('next-button');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
    
    navigateQuestion(direction) {
        let moved = false;
        
        if (direction === 'next') {
            moved = this.modules.assessment?.nextQuestion();
            
            if (!moved) {
                this.completeAssessment();
                return;
            }
        } else {
            moved = this.modules.assessment?.previousQuestion();
        }
        
        if (moved) {
            this.displayCurrentQuestion();
        }
    }
    
    async completeAssessment() {
        try {
            this.showLoading('Calculating your results...');
            
            const results = await this.modules.assessment?.completeAssessment();
            
            this.hideLoading();
            this.transitionToScreen('results');
            this.displayResults(results);
            
            // Trigger celebration
            this.modules.animations?.celebrateCompletion();
            
        } catch (error) {
            console.error('Failed to complete assessment:', error);
            this.showError('Failed to calculate results. Please try again.');
        }
    }
    
    displayResults(results) {
        const contentEl = document.getElementById('results-content');
        if (!contentEl) return;
        
        contentEl.innerHTML = `
            <div class="results-summary">
                <h3>Your Personality Profile</h3>
                <div class="traits-grid">
                    <p>Results calculation in progress...</p>
                </div>
            </div>
        `;
    }
    
    transitionToScreen(screen) {
        // Hide all screens
        document.getElementById('welcome-screen')?.classList.add('hidden');
        document.getElementById('question-screen')?.classList.add('hidden');
        document.getElementById('results-screen')?.classList.add('hidden');
        document.getElementById('loading-screen')?.classList.add('hidden');
        document.getElementById('error-screen')?.classList.add('hidden');
        
        // Show target screen
        const targetScreen = document.getElementById(`${screen}-screen`);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            this.state.currentScreen = screen;
        }
    }
    
    toggleProgress() {
        const container = document.querySelector('.progress-container');
        if (container) {
            container.classList.toggle('minimized');
        }
    }
    
    updateProgress() {
        const progress = this.modules.assessment?.getProgress();
        if (!progress) return;
        
        document.getElementById('current-question').textContent = progress.currentQuestion;
        document.getElementById('total-questions').textContent = progress.totalQuestions;
        document.getElementById('answered-questions').textContent = progress.answeredQuestions;
        document.getElementById('progress-percent').textContent = `${progress.percentComplete}%`;
        document.getElementById('progress-fill').style.width = `${progress.percentComplete}%`;
        
        const minutes = Math.floor(progress.timeElapsed / 60000);
        const seconds = Math.floor((progress.timeElapsed % 60000) / 1000);
        document.getElementById('time-elapsed').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    startProgressTracking() {
        this.progressInterval = setInterval(() => {
            this.updateProgress();
        }, 1000);
    }
    
    async checkSavedProgress() {
        const hasSavedProgress = this.modules.storage?.get('assessment_progress');
        
        if (hasSavedProgress) {
            const resume = await this.modules.ui?.confirm(
                'You have an assessment in progress. Would you like to resume?'
            );
            
            if (resume) {
                this.modules.assessment?.loadState();
                this.state.assessmentStarted = true;
                this.transitionToScreen('question');
                this.displayCurrentQuestion();
                this.startProgressTracking();
            }
        }
    }
    
    handleKeyboard(e) {
        if (this.state.currentScreen !== 'question') return;
        
        switch (e.key) {
            case 'ArrowLeft':
                this.navigateQuestion('prev');
                break;
            case 'ArrowRight':
                this.navigateQuestion('next');
                break;
        }
    }
    
    getOptimalParticleCount() {
        const width = window.innerWidth;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) return 30;
        if (width > 1920) return 100;
        if (width > 1280) return 75;
        return 50;
    }
    
    shouldEnableParticles() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return !prefersReducedMotion;
    }
    
    showLoading(message = 'Loading...') {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.querySelector('p').textContent = message;
            loadingScreen.classList.remove('hidden');
        }
    }
    
    hideLoading() {
        document.getElementById('loading-screen')?.classList.add('hidden');
    }
    
    showError(message) {
        const errorScreen = document.getElementById('error-screen');
        if (errorScreen) {
            document.getElementById('error-message').textContent = message;
            this.transitionToScreen('error');
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.patriciaApp = new PatriciaApp();
    });
} else {
    window.patriciaApp = new PatriciaApp();
}

export default PatriciaApp;