// Validation script for P.A.T.R.I.C.I.A visual interactions
console.log('🔍 Validating P.A.T.R.I.C.I.A Visual Interactions...\n');

// Check if jQuery is loaded
if (typeof $ === 'undefined') {
    console.error('❌ jQuery is not loaded');
} else {
    console.log('✅ jQuery loaded');
}

// Check if visual-interactions.js is loaded
if (typeof initParticleConstellation === 'function') {
    console.log('✅ Particle constellation initialized');
} else {
    console.warn('⚠️  Particle constellation not found');
}

// Check theme switcher
if (document.querySelector('.theme-toggle')) {
    console.log('✅ Theme switcher found');
} else {
    console.warn('⚠️  Theme switcher not found');
}

// Check for glassmorphism elements
const glassElements = document.querySelectorAll('.question-card, .mode-option');
if (glassElements.length > 0) {
    console.log(`✅ ${glassElements.length} glassmorphism elements found`);
} else {
    console.warn('⚠️  No glassmorphism elements found');
}

// Check for floating orbs
const orbs = document.querySelectorAll('.orb');
if (orbs.length > 0) {
    console.log(`✅ ${orbs.length} floating orbs found`);
} else {
    console.warn('⚠️  No floating orbs found');
}

// Check for magnetic buttons
const magneticBtns = document.querySelectorAll('.magnetic-btn');
if (magneticBtns.length > 0) {
    console.log(`✅ ${magneticBtns.length} magnetic buttons found`);
    // Test magnetic effect
    magneticBtns.forEach(btn => {
        const hasListener = btn.onmousemove !== null;
        if (!hasListener) {
            console.warn(`⚠️  Magnetic button missing event listener: ${btn.textContent}`);
        }
    });
} else {
    console.warn('⚠️  No magnetic buttons found');
}

// Check for emoji 3D rotation
const emojis = document.querySelectorAll('.emoji-option');
if (emojis.length > 0) {
    console.log(`✅ ${emojis.length} emoji options found`);
} else {
    console.warn('⚠️  No emoji options found');
}

// Check CSS animations
const testElement = document.createElement('div');
testElement.className = 'orb';
document.body.appendChild(testElement);
const computedStyle = window.getComputedStyle(testElement);
const hasAnimation = computedStyle.animationName !== 'none';
document.body.removeChild(testElement);

if (hasAnimation) {
    console.log('✅ CSS animations are working');
} else {
    console.warn('⚠️  CSS animations may not be working');
}

// Check for canvas element (particle background)
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    console.log('✅ Particle canvas found');
    const ctx = canvas.getContext('2d');
    if (ctx) {
        console.log('✅ Canvas context available');
    }
} else {
    console.warn('⚠️  Particle canvas not found');
}

// Check responsive meta tag
const viewport = document.querySelector('meta[name="viewport"]');
if (viewport && viewport.content.includes('width=device-width')) {
    console.log('✅ Mobile viewport configured');
} else {
    console.warn('⚠️  Mobile viewport may not be properly configured');
}

// Summary
console.log('\n📊 Validation Complete!');
console.log('Check the warnings above for any issues that need attention.');