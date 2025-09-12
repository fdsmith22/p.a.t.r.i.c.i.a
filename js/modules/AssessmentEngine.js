/**
 * AssessmentEngine.js
 * Core assessment logic and state management for P.A.T.R.I.C.I.A
 * 
 * This module handles:
 * - Assessment state management
 * - Question flow control
 * - Response collection and validation
 * - Progress tracking
 * - Data persistence
 */

export class AssessmentEngine {
  constructor(config = {}) {
    this.config = {
      autoSave: true,
      autoSaveInterval: 30000, // 30 seconds
      validateResponses: true,
      enableBiometrics: true,
      storageKey: 'patricia_assessment',
      ...config
    };
    
    this.state = {
      sessionId: this.generateSessionId(),
      status: 'not_started', // not_started, in_progress, completed
      currentQuestionIndex: 0,
      responses: [],
      startTime: null,
      endTime: null,
      questionStartTime: null,
      tier: 'core',
      mode: 'validated',
      metadata: {
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
      }
    };
    
    this.questions = [];
    this.listeners = new Map();
    this.autoSaveTimer = null;
    
    this.init();
  }
  
  /**
   * Initialize the assessment engine
   */
  init() {
    this.loadState();
    this.setupAutoSave();
    this.setupEventListeners();
    this.emit('initialized', this.state);
  }
  
  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `patricia_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Load saved state from localStorage
   */
  loadState() {
    try {
      const savedState = localStorage.getItem(this.config.storageKey);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Only load if session is less than 24 hours old
        if (parsed.startTime && Date.now() - new Date(parsed.startTime).getTime() < 86400000) {
          this.state = { ...this.state, ...parsed };
          this.emit('stateLoaded', this.state);
          return true;
        }
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
      this.emit('error', { type: 'loadState', error });
    }
    return false;
  }
  
  /**
   * Save current state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.state));
      this.emit('stateSaved', this.state);
    } catch (error) {
      console.error('Error saving state:', error);
      this.emit('error', { type: 'saveState', error });
    }
  }
  
  /**
   * Setup auto-save functionality
   */
  setupAutoSave() {
    if (this.config.autoSave) {
      this.autoSaveTimer = setInterval(() => {
        if (this.state.status === 'in_progress') {
          this.saveState();
        }
      }, this.config.autoSaveInterval);
    }
  }
  
  /**
   * Setup event listeners for user interactions
   */
  setupEventListeners() {
    // Save state before page unload
    window.addEventListener('beforeunload', (e) => {
      if (this.state.status === 'in_progress') {
        this.saveState();
        e.preventDefault();
        e.returnValue = 'You have an assessment in progress. Are you sure you want to leave?';
      }
    });
    
    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state.status === 'in_progress') {
        this.saveState();
      }
    });
  }
  
  /**
   * Start the assessment
   */
  startAssessment(tier = 'core', mode = 'validated') {
    if (this.state.status === 'in_progress') {
      const resume = confirm('You have an assessment in progress. Would you like to resume?');
      if (!resume) {
        this.resetAssessment();
      } else {
        this.emit('assessmentResumed', this.state);
        return;
      }
    }
    
    this.state.tier = tier;
    this.state.mode = mode;
    this.state.status = 'in_progress';
    this.state.startTime = new Date().toISOString();
    this.state.questionStartTime = Date.now();
    
    this.loadQuestions();
    this.saveState();
    this.emit('assessmentStarted', this.state);
  }
  
  /**
   * Load questions based on tier and mode
   */
  async loadQuestions() {
    try {
      // In a real implementation, this would fetch from an API or import from modules
      const { transformValidatedQuestions } = await import('../data/questions.js');
      this.questions = transformValidatedQuestions(this.state.tier);
      this.emit('questionsLoaded', { count: this.questions.length });
    } catch (error) {
      console.error('Error loading questions:', error);
      this.emit('error', { type: 'loadQuestions', error });
      throw error;
    }
  }
  
  /**
   * Get current question
   */
  getCurrentQuestion() {
    return this.questions[this.state.currentQuestionIndex];
  }
  
  /**
   * Save response for current question
   */
  saveResponse(response) {
    if (!this.validateResponse(response)) {
      this.emit('validationError', { response });
      return false;
    }
    
    const currentQuestion = this.getCurrentQuestion();
    const responseTime = Date.now() - this.state.questionStartTime;
    
    const fullResponse = {
      questionId: currentQuestion.id,
      questionIndex: this.state.currentQuestionIndex,
      value: response.value,
      responseTime,
      timestamp: new Date().toISOString(),
      category: currentQuestion.category,
      facet: currentQuestion.facet,
      instrument: currentQuestion.instrument,
      biometrics: this.config.enableBiometrics ? this.collectBiometrics() : null
    };
    
    // Update existing response or add new one
    const existingIndex = this.state.responses.findIndex(
      r => r.questionId === currentQuestion.id
    );
    
    if (existingIndex >= 0) {
      this.state.responses[existingIndex] = fullResponse;
    } else {
      this.state.responses.push(fullResponse);
    }
    
    this.saveState();
    this.emit('responseSaved', fullResponse);
    return true;
  }
  
  /**
   * Validate a response
   */
  validateResponse(response) {
    if (!this.config.validateResponses) return true;
    
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return false;
    
    // Check if response has a value
    if (response.value === undefined || response.value === null || response.value === '') {
      return false;
    }
    
    // Type-specific validation
    switch (currentQuestion.type) {
      case 'spectrum':
        return typeof response.value === 'number' && 
               response.value >= 0 && 
               response.value <= 100;
      
      case 'scenario':
      case 'wouldYouRather':
        return currentQuestion.options.some(opt => opt.value === response.value);
      
      case 'wordChoice':
        return Array.isArray(response.value) && 
               response.value.length <= currentQuestion.maxSelections;
      
      case 'rankOrder':
        return Array.isArray(response.value) && 
               response.value.length === currentQuestion.items.length;
      
      default:
        return true;
    }
  }
  
  /**
   * Collect biometric data for response
   */
  collectBiometrics() {
    return {
      timestamp: Date.now(),
      responseLatency: Date.now() - this.state.questionStartTime,
      // In a real implementation, this could collect:
      // - Keystroke dynamics
      // - Mouse movement patterns
      // - Touch pressure (on supported devices)
      // - Response confidence based on hesitation
    };
  }
  
  /**
   * Move to next question
   */
  nextQuestion() {
    if (this.state.currentQuestionIndex < this.questions.length - 1) {
      this.state.currentQuestionIndex++;
      this.state.questionStartTime = Date.now();
      this.saveState();
      this.emit('questionChanged', {
        index: this.state.currentQuestionIndex,
        question: this.getCurrentQuestion()
      });
      return true;
    }
    return false;
  }
  
  /**
   * Move to previous question
   */
  previousQuestion() {
    if (this.state.currentQuestionIndex > 0) {
      this.state.currentQuestionIndex--;
      this.state.questionStartTime = Date.now();
      this.saveState();
      this.emit('questionChanged', {
        index: this.state.currentQuestionIndex,
        question: this.getCurrentQuestion()
      });
      return true;
    }
    return false;
  }
  
  /**
   * Jump to specific question
   */
  goToQuestion(index) {
    if (index >= 0 && index < this.questions.length) {
      this.state.currentQuestionIndex = index;
      this.state.questionStartTime = Date.now();
      this.saveState();
      this.emit('questionChanged', {
        index: this.state.currentQuestionIndex,
        question: this.getCurrentQuestion()
      });
      return true;
    }
    return false;
  }
  
  /**
   * Complete the assessment
   */
  async completeAssessment() {
    if (this.state.responses.length < this.questions.length * 0.8) {
      const confirm = window.confirm(
        `You have only answered ${this.state.responses.length} out of ${this.questions.length} questions. ` +
        'Are you sure you want to complete the assessment?'
      );
      if (!confirm) return false;
    }
    
    this.state.status = 'completed';
    this.state.endTime = new Date().toISOString();
    
    // Calculate completion time
    const completionTime = new Date(this.state.endTime) - new Date(this.state.startTime);
    this.state.completionTime = completionTime;
    
    this.saveState();
    this.emit('assessmentCompleted', this.state);
    
    // Calculate results
    const results = await this.calculateResults();
    return results;
  }
  
  /**
   * Calculate assessment results
   */
  async calculateResults() {
    try {
      const { EnhancedResultsEngine } = await import('./ResultsEngine.js');
      const resultsEngine = new EnhancedResultsEngine();
      const results = resultsEngine.calculateResults(this.state.responses);
      
      this.state.results = results;
      this.saveState();
      this.emit('resultsCalculated', results);
      
      return results;
    } catch (error) {
      console.error('Error calculating results:', error);
      this.emit('error', { type: 'calculateResults', error });
      throw error;
    }
  }
  
  /**
   * Reset the assessment
   */
  resetAssessment() {
    this.state = {
      sessionId: this.generateSessionId(),
      status: 'not_started',
      currentQuestionIndex: 0,
      responses: [],
      startTime: null,
      endTime: null,
      questionStartTime: null,
      tier: 'core',
      mode: 'validated',
      metadata: this.state.metadata
    };
    
    localStorage.removeItem(this.config.storageKey);
    this.emit('assessmentReset', this.state);
  }
  
  /**
   * Get progress information
   */
  getProgress() {
    return {
      currentQuestion: this.state.currentQuestionIndex + 1,
      totalQuestions: this.questions.length,
      answeredQuestions: this.state.responses.length,
      percentComplete: Math.round((this.state.responses.length / this.questions.length) * 100),
      timeElapsed: this.state.startTime ? Date.now() - new Date(this.state.startTime).getTime() : 0,
      estimatedTimeRemaining: this.estimateTimeRemaining()
    };
  }
  
  /**
   * Estimate time remaining
   */
  estimateTimeRemaining() {
    if (this.state.responses.length === 0) {
      return this.questions.length * 30000; // 30 seconds per question estimate
    }
    
    const avgResponseTime = this.state.responses.reduce(
      (sum, r) => sum + r.responseTime, 0
    ) / this.state.responses.length;
    
    const remainingQuestions = this.questions.length - this.state.responses.length;
    return Math.round(remainingQuestions * avgResponseTime);
  }
  
  /**
   * Event emitter functionality
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }
  
  /**
   * Cleanup
   */
  destroy() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    this.listeners.clear();
    this.emit('destroyed');
  }
}

export default AssessmentEngine;