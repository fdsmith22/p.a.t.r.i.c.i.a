/**
 * Neurlyn Integrated - Enhanced app with gamified tasks and behavioral tracking
 * Integrates research-based assessment methods with existing framework
 */

import { ReportGenerator } from './report-generator.js';
import { taskController } from './modules/task-controller.js';
import { behavioralTracker } from './modules/behavioral-tracker.js';

class NeurlynIntegratedApp {
    constructor() {
        this.state = {
            currentMode: null,
            currentScreen: 'welcome',
            currentQuestionIndex: 0,
            responses: [],
            startTime: null,
            sessionId: this.generateSessionId(),
            isPaused: false,
            theme: 'system',
            taskMode: 'hybrid' // 'traditional', 'gamified', 'hybrid'
        };
        
        this.questions = [];
        this.currentTask = null;
        this.autoSaveInterval = null;
        this.reportGenerator = new ReportGenerator();
        this.taskController = taskController;
        this.behavioralTracker = behavioralTracker;
        
        this.init();
    }
    
    init() {
        this.initTheme();
        this.loadSavedState();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.loadQuestions();
        this.checkForSavedProgress();
        this.initServiceWorker();
    }
    
    // Theme Management (unchanged)
    initTheme() {
        const savedTheme = localStorage.getItem('neurlyn-theme') || 'system';
        this.state.theme = savedTheme;
        
        if (savedTheme === 'system') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('neurlyn-theme', newTheme);
        this.state.theme = newTheme;
        
        document.body.style.transition = 'background-color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    // Enhanced Event Listeners
    setupEventListeners() {
        // Mode selection with new options
        document.querySelectorAll('.mode-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectMode(btn.dataset.mode);
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
        const skipBtn = document.getElementById('skip-button');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateQuestion(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateQuestion(1));
        if (skipBtn) skipBtn.addEventListener('click', () => this.skipQuestion());
        
        // Results actions
        const downloadBtn = document.getElementById('download-results');
        const shareBtn = document.getElementById('share-results');
        const retakeBtn = document.getElementById('retake-assessment');
        
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadResults());
        if (shareBtn) shareBtn.addEventListener('click', () => this.shareResults());
        if (retakeBtn) retakeBtn.addEventListener('click', () => this.retakeAssessment());
    }
    
    // Enhanced Mode Selection with Task Types
    selectMode(mode) {
        this.state.currentMode = mode;
        
        // Update UI
        document.querySelectorAll('.mode-option').forEach(btn => {
            btn.classList.remove('selected', 'selecting');
            if (btn.dataset.mode === mode) {
                btn.classList.add('selecting');
                setTimeout(() => {
                    btn.classList.remove('selecting');
                    btn.classList.add('selected');
                }, 150);
            }
        });
        
        // Show task type selector for enhanced modes
        if (mode !== 'quick') {
            this.showTaskTypeSelector();
        }
        
        const startBtn = document.getElementById('start-assessment');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.classList.add('pulse');
            const modeText = mode.charAt(0).toUpperCase() + mode.slice(1);
            startBtn.textContent = `Begin ${modeText} Assessment`;
            setTimeout(() => startBtn.classList.remove('pulse'), 600);
        }
        
        this.updateExpectedDuration(mode);
    }
    
    // New: Task Type Selector
    showTaskTypeSelector() {
        const existing = document.getElementById('task-type-selector');
        if (existing) existing.remove();
        
        const selector = document.createElement('div');
        selector.id = 'task-type-selector';
        selector.className = 'task-type-selector';
        selector.innerHTML = `
            <h4>Assessment Style</h4>
            <div class="task-type-options">
                <label class="task-type-option">
                    <input type="radio" name="taskMode" value="traditional" ${this.state.taskMode === 'traditional' ? 'checked' : ''}>
                    <span class="option-label">
                        <strong>Traditional</strong>
                        <small>Classic questionnaire format</small>
                    </span>
                </label>
                <label class="task-type-option">
                    <input type="radio" name="taskMode" value="gamified" ${this.state.taskMode === 'gamified' ? 'checked' : ''}>
                    <span class="option-label">
                        <strong>Gamified</strong>
                        <small>Interactive games & tasks</small>
                    </span>
                </label>
                <label class="task-type-option">
                    <input type="radio" name="taskMode" value="hybrid" ${this.state.taskMode === 'hybrid' ? 'checked' : ''}>
                    <span class="option-label">
                        <strong>Hybrid</strong>
                        <small>Mix of questions & games</small>
                    </span>
                </label>
            </div>
        `;
        
        const modeSelection = document.querySelector('.mode-selection');
        if (modeSelection) {
            modeSelection.appendChild(selector);
        }
        
        // Handle task mode selection
        selector.querySelectorAll('input[name="taskMode"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.state.taskMode = e.target.value;
                this.showToast(`Assessment style: ${e.target.value}`, 'info');
            });
        });
    }
    
    // Enhanced Question Generation with Task Types
    generateEnhancedQuestions() {
        const modeConfigs = {
            quick: {
                questionCount: 5,
                gamifiedTasks: ['risk-balloon'],
                traditionalCount: 5
            },
            standard: {
                questionCount: 15,
                gamifiedTasks: ['risk-balloon', 'word-association', 'visual-attention'],
                traditionalCount: 10
            },
            deep: {
                questionCount: 30,
                gamifiedTasks: [
                    'risk-balloon', 
                    'word-association', 
                    'visual-attention',
                    'microexpression',
                    'iowa-gambling',
                    'card-sorting'
                ],
                traditionalCount: 20
            }
        };
        
        const config = modeConfigs[this.state.currentMode] || modeConfigs.standard;
        const questions = [];
        
        if (this.state.taskMode === 'traditional') {
            // All traditional Likert questions
            questions.push(...this.generateLikertQuestions(config.questionCount));
        } else if (this.state.taskMode === 'gamified') {
            // All gamified tasks
            questions.push(...this.generateGamifiedTasks(config.gamifiedTasks));
            // Add some Likert for completion
            if (questions.length < config.questionCount) {
                questions.push(...this.generateLikertQuestions(config.questionCount - questions.length));
            }
        } else {
            // Hybrid - mix both types
            const gamifiedInterval = 3; // Every 3rd question is gamified
            let gamifiedIndex = 0;
            
            for (let i = 0; i < config.questionCount; i++) {
                if (i % gamifiedInterval === 2 && gamifiedIndex < config.gamifiedTasks.length) {
                    questions.push(this.createGamifiedTask(config.gamifiedTasks[gamifiedIndex]));
                    gamifiedIndex++;
                } else {
                    questions.push(this.createLikertQuestion(i));
                }
            }
        }
        
        return questions;
    }
    
    // Generate Gamified Tasks
    generateGamifiedTasks(taskTypes) {
        return taskTypes.map(type => this.createGamifiedTask(type));
    }
    
    // Create Gamified Task Configuration
    createGamifiedTask(taskType) {
        const taskConfigs = {
            'risk-balloon': {
                type: 'risk-balloon',
                question: 'Balloon Risk Game',
                instructions: 'Pump the balloon to earn money, but be careful - it might pop! Press SPACE to pump, ENTER to collect.',
                category: 'Risk Taking',
                timeLimit: 120000, // 2 minutes
                balloons: 15
            },
            'word-association': {
                type: 'word-association',
                question: 'Word Association',
                instructions: 'Type the first word that comes to mind for each prompt. Be spontaneous!',
                category: 'Cognitive Processing',
                timeLimit: 90000,
                words: ['home', 'mother', 'success', 'fear', 'love', 'work', 'future', 'past']
            },
            'visual-attention': {
                type: 'visual-attention',
                question: 'Visual Attention Task',
                instructions: 'Track the moving dots and click on them as they appear.',
                category: 'Attention',
                timeLimit: 120000
            },
            'microexpression': {
                type: 'microexpression',
                question: 'Emotion Recognition',
                instructions: 'Identify the emotion shown in each brief facial expression.',
                category: 'Emotional Intelligence',
                timeLimit: 90000
            },
            'iowa-gambling': {
                type: 'iowa-gambling',
                question: 'Card Selection Game',
                instructions: 'Select cards from different decks to maximize your winnings.',
                category: 'Decision Making',
                timeLimit: 240000
            },
            'card-sorting': {
                type: 'card-sorting',
                question: 'Pattern Matching',
                instructions: 'Sort cards according to changing rules. Figure out the pattern!',
                category: 'Cognitive Flexibility',
                timeLimit: 180000
            }
        };
        
        return taskConfigs[taskType] || this.createLikertQuestion(0);
    }
    
    // Generate Traditional Likert Questions
    generateLikertQuestions(count) {
        const questions = [];
        for (let i = 0; i < count; i++) {
            questions.push(this.createLikertQuestion(i));
        }
        return questions;
    }
    
    // Create Likert Question
    createLikertQuestion(index) {
        const categories = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'];
        const sampleQuestions = [
            'I enjoy exploring new ideas and concepts',
            'I prefer to have a detailed plan before starting tasks',
            'I feel energized when spending time with others',
            'I often put others\' needs before my own',
            'I tend to worry about future events',
            'I appreciate art and beauty in everyday life',
            'I keep my workspace organized and tidy',
            'I enjoy being the center of attention',
            'I trust others easily',
            'Small problems can upset me for a long time'
        ];
        
        return {
            type: 'likert',
            question: sampleQuestions[index % sampleQuestions.length],
            category: categories[index % categories.length],
            scale: 5
        };
    }
    
    // Start Assessment with Behavioral Tracking
    async startAssessment() {
        if (!this.state.currentMode) {
            this.showToast('Please select an assessment mode', 'error');
            return;
        }
        
        this.state.startTime = Date.now();
        this.state.currentQuestionIndex = 0;
        this.state.responses = [];
        
        // Generate questions based on mode and task type
        this.questions = this.generateEnhancedQuestions();
        
        // Start behavioral tracking
        this.behavioralTracker.start();
        
        this.transitionToScreen('question');
        await this.displayQuestion();
        this.startAutoSave();
        
        this.showToast('Assessment started', 'success');
    }
    
    // Display Question with Task Support
    async displayQuestion() {
        const question = this.questions[this.state.currentQuestionIndex];
        const container = document.getElementById('question-content');
        
        if (!container) return;
        
        // Clean up previous task
        if (this.currentTask) {
            this.taskController.destroy();
            this.currentTask = null;
        }
        
        // Update progress
        this.updateProgress();
        
        // Update category badge
        const categoryBadge = document.getElementById('question-category');
        if (categoryBadge) {
            categoryBadge.textContent = question.category;
        }
        
        // Load and render appropriate task
        try {
            this.currentTask = await this.taskController.loadTask(question.type, question);
            await this.taskController.renderTask(container);
            
            // For gamified tasks, handle completion differently
            if (question.type !== 'likert') {
                this.setupGamifiedTaskCompletion();
            }
        } catch (error) {
            console.error('Failed to load task:', error);
            // Fallback to Likert
            this.currentTask = await this.taskController.loadTask('likert', question);
            await this.taskController.renderTask(container);
        }
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    // Setup Gamified Task Completion
    setupGamifiedTaskCompletion() {
        // Gamified tasks handle their own completion
        const checkCompletion = setInterval(async () => {
            if (this.currentTask && this.currentTask.response !== null) {
                clearInterval(checkCompletion);
                
                // Get task results including behavioral data
                const results = await this.taskController.getTaskResults();
                
                // Store response
                this.state.responses.push({
                    questionIndex: this.state.currentQuestionIndex,
                    question: this.questions[this.state.currentQuestionIndex].question,
                    category: this.questions[this.state.currentQuestionIndex].category,
                    response: results,
                    timestamp: Date.now(),
                    taskType: this.questions[this.state.currentQuestionIndex].type
                });
                
                // Auto-advance after gamified task
                setTimeout(() => {
                    if (this.state.currentQuestionIndex < this.questions.length - 1) {
                        this.navigateQuestion(1);
                    } else {
                        this.completeAssessment();
                    }
                }, 1500);
            }
        }, 100);
    }
    
    // Navigate Questions
    async navigateQuestion(direction) {
        // Save current response if moving forward
        if (direction > 0 && this.currentTask) {
            if (this.currentTask.type === 'likert' && !this.currentTask.response) {
                this.showToast('Please select an answer', 'error');
                return;
            }
            
            // Get task results including behavioral data
            const results = await this.taskController.getTaskResults();
            
            // Store response
            this.state.responses.push({
                questionIndex: this.state.currentQuestionIndex,
                question: this.questions[this.state.currentQuestionIndex].question,
                category: this.questions[this.state.currentQuestionIndex].category,
                response: results,
                timestamp: Date.now(),
                taskType: this.questions[this.state.currentQuestionIndex].type
            });
        }
        
        // Update index
        this.state.currentQuestionIndex += direction;
        
        // Check bounds
        if (this.state.currentQuestionIndex < 0) {
            this.state.currentQuestionIndex = 0;
        } else if (this.state.currentQuestionIndex >= this.questions.length) {
            this.completeAssessment();
            return;
        }
        
        // Display new question
        await this.displayQuestion();
        
        // Save progress
        this.saveState();
    }
    
    // Complete Assessment with Enhanced Analysis
    async completeAssessment() {
        // Stop behavioral tracking
        this.behavioralTracker.stop();
        const behavioralData = this.behavioralTracker.getData();
        
        // Clean up current task
        if (this.currentTask) {
            this.taskController.destroy();
        }
        
        this.stopAutoSave();
        this.state.currentScreen = 'results';
        
        // Calculate enhanced results
        const results = await this.calculateEnhancedResults(behavioralData);
        
        this.transitionToScreen('results');
        this.displayResults(results);
        
        // Clear saved state
        this.clearSavedState();
        
        // Save results to history
        this.saveResultsToHistory(results);
    }
    
    // Calculate Enhanced Results with Behavioral Data
    async calculateEnhancedResults(behavioralData) {
        // Separate responses by type
        const likertResponses = this.state.responses.filter(r => r.taskType === 'likert');
        const gamifiedResponses = this.state.responses.filter(r => r.taskType !== 'likert');
        
        // Traditional Big Five calculation
        const traits = this.calculateTraits(likertResponses);
        
        // Gamified task analysis
        const gamifiedMetrics = this.analyzeGamifiedTasks(gamifiedResponses);
        
        // Behavioral pattern analysis
        const behavioralPatterns = behavioralData.patterns;
        
        // Combine all data sources
        const integratedProfile = this.integrateAssessmentData(traits, gamifiedMetrics, behavioralPatterns);
        
        // Generate comprehensive report
        const report = await this.reportGenerator.generateReport({
            mode: this.state.currentMode,
            traits: integratedProfile.traits,
            responses: this.state.responses,
            gamifiedMetrics: gamifiedMetrics,
            behavioralMetrics: behavioralData.metrics,
            behavioralPatterns: behavioralPatterns,
            duration: Date.now() - this.state.startTime
        });
        
        return {
            ...report,
            behavioralInsights: this.generateBehavioralInsights(behavioralData),
            gamifiedInsights: this.generateGamifiedInsights(gamifiedResponses)
        };
    }
    
    // Analyze Gamified Tasks
    analyzeGamifiedTasks(responses) {
        const metrics = {};
        
        responses.forEach(response => {
            if (response.response.taskType === 'risk-balloon') {
                metrics.riskTolerance = response.response.riskMetrics?.riskTolerance || 0;
                metrics.learningAbility = response.response.riskMetrics?.learningCurve || 0;
                metrics.consistency = response.response.riskMetrics?.consistency || 0;
            }
            // Add other task type analyses here
        });
        
        return metrics;
    }
    
    // Integrate Assessment Data from Multiple Sources
    integrateAssessmentData(traits, gamifiedMetrics, behavioralPatterns) {
        // Weight different data sources
        const weights = {
            traditional: 0.4,
            gamified: 0.35,
            behavioral: 0.25
        };
        
        // Adjust trait scores based on behavioral and gamified data
        const adjustedTraits = { ...traits };
        
        // Openness adjustment based on behavioral exploration
        if (behavioralPatterns.engagement) {
            adjustedTraits.openness = (
                traits.openness * weights.traditional +
                behavioralPatterns.engagement.score * 100 * weights.behavioral +
                (gamifiedMetrics.learningAbility || 0) * 100 * weights.gamified
            );
        }
        
        // Conscientiousness adjustment based on precision
        if (behavioralPatterns.precision) {
            adjustedTraits.conscientiousness = (
                traits.conscientiousness * weights.traditional +
                behavioralPatterns.precision.score * 100 * weights.behavioral +
                (gamifiedMetrics.consistency || 0) * 100 * weights.gamified
            );
        }
        
        // Neuroticism adjustment based on anxiety indicators
        if (behavioralPatterns.anxiety) {
            adjustedTraits.neuroticism = (
                traits.neuroticism * weights.traditional +
                behavioralPatterns.anxiety.score * 100 * weights.behavioral
            );
        }
        
        return {
            traits: adjustedTraits,
            confidence: this.calculateConfidence(weights)
        };
    }
    
    // Generate Behavioral Insights
    generateBehavioralInsights(behavioralData) {
        const insights = [];
        const patterns = behavioralData.patterns;
        
        if (patterns.impulsivity?.score > 0.6) {
            insights.push({
                type: 'impulsivity',
                title: 'Quick Decision Maker',
                description: 'Your interaction patterns suggest you make decisions quickly and spontaneously.',
                score: patterns.impulsivity.score
            });
        }
        
        if (patterns.precision?.score > 0.7) {
            insights.push({
                type: 'precision',
                title: 'Detail Oriented',
                description: 'Your careful movements and low error rate indicate strong attention to detail.',
                score: patterns.precision.score
            });
        }
        
        if (patterns.anxiety?.score > 0.5) {
            insights.push({
                type: 'anxiety',
                title: 'Thoughtful Consideration',
                description: 'You take time to consider your responses carefully before committing.',
                score: patterns.anxiety.score
            });
        }
        
        return insights;
    }
    
    // Generate Gamified Insights
    generateGamifiedInsights(responses) {
        const insights = [];
        
        responses.forEach(response => {
            if (response.response.taskType === 'risk-balloon' && response.response.riskMetrics) {
                const metrics = response.response.riskMetrics;
                
                if (metrics.riskTolerance > 0.6) {
                    insights.push({
                        type: 'risk-taking',
                        title: 'Calculated Risk Taker',
                        description: `You demonstrated a ${(metrics.riskTolerance * 100).toFixed(0)}% risk tolerance level.`,
                        metrics: metrics
                    });
                }
                
                if (metrics.learningCurve > 0) {
                    insights.push({
                        type: 'adaptive-learning',
                        title: 'Quick Learner',
                        description: 'You showed improvement throughout the task, adapting your strategy.',
                        metrics: metrics
                    });
                }
            }
        });
        
        return insights;
    }
    
    // Calculate Confidence Score
    calculateConfidence(weights) {
        const dataCompleteness = this.state.responses.length / this.questions.length;
        const hasGamified = this.state.responses.some(r => r.taskType !== 'likert');
        const hasBehavioral = this.behavioralTracker.getData().metrics.totalDuration > 0;
        
        let confidence = dataCompleteness * 0.5;
        if (hasGamified) confidence += 0.25;
        if (hasBehavioral) confidence += 0.25;
        
        return Math.min(confidence, 1);
    }
    
    // Display Enhanced Results
    displayResults(results) {
        const container = document.getElementById('results-content');
        if (!container) return;
        
        container.innerHTML = `
            <div class="results-summary">
                <h3>Your Personality Profile</h3>
                <div class="confidence-indicator">
                    <span>Assessment Confidence: ${(results.confidence * 100).toFixed(0)}%</span>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${results.confidence * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="trait-results">
                ${this.renderTraitResults(results.traits)}
            </div>
            
            ${results.behavioralInsights?.length > 0 ? `
                <div class="behavioral-insights">
                    <h4>Behavioral Insights</h4>
                    ${results.behavioralInsights.map(insight => `
                        <div class="insight-card">
                            <h5>${insight.title}</h5>
                            <p>${insight.description}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${results.gamifiedInsights?.length > 0 ? `
                <div class="gamified-insights">
                    <h4>Task Performance Insights</h4>
                    ${results.gamifiedInsights.map(insight => `
                        <div class="insight-card">
                            <h5>${insight.title}</h5>
                            <p>${insight.description}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="archetype-section">
                <h4>Your Personality Archetype</h4>
                <div class="archetype-card">
                    <h5>${results.archetype.name}</h5>
                    <p>${results.archetype.description}</p>
                </div>
            </div>
            
            <div class="recommendations-section">
                <h4>Personalized Recommendations</h4>
                ${results.recommendations.map(rec => `
                    <div class="recommendation-card">
                        <strong>${rec.area}:</strong> ${rec.suggestion}
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add interactive elements
        this.addResultsInteractivity(results);
    }
    
    // Render Trait Results
    renderTraitResults(traits) {
        return Object.entries(traits).map(([trait, score]) => `
            <div class="trait-item">
                <div class="trait-header">
                    <span class="trait-name">${trait.charAt(0).toUpperCase() + trait.slice(1)}</span>
                    <span class="trait-score">${score.toFixed(0)}%</span>
                </div>
                <div class="trait-bar">
                    <div class="trait-fill" style="width: ${score}%; background: ${this.getTraitColor(trait)};"></div>
                </div>
            </div>
        `).join('');
    }
    
    // Get Trait Color
    getTraitColor(trait) {
        const colors = {
            openness: '#4ECDC4',
            conscientiousness: '#96E6B3',
            extraversion: '#F7DC6F',
            agreeableness: '#45B7D1',
            neuroticism: '#FF6B6B'
        };
        return colors[trait] || '#6C9E83';
    }
    
    // Add Results Interactivity
    addResultsInteractivity(results) {
        // Add hover effects for insights
        document.querySelectorAll('.insight-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = 'var(--shadow-lg)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'var(--shadow-md)';
            });
        });
        
        // Add click to expand for recommendations
        document.querySelectorAll('.recommendation-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                card.classList.toggle('expanded');
            });
        });
    }
    
    // Helper Methods
    calculateTraits(responses) {
        const traits = {
            openness: 50,
            conscientiousness: 50,
            extraversion: 50,
            agreeableness: 50,
            neuroticism: 50
        };
        
        if (responses.length === 0) return traits;
        
        responses.forEach(response => {
            const value = response.response?.response?.value || 3;
            const normalizedValue = ((value - 1) / 4) * 100;
            
            const category = response.category.toLowerCase();
            if (traits[category] !== undefined) {
                traits[category] = (traits[category] + normalizedValue) / 2;
            }
        });
        
        return traits;
    }
    
    // Other helper methods...
    updateProgress() {
        const progress = ((this.state.currentQuestionIndex + 1) / this.questions.length) * 100;
        
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = document.getElementById('progress-percent');
        const questionNum = document.getElementById('question-num');
        const totalQuestions = document.getElementById('total-questions');
        const breadcrumbQuestion = document.getElementById('breadcrumb-question');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressPercent) progressPercent.textContent = `${Math.round(progress)}%`;
        if (questionNum) questionNum.textContent = this.state.currentQuestionIndex + 1;
        if (totalQuestions) totalQuestions.textContent = this.questions.length;
        if (breadcrumbQuestion) breadcrumbQuestion.textContent = this.state.currentQuestionIndex + 1;
    }
    
    updateNavigationButtons() {
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');
        
        if (prevButton) {
            prevButton.disabled = this.state.currentQuestionIndex === 0;
        }
        
        if (nextButton) {
            const isLastQuestion = this.state.currentQuestionIndex === this.questions.length - 1;
            nextButton.textContent = isLastQuestion ? 'Complete' : 'Next';
            
            // For gamified tasks, disable next until completed
            if (this.currentTask && this.currentTask.type !== 'likert') {
                nextButton.disabled = true;
            } else {
                nextButton.disabled = false;
            }
        }
    }
    
    // Utility methods
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    transitionToScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
        }
        
        this.state.currentScreen = screenName;
    }
    
    // ... Additional helper methods from original file ...
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.neurlynApp = new NeurlynIntegratedApp();
    });
} else {
    window.neurlynApp = new NeurlynIntegratedApp();
}

export default NeurlynIntegratedApp;