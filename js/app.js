/**
 * P.A.T.R.I.C.I.A Main Application
 * Modern ES6+ implementation without jQuery
 */

import { AssessmentEngine } from './modules/AssessmentEngine.js';
import { ErrorHandler } from './modules/ErrorHandler.js';
import { ParticleSystem } from './modules/ParticleSystem.js';
import { UIManager } from './modules/UIManager.js';
import { StorageManager } from './modules/StorageManager.js';
import { AnimationController } from './modules/AnimationController.js';

class PatriciaApp {
    constructor() {
        this.state = {
            isInitialized: false,
            currentMode: null,
            currentScreen: 'welcome',
            assessmentStarted: false
        };
        
        this.modules = {};
        this.init();
    }
    
    async init() {
        try {
            // Show loading state
            this.showLoading();
            
            // Initialize error handler first
            this.modules.errorHandler = new ErrorHandler({
                logToConsole: true,
                showUserNotifications: true
            });
            
            // Initialize UI manager
            this.modules.ui = new UIManager();
            
            // Initialize storage manager
            this.modules.storage = new StorageManager();
            
            // Initialize assessment engine
            this.modules.assessment = new AssessmentEngine({
                autoSave: true,
                validateResponses: true
            });
            
            // Initialize particle system with performance optimizations
            this.modules.particles = new ParticleSystem({
                maxParticles: this.getOptimalParticleCount(),
                enabled: this.shouldEnableParticles()
            });
            
            // Initialize animation controller
            this.modules.animations = new AnimationController();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Check for saved progress
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
    
    setupEventListeners() {
        // Mode selection
        document.querySelectorAll('.mode-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMode(e.target.dataset.mode));
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
        
        // Results actions
        const downloadBtn = document.getElementById('download-results');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadResults());
        }
        
        const shareBtn = document.getElementById('share-results');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareResults());
        }
        
        const retakeBtn = document.getElementById('retake-assessment');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => this.retakeAssessment());
        }
        
        // Error retry
        const retryBtn = document.getElementById('retry-button');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.init());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.state.assessmentStarted) {
                this.modules.assessment.saveState();
            }
        });
        
        // Before unload warning
        window.addEventListener('beforeunload', (e) => {
            if (this.state.assessmentStarted && !this.modules.assessment.state.status === 'completed') {
                e.preventDefault();
                e.returnValue = 'You have an assessment in progress. Are you sure you want to leave?';
            }
        });
    }
    
    selectMode(mode) {
        this.state.currentMode = mode;
        
        // Update UI to show selected mode
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
        
        // Show estimated time
        const times = {
            core: '15-20 minutes',
            comprehensive: '45-60 minutes',
            specialized: '30-40 minutes'
        };
        
        this.modules.ui.showNotification(`Selected: ${mode} assessment (${times[mode]})`, 'info');
    }
    
    async startAssessment() {
        if (!this.state.currentMode) {
            this.modules.ui.showNotification('Please select an assessment mode', 'warning');
            return;
        }
        
        try {
            // Start the assessment
            this.modules.assessment.startAssessment(this.state.currentMode, 'validated');
            this.state.assessmentStarted = true;
            
            // Transition to question screen
            this.transitionToScreen('question');
            
            // Load first question
            this.displayCurrentQuestion();
            
            // Start progress tracking
            this.startProgressTracking();
            
        } catch (error) {
            console.error('Failed to start assessment:', error);
            this.modules.ui.showNotification('Failed to start assessment. Please try again.', 'error');
        }
    }
    
    displayCurrentQuestion() {
        const question = this.modules.assessment.getCurrentQuestion();
        if (!question) return;
        
        // Update question header
        document.getElementById('question-num').textContent = 
            this.modules.assessment.state.currentQuestionIndex + 1;
        document.getElementById('question-category').textContent = question.category;
        
        // Render question content
        const contentEl = document.getElementById('question-content');
        contentEl.innerHTML = this.renderQuestion(question);
        
        // Setup question interactions
        this.setupQuestionInteractions(question);
        
        // Update progress
        this.updateProgress();
        
        // Animate question entrance
        this.modules.animations.animateQuestionEntrance();
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
            case 'ranking':
                html += this.renderRankingOptions(question.options);
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
    
    renderRankingOptions(options) {
        let html = '<div class="ranking-options" id="ranking-container">';
        options.forEach((option, index) => {
            html += `
                <div class="ranking-option" draggable="true" data-value="${option.value || index}">
                    <span class="rank-number">${index + 1}</span>
                    <span class="rank-label">${option.label}</span>
                    <span class="drag-handle">☰</span>
                </div>
            `;
        });
        html += '</div>';
        return html;
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
        switch (question.type) {
            case 'visual':
            case 'scenario':
                this.setupClickableOptions();
                break;
            case 'spectrum':
                this.setupSpectrumSlider();
                break;
            case 'ranking':
                this.setupDragAndDrop();
                break;
            default:
                this.setupClickableOptions();
        }
    }
    
    setupClickableOptions() {
        const options = document.querySelectorAll('.visual-option, .scenario-option, .option-button');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                // Remove previous selection
                options.forEach(opt => opt.classList.remove('selected'));
                // Add selection to clicked option
                e.currentTarget.classList.add('selected');
                // Store response
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
    
    setupDragAndDrop() {
        const container = document.getElementById('ranking-container');
        if (!container) return;
        
        let draggedElement = null;
        
        container.querySelectorAll('.ranking-option').forEach(option => {
            option.addEventListener('dragstart', (e) => {
                draggedElement = e.target;
                e.target.classList.add('dragging');
            });
            
            option.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
            
            option.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientY);
                if (afterElement == null) {
                    container.appendChild(draggedElement);
                } else {
                    container.insertBefore(draggedElement, afterElement);
                }
            });
        });
        
        const getDragAfterElement = (container, y) => {
            const draggableElements = [...container.querySelectorAll('.ranking-option:not(.dragging)')];
            
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        };
        
        // Store ranking when changed
        container.addEventListener('drop', () => {
            const ranking = [...container.querySelectorAll('.ranking-option')]
                .map(opt => opt.dataset.value);
            this.storeResponse(ranking);
        });
    }
    
    storeResponse(value) {
        this.modules.assessment.saveResponse({ value });
        
        // Enable next button
        const nextBtn = document.getElementById('next-button');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
    
    navigateQuestion(direction) {
        let moved = false;
        
        if (direction === 'next') {
            moved = this.modules.assessment.nextQuestion();
            
            if (!moved) {
                // Last question reached
                this.completeAssessment();
                return;
            }
        } else {
            moved = this.modules.assessment.previousQuestion();
        }
        
        if (moved) {
            this.displayCurrentQuestion();
        }
    }
    
    async completeAssessment() {
        try {
            this.showLoading('Calculating your results...');
            
            const results = await this.modules.assessment.completeAssessment();
            
            this.hideLoading();
            this.transitionToScreen('results');
            this.displayResults(results);
            
            // Trigger celebration animation
            this.modules.animations.celebrateCompletion();
            
        } catch (error) {
            console.error('Failed to complete assessment:', error);
            this.showError('Failed to calculate results. Please try again.');
        }
    }
    
    displayResults(results) {
        const contentEl = document.getElementById('results-content');
        if (!contentEl) return;
        
        // This would be expanded with full results rendering
        contentEl.innerHTML = `
            <div class="results-summary">
                <h3>Your Personality Profile</h3>
                <div class="traits-grid">
                    ${this.renderTraitResults(results)}
                </div>
            </div>
        `;
    }
    
    renderTraitResults(results) {
        // Placeholder - would render actual results
        return '<p>Results calculation in progress...</p>';
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
        const progress = this.modules.assessment.getProgress();
        
        document.getElementById('current-question').textContent = progress.currentQuestion;
        document.getElementById('total-questions').textContent = progress.totalQuestions;
        document.getElementById('answered-questions').textContent = progress.answeredQuestions;
        document.getElementById('progress-percent').textContent = `${progress.percentComplete}%`;
        document.getElementById('progress-fill').style.width = `${progress.percentComplete}%`;
        
        // Update time elapsed
        const minutes = Math.floor(progress.timeElapsed / 60000);
        const seconds = Math.floor((progress.timeElapsed % 60000) / 1000);
        document.getElementById('time-elapsed').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    startProgressTracking() {
        // Update progress every second
        this.progressInterval = setInterval(() => {
            this.updateProgress();
        }, 1000);
    }
    
    async checkSavedProgress() {
        const hasSavedProgress = this.modules.storage.get('assessment_progress');
        
        if (hasSavedProgress) {
            const resume = await this.modules.ui.confirm(
                'You have an assessment in progress. Would you like to resume?'
            );
            
            if (resume) {
                this.modules.assessment.loadState();
                this.state.assessmentStarted = true;
                this.transitionToScreen('question');
                this.displayCurrentQuestion();
                this.startProgressTracking();
            } else {
                this.modules.storage.remove('assessment_progress');
            }
        }
    }
    
    downloadResults() {
        // Implementation for downloading results as PDF/JSON
        this.modules.ui.showNotification('Preparing download...', 'info');
    }
    
    shareResults() {
        // Implementation for sharing results
        this.modules.ui.showNotification('Share feature coming soon', 'info');
    }
    
    retakeAssessment() {
        this.modules.assessment.resetAssessment();
        this.state.assessmentStarted = false;
        this.state.currentMode = null;
        this.transitionToScreen('welcome');
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
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
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                // Quick number selection for options
                const options = document.querySelectorAll('.visual-option, .scenario-option');
                const index = parseInt(e.key) - 1;
                if (options[index]) {
                    options[index].click();
                }
                break;
        }
    }
    
    getOptimalParticleCount() {
        // Determine optimal particle count based on device capabilities
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Check for mobile devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) return 30;
        if (pixelRatio > 2) return 50;
        if (width > 1920) return 100;
        if (width > 1280) return 75;
        return 50;
    }
    
    shouldEnableParticles() {
        // Check if particles should be enabled based on performance
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const lowPowerMode = navigator.getBattery && navigator.getBattery().then(battery => battery.charging === false && battery.level < 0.2);
        
        return !prefersReducedMotion && !lowPowerMode;
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