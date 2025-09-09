/* ================================================
   P.A.T.R.I.C.I.A - Interactive Visual Enhancements
   Premium JavaScript Interactions
   ================================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ================================================
       Gradient Mesh Background
       ================================================ */
    function initGradientMesh() {
        if (!document.querySelector('.gradient-mesh-bg')) {
            const meshBg = document.createElement('div');
            meshBg.className = 'gradient-mesh-bg';
            document.body.prepend(meshBg);
        }
    }
    
    /* ================================================
       Particle Constellation
       ================================================ */
    class ParticleConstellation {
        constructor() {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'particle-constellation';
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.connections = [];
            this.mouse = { x: 0, y: 0 };
            
            document.body.prepend(this.canvas);
            this.init();
        }
        
        init() {
            this.resize();
            this.createParticles();
            this.animate();
            
            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        }
        
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        createParticles() {
            const particleCount = Math.min(100, window.innerWidth / 10);
            
            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update particles
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(183, 148, 246, ${particle.opacity})`;
                this.ctx.fill();
            });
            
            // Draw connections
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.strokeStyle = `rgba(183, 148, 246, ${0.2 * (1 - distance / 150)})`;
                        this.ctx.stroke();
                    }
                }
                
                // Connect to mouse
                const mouseDx = this.particles[i].x - this.mouse.x;
                const mouseDy = this.particles[i].y - this.mouse.y;
                const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                
                if (mouseDistance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.strokeStyle = `rgba(246, 135, 179, ${0.3 * (1 - mouseDistance / 100)})`;
                    this.ctx.stroke();
                }
            }
            
            requestAnimationFrame(() => this.animate());
        }
    }
    
    /* ================================================
       Magnetic Button Effect
       ================================================ */
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.classList.add('btn-magnetic');
            
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 50;
                
                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    button.style.transform = `translate(${x * force * 0.3}px, ${y * force * 0.3}px)`;
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
    
    /* ================================================
       Custom Cursor
       ================================================ */
    class CustomCursor {
        constructor() {
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';
            document.body.appendChild(this.cursor);
            
            this.init();
        }
        
        init() {
            document.addEventListener('mousemove', (e) => {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
            });
            
            document.addEventListener('mousedown', () => {
                this.cursor.classList.add('clicking');
            });
            
            document.addEventListener('mouseup', () => {
                this.cursor.classList.remove('clicking');
            });
            
            // Hide default cursor
            document.body.style.cursor = 'none';
            
            // Show default cursor on inputs and buttons
            const interactives = document.querySelectorAll('input, button, a, select, textarea');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.style.display = 'none';
                    document.body.style.cursor = 'auto';
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.style.display = 'block';
                    document.body.style.cursor = 'none';
                });
            });
        }
    }
    
    /* ================================================
       Likert Scale Blob Animation
       ================================================ */
    function initLikertBlob() {
        const likertContainers = document.querySelectorAll('.likert-container');
        
        likertContainers.forEach(container => {
            const blob = document.createElement('div');
            blob.className = 'likert-blob-bg';
            container.appendChild(blob);
            
            const options = container.querySelectorAll('.likert-option');
            
            options.forEach((option, index) => {
                option.addEventListener('click', () => {
                    // Remove selected from all
                    options.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    
                    // Move blob
                    const rect = option.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    const x = rect.left - containerRect.left + rect.width / 2;
                    
                    blob.style.left = x + 'px';
                    blob.style.opacity = '0.5';
                    blob.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    
                    setTimeout(() => {
                        blob.style.transform = 'translate(-50%, -50%) scale(1)';
                    }, 300);
                });
            });
        });
    }
    
    /* ================================================
       Parallax Scrolling
       ================================================ */
    function initParallax() {
        const layers = document.querySelectorAll('.parallax-layer');
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            
            layers.forEach((layer, index) => {
                const speed = (index + 1) * 0.5;
                layer.style.transform = `translateY(${scrollY * speed}px)`;
            });
        });
    }
    
    /* ================================================
       Question Card Animations
       ================================================ */
    function animateQuestionCards() {
        const cards = document.querySelectorAll('.question-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                        entry.target.classList.add('animated');
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach(card => {
            observer.observe(card);
            
            // Add question number watermark
            const questionNum = card.dataset.questionNumber;
            if (questionNum) {
                const watermark = document.createElement('div');
                watermark.className = 'question-number-watermark';
                watermark.textContent = questionNum;
                card.appendChild(watermark);
            }
        });
    }
    
    /* ================================================
       Progress Aurora Effect
       ================================================ */
    function initAuroraProgress() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const fill = bar.querySelector('.progress-fill');
            if (fill) {
                // Add aurora effect
                fill.classList.add('aurora-fill');
                
                // Add milestone markers
                const milestones = [25, 50, 75, 100];
                milestones.forEach(milestone => {
                    const marker = document.createElement('div');
                    marker.className = 'milestone';
                    marker.style.left = milestone + '%';
                    marker.dataset.milestone = milestone;
                    bar.appendChild(marker);
                });
            }
        });
    }
    
    /* ================================================
       Emoji 3D Rotation
       ================================================ */
    function init3DEmojis() {
        const emojis = document.querySelectorAll('.emoji-option');
        
        emojis.forEach(emoji => {
            emoji.addEventListener('mouseenter', (e) => {
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                emoji.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.2)`;
            });
            
            emoji.addEventListener('mouseleave', () => {
                emoji.style.transform = '';
            });
            
            emoji.addEventListener('click', () => {
                emoji.classList.toggle('selected');
            });
        });
    }
    
    /* ================================================
       Loading Brain Synapses
       ================================================ */
    function initBrainLoader() {
        const loader = document.querySelector('.brain-loader');
        if (loader) {
            for (let i = 0; i < 8; i++) {
                const synapse = document.createElement('div');
                synapse.className = 'synapse';
                loader.appendChild(synapse);
            }
        }
    }
    
    /* ================================================
       Celebration Effects
       ================================================ */
    window.celebrateCompletion = function() {
        // Enhanced confetti
        const colors = ['#b794f6', '#f687b3', '#90cdf4', '#9ae6b4', '#fbd38d'];
        
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors
        });
        
        // Multiple bursts
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
        }, 250);
        
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });
        }, 400);
    };
    
    /* ================================================
       Theme Switcher
       ================================================ */
    function initThemeSwitcher() {
        const themes = ['default', 'cosmic-theme', 'nature-theme'];
        let currentTheme = 0;
        
        // Add theme switcher button if not exists
        if (!document.querySelector('.theme-switcher')) {
            const switcher = document.createElement('button');
            switcher.className = 'theme-switcher';
            switcher.innerHTML = '🎨';
            switcher.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--iris-bloom);
                border: none;
                cursor: pointer;
                font-size: 24px;
                z-index: 1000;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            `;
            
            switcher.addEventListener('click', () => {
                // Remove current theme
                document.body.classList.remove(themes[currentTheme]);
                
                // Move to next theme
                currentTheme = (currentTheme + 1) % themes.length;
                
                // Add new theme
                if (themes[currentTheme] !== 'default') {
                    document.body.classList.add(themes[currentTheme]);
                }
                
                // Animate button
                switcher.style.transform = 'rotate(360deg) scale(1.2)';
                setTimeout(() => {
                    switcher.style.transform = '';
                }, 300);
            });
            
            document.body.appendChild(switcher);
        }
    }
    
    /* ================================================
       Smooth Scroll Indicators
       ================================================ */
    function initScrollIndicators() {
        const sections = document.querySelectorAll('.assessment-section');
        
        if (sections.length > 1) {
            const indicatorContainer = document.createElement('div');
            indicatorContainer.className = 'scroll-indicators';
            indicatorContainer.style.cssText = `
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 100;
            `;
            
            sections.forEach((section, index) => {
                const dot = document.createElement('div');
                dot.className = 'scroll-dot';
                dot.style.cssText = `
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.3);
                    margin: 10px 0;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;
                
                dot.addEventListener('click', () => {
                    section.scrollIntoView({ behavior: 'smooth' });
                });
                
                indicatorContainer.appendChild(dot);
            });
            
            document.body.appendChild(indicatorContainer);
            
            // Update active dot on scroll
            window.addEventListener('scroll', () => {
                const scrollPos = window.scrollY;
                const dots = indicatorContainer.querySelectorAll('.scroll-dot');
                
                sections.forEach((section, index) => {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        dots.forEach(d => d.style.background = 'rgba(255,255,255,0.3)');
                        dots[index].style.background = 'var(--glow-purple)';
                        dots[index].style.transform = 'scale(1.5)';
                    } else {
                        dots[index].style.transform = 'scale(1)';
                    }
                });
            });
        }
    }
    
    /* ================================================
       Mobile Touch Optimizations
       ================================================ */
    function initMobileOptimizations() {
        if ('ontouchstart' in window) {
            // Add touch feedback
            const touchElements = document.querySelectorAll('.btn, .likert-option, .choice-option, .emoji-option');
            
            touchElements.forEach(el => {
                el.addEventListener('touchstart', () => {
                    el.style.transform = 'scale(0.95)';
                });
                
                el.addEventListener('touchend', () => {
                    el.style.transform = '';
                });
            });
            
            // Swipe navigation
            let touchStartX = 0;
            let touchEndX = 0;
            
            document.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            document.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left - next question
                    const nextBtn = document.querySelector('.btn-next');
                    if (nextBtn) nextBtn.click();
                }
                
                if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right - previous question
                    const prevBtn = document.querySelector('.btn-prev');
                    if (prevBtn) prevBtn.click();
                }
            }
        }
    }
    
    /* ================================================
       Initialize Everything
       ================================================ */
    function initializeVisualEnhancements() {
        initGradientMesh();
        new ParticleConstellation();
        initMagneticButtons();
        // new CustomCursor(); // Optional - can affect usability
        initLikertBlob();
        initParallax();
        animateQuestionCards();
        initAuroraProgress();
        init3DEmojis();
        initBrainLoader();
        initThemeSwitcher();
        initScrollIndicators();
        initMobileOptimizations();
        
        // Add glass container class to main container
        const mainContainer = document.querySelector('.container');
        if (mainContainer && !mainContainer.classList.contains('glass-container')) {
            mainContainer.classList.add('glass-container');
        }
        
        // Enhance welcome screen
        const welcomeScreen = document.querySelector('#welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.classList.add('glass-container');
        }
        
        // Enhance results container
        const resultsContainer = document.querySelector('#resultsContainer');
        if (resultsContainer) {
            resultsContainer.classList.add('glass-container');
        }
        
        console.log('✨ P.A.T.R.I.C.I.A Visual Enhancements Loaded');
    }
    
    // Initialize on DOM ready
    initializeVisualEnhancements();
    
    // Re-initialize on dynamic content load
    window.addEventListener('assessmentLoaded', initializeVisualEnhancements);
});

// Export for use in main application
window.PAT_VISUALS = {
    celebrate: window.celebrateCompletion,
    reinit: () => {
        document.dispatchEvent(new Event('DOMContentLoaded'));
    }
};