// Enhanced Title Effects for P.A.T.R.I.C.I.A

document.addEventListener('DOMContentLoaded', function() {
    try {
        enhanceTitleEffects();
    } catch (error) {
        console.error('Title enhancement failed:', error);
        // Ensure title remains visible even if enhancement fails
        const title = document.querySelector('h1');
        if (title) {
            title.style.color = '#8b6cc1';
            title.style.opacity = '1';
            title.style.visibility = 'visible';
        }
    }
});

function enhanceTitleEffects() {
    // Find the title element
    const titleElement = document.querySelector('h1');
    const subtitleElement = document.querySelector('.subtitle');
    
    if (!titleElement) return;
    
    // Store original text
    const originalText = titleElement.textContent;
    const titleContainer = titleElement.parentElement;
    
    // Add enhanced classes to container
    titleContainer.classList.add('title-container', 'title-3d');
    
    // Create morphing background
    const morphBg = document.createElement('div');
    morphBg.className = 'morphing-bg';
    morphBg.innerHTML = '<div class="morph-shape"></div>';
    titleContainer.appendChild(morphBg);
    
    // Split title into individual letters for animation
    const letters = originalText.split('');
    titleElement.innerHTML = '';
    titleElement.className = 'patricia-title gradient-text';
    
    letters.forEach((letter, index) => {
        const wrapper = document.createElement('span');
        wrapper.className = 'letter-wrapper';
        wrapper.style.setProperty('--letter-index', index);
        
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        span.className = 'letter';
        
        wrapper.appendChild(span);
        titleElement.appendChild(wrapper);
    });
    
    // Add particle effects container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'title-particles';
    
    // Create particles for burst effect
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
        particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 200}px`);
        particle.style.left = '50%';
        particle.style.top = '50%';
        particleContainer.appendChild(particle);
    }
    
    titleContainer.appendChild(particleContainer);
    
    // Create matrix rain effect
    const matrixBg = document.createElement('div');
    matrixBg.className = 'matrix-bg';
    
    for (let i = 0; i < 10; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.setProperty('--column-index', i);
        column.style.left = `${i * 10}%`;
        column.textContent = generateMatrixText();
        matrixBg.appendChild(column);
    }
    
    titleContainer.insertBefore(matrixBg, titleContainer.firstChild);
    
    // Enhance subtitle
    if (subtitleElement) {
        subtitleElement.classList.add('enhanced-subtitle');
        
        // Create typewriter effect for subtitle
        const subtitleText = subtitleElement.innerHTML;
        subtitleElement.innerHTML = '';
        subtitleElement.classList.add('typewriter-subtitle');
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < subtitleText.length) {
                if (subtitleText[charIndex] === '<') {
                    // Handle HTML tags
                    const tagEnd = subtitleText.indexOf('>', charIndex);
                    subtitleElement.innerHTML += subtitleText.substring(charIndex, tagEnd + 1);
                    charIndex = tagEnd + 1;
                } else {
                    subtitleElement.innerHTML += subtitleText[charIndex];
                    charIndex++;
                }
            } else {
                clearInterval(typeInterval);
                subtitleElement.classList.remove('typewriter-subtitle');
            }
        }, 30);
    }
    
    // Add glitch effect on click
    titleElement.addEventListener('click', function() {
        this.classList.add('glitch-title');
        this.setAttribute('data-text', originalText);
        
        setTimeout(() => {
            this.classList.remove('glitch-title');
        }, 1000);
    });
    
    // Add neon effect on double click
    titleElement.addEventListener('dblclick', function() {
        this.classList.toggle('neon-title');
        this.classList.toggle('gradient-text');
    });
    
    // Cycle through different text effects
    const effects = ['gradient-text', 'holographic-title', 'neon-title'];
    let currentEffect = 0;
    
    // Change effect every 10 seconds
    setInterval(() => {
        titleElement.classList.remove(...effects);
        currentEffect = (currentEffect + 1) % effects.length;
        titleElement.classList.add(effects[currentEffect]);
    }, 10000);
    
    // Interactive hover effects
    titleElement.addEventListener('mouseenter', function() {
        // Trigger particle burst
        const particles = particleContainer.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            particle.style.animation = 'none';
            setTimeout(() => {
                particle.style.animation = `particle-burst 1s ease-out forwards`;
            }, index * 20);
        });
    });
    
    // Add floating animation to individual letters on hover
    const letterWrappers = titleElement.querySelectorAll('.letter-wrapper');
    letterWrappers.forEach((wrapper, index) => {
        wrapper.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            void this.offsetWidth; // Trigger reflow
            this.style.animation = `letter-float 2s ease-in-out`;
        });
    });
    
    // Dynamic color shift based on mouse position
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const hue1 = Math.floor(x * 360);
        const hue2 = Math.floor(y * 360);
        
        morphBg.style.filter = `hue-rotate(${hue1}deg)`;
        
        // Update CSS variables for dynamic colors
        document.documentElement.style.setProperty('--dynamic-hue-1', hue1);
        document.documentElement.style.setProperty('--dynamic-hue-2', hue2);
    });
}

// Generate random matrix-style text
function generateMatrixText() {
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    let text = '';
    for (let i = 0; i < 20; i++) {
        text += chars[Math.floor(Math.random() * chars.length)] + '\n';
    }
    return text;
}

// Add parallax effect on scroll
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const titleContainer = document.querySelector('.title-container');
    
    if (titleContainer) {
        const morphBg = titleContainer.querySelector('.morphing-bg');
        const matrixBg = titleContainer.querySelector('.matrix-bg');
        
        if (morphBg) {
            morphBg.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.5}px))`;
        }
        
        if (matrixBg) {
            matrixBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        // Parallax for individual letters
        const letters = titleContainer.querySelectorAll('.letter-wrapper');
        letters.forEach((letter, index) => {
            const speed = 0.1 + (index * 0.02);
            letter.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

// Easter egg: Konami code activates rainbow mode
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiPattern)) {
        activateRainbowMode();
    }
});

function activateRainbowMode() {
    const title = document.querySelector('.patricia-title');
    if (title) {
        title.classList.add('holographic-title');
        document.body.style.animation = 'rainbow-bg 5s linear infinite';
        
        // Add celebration confetti
        if (window.confetti) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
    }
}

// Add CSS animation for rainbow background
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow-bg {
        0% { background-color: hsl(0, 100%, 95%); }
        16% { background-color: hsl(60, 100%, 95%); }
        33% { background-color: hsl(120, 100%, 95%); }
        50% { background-color: hsl(180, 100%, 95%); }
        66% { background-color: hsl(240, 100%, 95%); }
        83% { background-color: hsl(300, 100%, 95%); }
        100% { background-color: hsl(360, 100%, 95%); }
    }
`;
document.head.appendChild(style);