/**
 * ParticleSystem.js
 * Optimized particle animation system with performance controls
 */

export class ParticleSystem {
    constructor(config = {}) {
        this.config = {
            maxParticles: 50,
            connectionDistance: 150,
            mouseConnectionDistance: 100,
            particleSpeed: 0.5,
            particleMinRadius: 1,
            particleMaxRadius: 2,
            enabled: true,
            autoStart: true,
            useFallback: false,
            ...config
        };
        
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.isRunning = false;
        this.lastFrameTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        
        if (this.config.enabled && this.config.autoStart) {
            this.init();
        }
    }
    
    init() {
        // Check for existing canvas
        this.canvas = document.getElementById('particle-constellation');
        
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'particle-constellation';
            document.body.prepend(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d', {
            alpha: true,
            willReadFrequently: false
        });
        
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        
        if (this.shouldUseFallback()) {
            this.config.useFallback = true;
            this.config.maxParticles = Math.min(30, this.config.maxParticles);
        }
        
        this.start();
    }
    
    setupCanvas() {
        this.resize();
        
        // Set canvas styles for better performance
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.style.opacity = '0.6';
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Use lower resolution on high DPI displays for better performance
        const scale = dpr > 2 ? 2 : dpr;
        
        this.canvas.width = width * scale;
        this.canvas.height = height * scale;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        
        this.ctx.scale(scale, scale);
    }
    
    createParticles() {
        this.particles = [];
        const { maxParticles, particleMinRadius, particleMaxRadius, particleSpeed } = this.config;
        
        for (let i = 0; i < maxParticles; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * particleSpeed,
                vy: (Math.random() - 0.5) * particleSpeed,
                radius: Math.random() * (particleMaxRadius - particleMinRadius) + particleMinRadius,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getParticleColor(i)
            });
        }
    }
    
    getParticleColor(index) {
        // Alternate between theme colors for variety
        const colors = [
            '183, 148, 246', // Purple
            '107, 155, 209', // Blue
            '94, 186, 160'   // Teal
        ];
        return colors[index % colors.length];
    }
    
    setupEventListeners() {
        // Mouse movement with throttling
        let mouseThrottle = null;
        window.addEventListener('mousemove', (e) => {
            if (!mouseThrottle) {
                mouseThrottle = setTimeout(() => {
                    this.mouse.x = e.clientX;
                    this.mouse.y = e.clientY;
                    mouseThrottle = null;
                }, 16); // ~60fps
            }
        });
        
        // Touch support for mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mouse.x = e.touches[0].clientX;
                this.mouse.y = e.touches[0].clientY;
            }
        });
        
        // Resize handling with debouncing
        let resizeTimeout = null;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.createParticles(); // Recreate particles for new dimensions
            }, 250);
        });
        
        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Performance monitoring
        window.addEventListener('blur', () => this.pause());
        window.addEventListener('focus', () => this.resume());
    }
    
    animate(currentTime) {
        if (!this.isRunning) return;
        
        // Calculate FPS
        this.calculateFPS(currentTime);
        
        // Adaptive performance
        if (this.fps < 30 && this.fps > 0) {
            this.reduceQuality();
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.updateParticles();
        
        if (!this.config.useFallback) {
            this.drawConnections();
        }
        
        this.drawParticles();
        
        // Continue animation
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    updateParticles() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(width, particle.x));
            }
            
            if (particle.y < 0 || particle.y > height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(height, particle.y));
            }
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        const { connectionDistance, mouseConnectionDistance } = this.config;
        
        // Draw connections between particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = 0.2 * (1 - distance / connectionDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(183, 148, 246, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
            
            // Draw connections to mouse
            if (this.mouse.x && this.mouse.y) {
                const mouseDx = this.particles[i].x - this.mouse.x;
                const mouseDy = this.particles[i].y - this.mouse.y;
                const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                
                if (mouseDistance < mouseConnectionDistance) {
                    const opacity = 0.3 * (1 - mouseDistance / mouseConnectionDistance);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(246, 135, 179, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    calculateFPS(currentTime) {
        this.frameCount++;
        
        if (currentTime >= this.lastFpsUpdate + 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
            
            // Log FPS in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`Particle System FPS: ${this.fps}`);
            }
        }
    }
    
    shouldUseFallback() {
        // Check for performance indicators
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        const isOldBrowser = !window.requestAnimationFrame || !window.cancelAnimationFrame;
        
        return isMobile || isLowEnd || isOldBrowser;
    }
    
    reduceQuality() {
        // Reduce particle count if performance is poor
        if (this.particles.length > 20) {
            this.particles = this.particles.slice(0, Math.floor(this.particles.length * 0.7));
            this.config.maxParticles = this.particles.length;
        }
        
        // Disable connections in fallback mode
        this.config.useFallback = true;
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    pause() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.isRunning && this.config.enabled) {
            this.start();
        }
    }
    
    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.resume();
        }
    }
    
    destroy() {
        this.pause();
        
        // Remove event listeners
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // Clear references
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
    }
    
    setEnabled(enabled) {
        this.config.enabled = enabled;
        
        if (enabled && !this.isRunning) {
            if (!this.canvas) {
                this.init();
            } else {
                this.start();
            }
        } else if (!enabled) {
            this.pause();
        }
    }
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Recreate particles if count changed
        if (newConfig.maxParticles && newConfig.maxParticles !== this.particles.length) {
            this.createParticles();
        }
    }
}

export default ParticleSystem;