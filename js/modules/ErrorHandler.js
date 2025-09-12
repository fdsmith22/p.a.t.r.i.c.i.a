/**
 * ErrorHandler.js
 * Comprehensive error handling and validation system for P.A.T.R.I.C.I.A
 * 
 * Features:
 * - Global error catching
 * - User-friendly error messages
 * - Error logging and reporting
 * - Recovery mechanisms
 * - Input validation
 */

export class ErrorHandler {
  constructor(config = {}) {
    this.config = {
      logToConsole: true,
      logToServer: false,
      showUserNotifications: true,
      maxRetries: 3,
      retryDelay: 1000,
      errorEndpoint: '/api/errors',
      ...config
    };
    
    this.errorLog = [];
    this.retryQueue = new Map();
    this.notificationContainer = null;
    
    this.init();
  }
  
  /**
   * Initialize error handler
   */
  init() {
    this.setupGlobalHandlers();
    this.createNotificationContainer();
  }
  
  /**
   * Setup global error handlers
   */
  setupGlobalHandlers() {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'uncaught',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error,
        timestamp: new Date().toISOString()
      });
      event.preventDefault();
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'unhandledRejection',
        reason: event.reason,
        promise: event.promise,
        timestamp: new Date().toISOString()
      });
      event.preventDefault();
    });
    
    // Handle network errors
    window.addEventListener('offline', () => {
      this.showNotification('Connection lost. Your progress is being saved locally.', 'warning');
    });
    
    window.addEventListener('online', () => {
      this.showNotification('Connection restored.', 'success');
      this.processRetryQueue();
    });
  }
  
  /**
   * Create notification container for user messages
   */
  createNotificationContainer() {
    if (!document.getElementById('error-notifications')) {
      this.notificationContainer = document.createElement('div');
      this.notificationContainer.id = 'error-notifications';
      this.notificationContainer.className = 'notification-container';
      this.notificationContainer.setAttribute('role', 'alert');
      this.notificationContainer.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.notificationContainer);
      
      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          max-width: 400px;
        }
        
        .notification {
          background: var(--bg-card, #fff);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-left: 4px solid;
          animation: slideIn 0.3s ease-out;
          position: relative;
        }
        
        .notification.success {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }
        
        .notification.error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        
        .notification.warning {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }
        
        .notification.info {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .notification-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .notification-close:hover {
          opacity: 1;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * Handle an error
   */
  handleError(error, context = {}) {
    // Create error record
    const errorRecord = {
      id: this.generateErrorId(),
      ...error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: error.timestamp || new Date().toISOString()
    };
    
    // Log error
    this.logError(errorRecord);
    
    // Determine user message
    const userMessage = this.getUserMessage(error);
    
    // Show notification to user
    if (this.config.showUserNotifications && userMessage) {
      this.showNotification(userMessage.message, userMessage.type);
    }
    
    // Send to server if configured
    if (this.config.logToServer) {
      this.sendErrorToServer(errorRecord);
    }
    
    // Attempt recovery if possible
    this.attemptRecovery(error);
    
    return errorRecord;
  }
  
  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Log error
   */
  logError(error) {
    this.errorLog.push(error);
    
    // Keep only last 100 errors in memory
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }
    
    if (this.config.logToConsole) {
      console.error('[P.A.T.R.I.C.I.A Error]', error);
    }
    
    // Store in localStorage for debugging
    try {
      const storedErrors = JSON.parse(localStorage.getItem('patricia_errors') || '[]');
      storedErrors.push(error);
      // Keep only last 50 errors in storage
      if (storedErrors.length > 50) {
        storedErrors.splice(0, storedErrors.length - 50);
      }
      localStorage.setItem('patricia_errors', JSON.stringify(storedErrors));
    } catch (e) {
      // Ignore storage errors
    }
  }
  
  /**
   * Get user-friendly error message
   */
  getUserMessage(error) {
    const messages = {
      network: {
        message: 'Network error. Please check your connection and try again.',
        type: 'error'
      },
      validation: {
        message: 'Please check your input and try again.',
        type: 'warning'
      },
      authentication: {
        message: 'Authentication failed. Please log in again.',
        type: 'error'
      },
      authorization: {
        message: 'You don\'t have permission to perform this action.',
        type: 'error'
      },
      server: {
        message: 'Server error. Our team has been notified.',
        type: 'error'
      },
      timeout: {
        message: 'Request timed out. Please try again.',
        type: 'warning'
      },
      offline: {
        message: 'You appear to be offline. Changes will be saved locally.',
        type: 'warning'
      },
      storage: {
        message: 'Unable to save data. Please check your browser settings.',
        type: 'error'
      },
      default: {
        message: 'An unexpected error occurred. Please try again.',
        type: 'error'
      }
    };
    
    // Determine error type
    let errorType = 'default';
    
    if (error.type === 'network' || error.code === 'NETWORK_ERROR') {
      errorType = 'network';
    } else if (error.type === 'validation' || error.code === 'VALIDATION_ERROR') {
      errorType = 'validation';
    } else if (error.status === 401) {
      errorType = 'authentication';
    } else if (error.status === 403) {
      errorType = 'authorization';
    } else if (error.status >= 500) {
      errorType = 'server';
    } else if (error.type === 'timeout') {
      errorType = 'timeout';
    } else if (!navigator.onLine) {
      errorType = 'offline';
    }
    
    return messages[errorType];
  }
  
  /**
   * Show notification to user
   */
  showNotification(message, type = 'info', duration = 5000) {
    if (!this.notificationContainer) {
      this.createNotificationContainer();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">${message}</div>
      <button class="notification-close" aria-label="Close notification">✕</button>
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      notification.remove();
    });
    
    this.notificationContainer.appendChild(notification);
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = 'slideOut 0.3s ease-out';
          setTimeout(() => notification.remove(), 300);
        }
      }, duration);
    }
    
    return notification;
  }
  
  /**
   * Send error to server
   */
  async sendErrorToServer(error) {
    try {
      const response = await fetch(this.config.errorEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(error)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to log error: ${response.status}`);
      }
    } catch (e) {
      // Add to retry queue if offline
      if (!navigator.onLine) {
        this.addToRetryQueue('sendError', error);
      }
      console.error('Failed to send error to server:', e);
    }
  }
  
  /**
   * Attempt to recover from error
   */
  attemptRecovery(error) {
    // Implement recovery strategies based on error type
    if (error.type === 'network' && error.retry) {
      this.addToRetryQueue(error.retry.action, error.retry.data);
    }
    
    // Reload page for critical errors (with user confirmation)
    if (error.critical) {
      setTimeout(() => {
        if (confirm('A critical error occurred. Would you like to reload the page?')) {
          window.location.reload();
        }
      }, 1000);
    }
  }
  
  /**
   * Add action to retry queue
   */
  addToRetryQueue(action, data) {
    if (!this.retryQueue.has(action)) {
      this.retryQueue.set(action, []);
    }
    this.retryQueue.get(action).push({
      data,
      attempts: 0,
      timestamp: Date.now()
    });
  }
  
  /**
   * Process retry queue
   */
  async processRetryQueue() {
    for (const [action, items] of this.retryQueue.entries()) {
      for (const item of items) {
        if (item.attempts < this.config.maxRetries) {
          item.attempts++;
          try {
            await this.retryAction(action, item.data);
            // Remove from queue if successful
            const index = items.indexOf(item);
            items.splice(index, 1);
          } catch (e) {
            // Wait before next retry
            await new Promise(resolve => 
              setTimeout(resolve, this.config.retryDelay * item.attempts)
            );
          }
        }
      }
      
      // Clean up empty queues
      if (items.length === 0) {
        this.retryQueue.delete(action);
      }
    }
  }
  
  /**
   * Retry an action
   */
  async retryAction(action, data) {
    // Implement retry logic based on action type
    switch (action) {
      case 'sendError':
        return this.sendErrorToServer(data);
      case 'saveState':
        return localStorage.setItem(data.key, data.value);
      case 'fetch':
        return fetch(data.url, data.options);
      default:
        throw new Error(`Unknown retry action: ${action}`);
    }
  }
  
  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = [];
    try {
      localStorage.removeItem('patricia_errors');
    } catch (e) {
      // Ignore
    }
  }
  
  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      last24Hours: 0,
      lastHour: 0
    };
    
    const now = Date.now();
    const hourAgo = now - 3600000;
    const dayAgo = now - 86400000;
    
    this.errorLog.forEach(error => {
      // Count by type
      const type = error.type || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      
      // Count by time
      const errorTime = new Date(error.timestamp).getTime();
      if (errorTime > dayAgo) {
        stats.last24Hours++;
      }
      if (errorTime > hourAgo) {
        stats.lastHour++;
      }
    });
    
    return stats;
  }
}

/**
 * Input Validator
 * Validates user inputs and provides helpful feedback
 */
export class InputValidator {
  constructor() {
    this.rules = new Map();
    this.setupDefaultRules();
  }
  
  /**
   * Setup default validation rules
   */
  setupDefaultRules() {
    // Email validation
    this.addRule('email', {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    });
    
    // Required field
    this.addRule('required', {
      validator: (value) => value !== null && value !== undefined && value !== '',
      message: 'This field is required'
    });
    
    // Minimum length
    this.addRule('minLength', {
      validator: (value, min) => String(value).length >= min,
      message: (min) => `Must be at least ${min} characters`
    });
    
    // Maximum length
    this.addRule('maxLength', {
      validator: (value, max) => String(value).length <= max,
      message: (max) => `Must be no more than ${max} characters`
    });
    
    // Number range
    this.addRule('range', {
      validator: (value, min, max) => {
        const num = Number(value);
        return !isNaN(num) && num >= min && num <= max;
      },
      message: (min, max) => `Must be between ${min} and ${max}`
    });
    
    // Pattern matching
    this.addRule('pattern', {
      validator: (value, pattern) => new RegExp(pattern).test(value),
      message: 'Invalid format'
    });
  }
  
  /**
   * Add custom validation rule
   */
  addRule(name, rule) {
    this.rules.set(name, rule);
  }
  
  /**
   * Validate a value against rules
   */
  validate(value, rules) {
    const errors = [];
    
    for (const rule of rules) {
      let ruleName, params;
      
      if (typeof rule === 'string') {
        ruleName = rule;
        params = [];
      } else {
        ruleName = rule.rule;
        params = rule.params || [];
      }
      
      const ruleConfig = this.rules.get(ruleName);
      if (!ruleConfig) {
        console.warn(`Unknown validation rule: ${ruleName}`);
        continue;
      }
      
      let isValid;
      if (ruleConfig.pattern) {
        isValid = ruleConfig.pattern.test(value);
      } else if (ruleConfig.validator) {
        isValid = ruleConfig.validator(value, ...params);
      } else {
        continue;
      }
      
      if (!isValid) {
        const message = typeof ruleConfig.message === 'function' 
          ? ruleConfig.message(...params)
          : ruleConfig.message;
        errors.push({
          rule: ruleName,
          message
        });
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Validate form data
   */
  validateForm(formData, schema) {
    const results = {};
    let isValid = true;
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = formData[field];
      const validation = this.validate(value, rules);
      results[field] = validation;
      
      if (!validation.valid) {
        isValid = false;
      }
    }
    
    return {
      valid: isValid,
      fields: results
    };
  }
  
  /**
   * Apply validation to form element
   */
  applyToForm(formElement, schema) {
    const inputs = formElement.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const fieldName = input.name || input.id;
      const rules = schema[fieldName];
      
      if (rules) {
        // Add validation on blur
        input.addEventListener('blur', () => {
          const validation = this.validate(input.value, rules);
          this.showFieldValidation(input, validation);
        });
        
        // Clear validation on focus
        input.addEventListener('focus', () => {
          this.clearFieldValidation(input);
        });
      }
    });
    
    // Validate on form submit
    formElement.addEventListener('submit', (e) => {
      const formData = new FormData(formElement);
      const data = Object.fromEntries(formData);
      const validation = this.validateForm(data, schema);
      
      if (!validation.valid) {
        e.preventDefault();
        
        // Show field errors
        for (const [field, result] of Object.entries(validation.fields)) {
          const input = formElement.elements[field];
          if (input) {
            this.showFieldValidation(input, result);
          }
        }
        
        // Focus first error field
        const firstError = Object.entries(validation.fields)
          .find(([_, result]) => !result.valid);
        if (firstError) {
          const input = formElement.elements[firstError[0]];
          if (input) {
            input.focus();
          }
        }
      }
    });
  }
  
  /**
   * Show field validation result
   */
  showFieldValidation(input, validation) {
    // Remove existing validation message
    this.clearFieldValidation(input);
    
    if (!validation.valid) {
      input.classList.add('input-error');
      input.setAttribute('aria-invalid', 'true');
      
      // Create error message element
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.setAttribute('role', 'alert');
      errorElement.textContent = validation.errors[0].message;
      
      // Insert after input
      input.parentNode.insertBefore(errorElement, input.nextSibling);
    } else {
      input.classList.add('input-valid');
      input.setAttribute('aria-invalid', 'false');
    }
  }
  
  /**
   * Clear field validation
   */
  clearFieldValidation(input) {
    input.classList.remove('input-error', 'input-valid');
    input.removeAttribute('aria-invalid');
    
    const errorElement = input.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }
}

// Export singleton instances
export const errorHandler = new ErrorHandler();
export const validator = new InputValidator();

export default { ErrorHandler, InputValidator, errorHandler, validator };