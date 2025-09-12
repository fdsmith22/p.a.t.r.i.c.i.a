/**
 * AnimationController.js
 * Manages all animations and transitions in the application
 */

export class AnimationController {
    constructor(config = {}) {
        this.config = {
            enableAnimations: true,
            respectReducedMotion: true,
            defaultDuration: 300,
            defaultEasing: 'ease',
            ...config
        };
        
        this.activeAnimations = new Set();
        this.init();
    }
    
    init() {
        // Check for reduced motion preference
        if (this.config.respectReducedMotion) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            this.config.enableAnimations = !prefersReducedMotion.matches;
            
            // Listen for changes
            prefersReducedMotion.addEventListener('change', (e) => {
                this.config.enableAnimations = !e.matches;
            });
        }
        
        // Setup animation end listeners
        this.setupAnimationListeners();
    }
    
    setupAnimationListeners() {
        // Clean up animations when they complete
        document.addEventListener('animationend', (e) => {
            if (e.target.dataset.animationCleanup) {
                e.target.style.animation = '';
                delete e.target.dataset.animationCleanup;
            }
        });
        
        document.addEventListener('transitionend', (e) => {
            if (e.target.dataset.transitionCleanup) {
                e.target.style.transition = '';
                delete e.target.dataset.transitionCleanup;
            }
        });
    }
    
    animate(element, animation, options = {}) {
        if (!this.config.enableAnimations) {
            if (options.onComplete) options.onComplete();
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            const duration = options.duration || this.config.defaultDuration;
            const easing = options.easing || this.config.defaultEasing;
            
            // Set animation
            element.style.animation = `${animation} ${duration}ms ${easing}`;
            element.dataset.animationCleanup = 'true';
            
            // Handle completion
            const handleComplete = () => {
                element.removeEventListener('animationend', handleComplete);
                if (options.onComplete) options.onComplete();
                resolve();
            };
            
            element.addEventListener('animationend', handleComplete, { once: true });
            
            // Timeout fallback
            setTimeout(handleComplete, duration + 100);
        });
    }
    
    transition(element, properties, options = {}) {
        if (!this.config.enableAnimations) {
            Object.assign(element.style, properties);
            if (options.onComplete) options.onComplete();
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            const duration = options.duration || this.config.defaultDuration;
            const easing = options.easing || this.config.defaultEasing;
            
            // Set transition
            element.style.transition = `all ${duration}ms ${easing}`;
            element.dataset.transitionCleanup = 'true';
            
            // Apply properties
            requestAnimationFrame(() => {
                Object.assign(element.style, properties);
            });
            
            // Handle completion
            const handleComplete = () => {
                element.removeEventListener('transitionend', handleComplete);
                if (options.onComplete) options.onComplete();
                resolve();
            };
            
            element.addEventListener('transitionend', handleComplete, { once: true });
            
            // Timeout fallback
            setTimeout(handleComplete, duration + 100);
        });
    }
    
    fadeIn(element, options = {}) {
        element.style.opacity = '0';
        element.style.display = options.display || 'block';
        
        return this.transition(element, { opacity: '1' }, options);
    }
    
    fadeOut(element, options = {}) {
        return this.transition(element, { opacity: '0' }, {
            ...options,
            onComplete: () => {
                element.style.display = 'none';
                if (options.onComplete) options.onComplete();
            }
        });
    }
    
    slideIn(element, direction = 'left', options = {}) {
        const transforms = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            top: 'translateY(-100%)',
            bottom: 'translateY(100%)'
        };
        
        element.style.transform = transforms[direction];
        element.style.display = options.display || 'block';
        
        return this.transition(element, { transform: 'translate(0, 0)' }, options);
    }
    
    slideOut(element, direction = 'left', options = {}) {
        const transforms = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            top: 'translateY(-100%)',
            bottom: 'translateY(100%)'
        };
        
        return this.transition(element, { transform: transforms[direction] }, {
            ...options,
            onComplete: () => {
                element.style.display = 'none';
                if (options.onComplete) options.onComplete();
            }
        });
    }
    
    scaleIn(element, options = {}) {
        element.style.transform = 'scale(0)';
        element.style.display = options.display || 'block';
        
        return this.transition(element, { transform: 'scale(1)' }, options);
    }
    
    scaleOut(element, options = {}) {
        return this.transition(element, { transform: 'scale(0)' }, {
            ...options,
            onComplete: () => {
                element.style.display = 'none';
                if (options.onComplete) options.onComplete();
            }
        });
    }
    
    shake(element, options = {}) {
        return this.animate(element, 'shake', options);
    }
    
    pulse(element, options = {}) {
        return this.animate(element, 'pulse', options);
    }
    
    bounce(element, options = {}) {
        return this.animate(element, 'bounce', options);
    }
    
    animateQuestionEntrance() {
        const questionContent = document.getElementById('question-content');
        if (!questionContent) return;
        
        // Fade in with slide up
        questionContent.style.opacity = '0';
        questionContent.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            this.transition(questionContent, {
                opacity: '1',
                transform: 'translateY(0)'
            }, {
                duration: 400,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
        });
        
        // Animate options with stagger
        const options = questionContent.querySelectorAll('.visual-option, .scenario-option');
        options.forEach((option, index) => {
            option.style.opacity = '0';
            option.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                this.transition(option, {
                    opacity: '1',
                    transform: 'translateY(0)'
                }, {
                    duration: 300,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                });
            }, index * 50);
        });
    }
    
    celebrateCompletion() {
        if (!this.config.enableAnimations) return;
        
        // Trigger confetti if available
        if (typeof confetti === 'function') {
            // Create multiple bursts
            const count = 3;
            const defaults = {
                origin: { y: 0.7 },
                zIndex: 10000
            };
            
            function fire(particleRatio, opts) {
                confetti({
                    ...defaults,
                    ...opts,
                    particleCount: Math.floor(200 * particleRatio),
                    spread: 26,
                    startVelocity: 55,
                });
            }
            
            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            
            fire(0.2, {
                spread: 60,
            });
            
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });
            
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2
            });
            
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }
        
        // Animate results display
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            this.scaleIn(resultsContainer, {
                duration: 600,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            });
        }
    }
    
    animateProgressBar(percentage) {
        const progressFill = document.getElementById('progress-fill');
        if (!progressFill) return;
        
        const currentWidth = parseFloat(progressFill.style.width) || 0;
        const steps = 20;
        const increment = (percentage - currentWidth) / steps;
        let currentStep = 0;
        
        const updateProgress = () => {
            if (currentStep < steps) {
                currentStep++;
                const newWidth = currentWidth + (increment * currentStep);
                progressFill.style.width = `${newWidth}%`;
                requestAnimationFrame(updateProgress);
            }
        };
        
        requestAnimationFrame(updateProgress);
    }
    
    rippleEffect(element, event) {
        if (!this.config.enableAnimations) return;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    parallaxScroll(elements, options = {}) {
        if (!this.config.enableAnimations) return;
        
        const speed = options.speed || 0.5;
        
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            
            elements.forEach(element => {
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }
    
    typewriterEffect(element, text, options = {}) {
        if (!this.config.enableAnimations) {
            element.textContent = text;
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            const speed = options.speed || 50;
            let index = 0;
            
            element.textContent = '';
            
            const type = () => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            };
            
            type();
        });
    }
    
    countUp(element, start, end, options = {}) {
        if (!this.config.enableAnimations) {
            element.textContent = end;
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            const duration = options.duration || 2000;
            const steps = 60;
            const increment = (end - start) / steps;
            const stepDuration = duration / steps;
            let current = start;
            let step = 0;
            
            const update = () => {
                if (step < steps) {
                    step++;
                    current += increment;
                    element.textContent = Math.round(current);
                    setTimeout(update, stepDuration);
                } else {
                    element.textContent = end;
                    resolve();
                }
            };
            
            update();
        });
    }
    
    morphSVG(from, to, options = {}) {
        // SVG morphing animation (requires more complex implementation)
        // This is a placeholder for future implementation
        console.log('SVG morphing not yet implemented');
    }
    
    setEnabled(enabled) {
        this.config.enableAnimations = enabled;
    }
    
    isEnabled() {
        return this.config.enableAnimations;
    }
}

// Add required CSS animations if not already present
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-30px); }
        60% { transform: translateY(-15px); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

document.head.appendChild(style);

export default AnimationController;