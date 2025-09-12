/**
 * UIManager.js
 * Handles all UI interactions and notifications
 */

export class UIManager {
    constructor() {
        this.notificationContainer = null;
        this.modalContainer = null;
        this.activeNotifications = new Set();
        this.init();
    }
    
    init() {
        this.setupNotificationContainer();
        this.setupModalContainer();
    }
    
    setupNotificationContainer() {
        this.notificationContainer = document.getElementById('notification-container');
        if (!this.notificationContainer) {
            this.notificationContainer = document.createElement('div');
            this.notificationContainer.id = 'notification-container';
            this.notificationContainer.className = 'notification-container';
            this.notificationContainer.setAttribute('aria-live', 'polite');
            document.body.appendChild(this.notificationContainer);
        }
    }
    
    setupModalContainer() {
        this.modalBackdrop = document.getElementById('modal-backdrop');
        this.modalElement = document.getElementById('modal');
        
        if (!this.modalBackdrop) {
            this.modalBackdrop = document.createElement('div');
            this.modalBackdrop.id = 'modal-backdrop';
            this.modalBackdrop.className = 'modal-backdrop hidden';
            document.body.appendChild(this.modalBackdrop);
        }
        
        if (!this.modalElement) {
            this.modalElement = document.createElement('div');
            this.modalElement.id = 'modal';
            this.modalElement.className = 'modal hidden';
            this.modalElement.innerHTML = '<div class="modal-content" id="modal-content"></div>';
            document.body.appendChild(this.modalElement);
        }
        
        // Close modal on backdrop click
        this.modalBackdrop.addEventListener('click', () => this.closeModal());
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modalElement.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }
    
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('role', 'alert');
        
        // Create notification content
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;
        
        // Add to container
        this.notificationContainer.appendChild(notification);
        this.activeNotifications.add(notification);
        
        // Setup close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.removeNotification(notification));
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => this.removeNotification(notification), duration);
        }
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.animation = 'slideInRight 0.3s ease';
        });
        
        return notification;
    }
    
    removeNotification(notification) {
        if (!this.activeNotifications.has(notification)) return;
        
        notification.style.animation = 'slideOutRight 0.3s ease';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.activeNotifications.delete(notification);
        }, 300);
    }
    
    clearAllNotifications() {
        this.activeNotifications.forEach(notification => {
            this.removeNotification(notification);
        });
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
    
    showModal(content, options = {}) {
        const defaults = {
            title: '',
            closeButton: true,
            className: '',
            onClose: null
        };
        
        const config = { ...defaults, ...options };
        
        // Set modal content
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `
            ${config.title ? `<h2 class="modal-title">${config.title}</h2>` : ''}
            ${config.closeButton ? '<button class="modal-close" aria-label="Close">&times;</button>' : ''}
            <div class="modal-body">${content}</div>
        `;
        
        // Add custom class if provided
        if (config.className) {
            this.modalElement.className = `modal ${config.className}`;
        }
        
        // Setup close button
        if (config.closeButton) {
            const closeBtn = modalContent.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => this.closeModal(config.onClose));
        }
        
        // Show modal
        this.modalBackdrop.classList.remove('hidden');
        this.modalElement.classList.remove('hidden');
        
        // Focus management
        this.modalElement.focus();
        
        // Trap focus within modal
        this.trapFocus(this.modalElement);
        
        return this.modalElement;
    }
    
    closeModal(callback) {
        this.modalBackdrop.classList.add('hidden');
        this.modalElement.classList.add('hidden');
        
        // Release focus trap
        this.releaseFocus();
        
        // Execute callback if provided
        if (typeof callback === 'function') {
            callback();
        }
    }
    
    async confirm(message, options = {}) {
        return new Promise((resolve) => {
            const content = `
                <p>${message}</p>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
                    <button class="btn btn-primary" id="modal-confirm">Confirm</button>
                </div>
            `;
            
            this.showModal(content, {
                title: options.title || 'Confirm',
                closeButton: false,
                className: 'modal-confirm'
            });
            
            const confirmBtn = document.getElementById('modal-confirm');
            const cancelBtn = document.getElementById('modal-cancel');
            
            confirmBtn.addEventListener('click', () => {
                this.closeModal();
                resolve(true);
            });
            
            cancelBtn.addEventListener('click', () => {
                this.closeModal();
                resolve(false);
            });
        });
    }
    
    async prompt(message, options = {}) {
        return new Promise((resolve) => {
            const content = `
                <p>${message}</p>
                <input type="${options.type || 'text'}" 
                       class="modal-input" 
                       id="modal-input" 
                       placeholder="${options.placeholder || ''}"
                       value="${options.defaultValue || ''}">
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
                    <button class="btn btn-primary" id="modal-submit">Submit</button>
                </div>
            `;
            
            this.showModal(content, {
                title: options.title || 'Input Required',
                closeButton: false,
                className: 'modal-prompt'
            });
            
            const input = document.getElementById('modal-input');
            const submitBtn = document.getElementById('modal-submit');
            const cancelBtn = document.getElementById('modal-cancel');
            
            // Focus input
            input.focus();
            
            const submit = () => {
                this.closeModal();
                resolve(input.value);
            };
            
            const cancel = () => {
                this.closeModal();
                resolve(null);
            };
            
            submitBtn.addEventListener('click', submit);
            cancelBtn.addEventListener('click', cancel);
            
            // Submit on Enter
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    submit();
                }
            });
        });
    }
    
    showLoading(message = 'Loading...') {
        const loadingEl = document.getElementById('loading-screen');
        if (loadingEl) {
            const messageEl = loadingEl.querySelector('p');
            if (messageEl) {
                messageEl.textContent = message;
            }
            loadingEl.classList.remove('hidden');
        }
    }
    
    hideLoading() {
        const loadingEl = document.getElementById('loading-screen');
        if (loadingEl) {
            loadingEl.classList.add('hidden');
        }
    }
    
    showError(message, details = null) {
        const errorEl = document.getElementById('error-screen');
        if (errorEl) {
            const messageEl = document.getElementById('error-message');
            if (messageEl) {
                messageEl.textContent = message;
                if (details) {
                    messageEl.innerHTML += `<br><small>${details}</small>`;
                }
            }
            errorEl.classList.remove('hidden');
        } else {
            // Fallback to notification
            this.showNotification(message, 'error', 0);
        }
    }
    
    hideError() {
        const errorEl = document.getElementById('error-screen');
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    }
    
    trapFocus(element) {
        this.focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        this.firstFocusableElement = this.focusableElements[0];
        this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
        
        this.focusTrapHandler = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === this.firstFocusableElement) {
                        this.lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === this.lastFocusableElement) {
                        this.firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        
        element.addEventListener('keydown', this.focusTrapHandler);
    }
    
    releaseFocus() {
        if (this.modalElement && this.focusTrapHandler) {
            this.modalElement.removeEventListener('keydown', this.focusTrapHandler);
        }
    }
    
    updateProgressBar(percentage) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        const progressPercent = document.getElementById('progress-percent');
        if (progressPercent) {
            progressPercent.textContent = `${percentage}%`;
        }
    }
    
    toggleElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.toggle('hidden');
        }
    }
    
    addClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(className);
        }
    }
    
    removeClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(className);
        }
    }
    
    setText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }
    
    setHTML(elementId, html) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    }
}

export default UIManager;