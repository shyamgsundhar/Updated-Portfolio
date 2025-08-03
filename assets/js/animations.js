// ===== ADVANCED ANIMATIONS =====

// GSAP-like animation utilities without requiring external library
class AnimationEngine {
    constructor() {
        this.animations = new Map();
        this.rafId = null;
        this.isRunning = false;
    }
    
    // Main animation method
    animate(element, properties, options = {}) {
        const {
            duration = 1000,
            delay = 0,
            easing = 'ease-out',
            onComplete = null,
            onUpdate = null
        } = options;
        
        const startTime = performance.now() + delay;
        const animationId = Math.random().toString(36).substr(2, 9);
        
        const animation = {
            element,
            properties,
            duration,
            startTime,
            easing,
            onComplete,
            onUpdate,
            startValues: {},
            isActive: false
        };
        
        // Store initial values
        Object.keys(properties).forEach(prop => {
            animation.startValues[prop] = this.getPropertyValue(element, prop);
        });
        
        this.animations.set(animationId, animation);
        this.startAnimationLoop();
        
        return animationId;
    }
    
    // Easing functions
    getEasingValue(t, type) {
        switch (type) {
            case 'ease-in':
                return t * t;
            case 'ease-out':
                return 1 - (1 - t) * (1 - t);
            case 'ease-in-out':
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            case 'bounce':
                const n1 = 7.5625;
                const d1 = 2.75;
                if (t < 1 / d1) {
                    return n1 * t * t;
                } else if (t < 2 / d1) {
                    return n1 * (t -= 1.5 / d1) * t + 0.75;
                } else if (t < 2.5 / d1) {
                    return n1 * (t -= 2.25 / d1) * t + 0.9375;
                } else {
                    return n1 * (t -= 2.625 / d1) * t + 0.984375;
                }
            case 'elastic':
                const c4 = (2 * Math.PI) / 3;
                return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
            default: // 'linear'
                return t;
        }
    }
    
    // Get current property value
    getPropertyValue(element, property) {
        switch (property) {
            case 'x':
            case 'translateX':
                return this.getTransformValue(element, 'translateX');
            case 'y':
            case 'translateY':
                return this.getTransformValue(element, 'translateY');
            case 'scale':
                return this.getTransformValue(element, 'scale') || 1;
            case 'opacity':
                return parseFloat(getComputedStyle(element).opacity) || 1;
            case 'rotation':
                return this.getTransformValue(element, 'rotate') || 0;
            default:
                return parseFloat(getComputedStyle(element)[property]) || 0;
        }
    }
    
    // Extract transform values
    getTransformValue(element, type) {
        const transform = getComputedStyle(element).transform;
        if (transform === 'none') return 0;
        
        const matrix = transform.match(/matrix.*\((.+)\)/);
        if (!matrix) return 0;
        
        const values = matrix[1].split(', ').map(parseFloat);
        
        switch (type) {
            case 'translateX':
                return values[4] || 0;
            case 'translateY':
                return values[5] || 0;
            case 'scale':
                return Math.sqrt(values[0] * values[0] + values[1] * values[1]);
            case 'rotate':
                return Math.atan2(values[1], values[0]) * (180 / Math.PI);
            default:
                return 0;
        }
    }
    
    // Set property value
    setPropertyValue(element, property, value) {
        switch (property) {
            case 'x':
            case 'translateX':
                this.setTransform(element, 'translateX', value + 'px');
                break;
            case 'y':
            case 'translateY':
                this.setTransform(element, 'translateY', value + 'px');
                break;
            case 'scale':
                this.setTransform(element, 'scale', value);
                break;
            case 'rotation':
                this.setTransform(element, 'rotate', value + 'deg');
                break;
            case 'opacity':
                element.style.opacity = value;
                break;
            default:
                element.style[property] = value + (typeof value === 'number' ? 'px' : '');
        }
    }
    
    // Handle transform properties
    setTransform(element, type, value) {
        const currentTransform = element.style.transform || '';
        const regex = new RegExp(`${type}\\([^)]*\\)`, 'g');
        const newTransform = `${type}(${value})`;
        
        if (currentTransform.includes(type)) {
            element.style.transform = currentTransform.replace(regex, newTransform);
        } else {
            element.style.transform = currentTransform + ' ' + newTransform;
        }
    }
    
    // Animation loop
    startAnimationLoop() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const loop = (currentTime) => {
            let hasActiveAnimations = false;
            
            this.animations.forEach((animation, id) => {
                if (currentTime >= animation.startTime) {
                    if (!animation.isActive) {
                        animation.isActive = true;
                    }
                    
                    const elapsed = currentTime - animation.startTime;
                    const progress = Math.min(elapsed / animation.duration, 1);
                    const easedProgress = this.getEasingValue(progress, animation.easing);
                    
                    // Update properties
                    Object.keys(animation.properties).forEach(prop => {
                        const startValue = animation.startValues[prop];
                        const endValue = animation.properties[prop];
                        const currentValue = startValue + (endValue - startValue) * easedProgress;
                        
                        this.setPropertyValue(animation.element, prop, currentValue);
                    });
                    
                    // Call update callback
                    if (animation.onUpdate) {
                        animation.onUpdate(easedProgress);
                    }
                    
                    // Check if animation is complete
                    if (progress >= 1) {
                        if (animation.onComplete) {
                            animation.onComplete();
                        }
                        this.animations.delete(id);
                    } else {
                        hasActiveAnimations = true;
                    }
                } else {
                    hasActiveAnimations = true;
                }
            });
            
            if (hasActiveAnimations) {
                this.rafId = requestAnimationFrame(loop);
            } else {
                this.isRunning = false;
            }
        };
        
        this.rafId = requestAnimationFrame(loop);
    }
    
    // Stop animation
    stop(animationId) {
        this.animations.delete(animationId);
        if (this.animations.size === 0) {
            this.isRunning = false;
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
        }
    }
    
    // Kill all animations
    killAll() {
        this.animations.clear();
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

// Create global animation instance
const animator = new AnimationEngine();

// ===== SCROLL-TRIGGERED ANIMATIONS =====
class ScrollAnimator {
    constructor() {
        this.elements = [];
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.bindScrollEvents();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '-10% 0px -10% 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target, entry.intersectionRatio);
                }
            });
        }, options);
    }
    
    observe(element, animationType = 'fadeInUp', options = {}) {
        const animationData = {
            element,
            type: animationType,
            options,
            triggered: false
        };
        
        this.elements.push(animationData);
        this.observer.observe(element);
        
        return animationData;
    }
    
    triggerAnimation(element, ratio) {
        const animationData = this.elements.find(data => data.element === element);
        if (!animationData || animationData.triggered) return;
        
        animationData.triggered = true;
        this.executeAnimation(animationData);
    }
    
    executeAnimation(animationData) {
        const { element, type, options } = animationData;
        const delay = options.delay || 0;
        
        switch (type) {
            case 'fadeInUp':
                animator.animate(element, {
                    opacity: 1,
                    y: 0
                }, {
                    duration: 800,
                    delay,
                    easing: 'ease-out'
                });
                break;
                
            case 'fadeInLeft':
                animator.animate(element, {
                    opacity: 1,
                    x: 0
                }, {
                    duration: 800,
                    delay,
                    easing: 'ease-out'
                });
                break;
                
            case 'fadeInRight':
                animator.animate(element, {
                    opacity: 1,
                    x: 0
                }, {
                    duration: 800,
                    delay,
                    easing: 'ease-out'
                });
                break;
                
            case 'scaleIn':
                animator.animate(element, {
                    opacity: 1,
                    scale: 1
                }, {
                    duration: 600,
                    delay,
                    easing: 'bounce'
                });
                break;
                
            case 'slideInUp':
                animator.animate(element, {
                    y: 0,
                    opacity: 1
                }, {
                    duration: 700,
                    delay,
                    easing: 'ease-out'
                });
                break;
        }
    }
    
    bindScrollEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleParallax() {
        const scrollY = window.pageYOffset;
        
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const offset = scrollY * speed;
            
            animator.animate(element, {
                y: -offset
            }, {
                duration: 0,
                easing: 'linear'
            });
        });
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.options = {
            count: options.count || 50,
            size: options.size || 2,
            color: options.color || '#2196F3',
            speed: options.speed || 1,
            direction: options.direction || 'random',
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.options.count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                size: Math.random() * this.options.size + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = this.options.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== MAGNETIC CURSOR EFFECT =====
class MagneticCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'magnetic-cursor';
        document.body.appendChild(this.cursor);
        
        this.cursorInner = document.createElement('div');
        this.cursorInner.className = 'magnetic-cursor-inner';
        this.cursor.appendChild(this.cursorInner);
        
        this.init();
    }
    
    init() {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            this.cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            
            requestAnimationFrame(updateCursor);
        };
        
        updateCursor();
        
        // Add magnetic effect to buttons
        document.querySelectorAll('.btn, .project-card, .social-link').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('magnetic-active');
            });
            
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('magnetic-active');
            });
        });
    }
}

// ===== TEXT REVEAL ANIMATION =====
class TextReveal {
    static splitText(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        const words = text.split(' ');
        
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.style.overflow = 'hidden';
            wordSpan.style.display = 'inline-block';
            
            const letters = word.split('');
            letters.forEach((letter, letterIndex) => {
                const letterSpan = document.createElement('span');
                letterSpan.textContent = letter;
                letterSpan.style.display = 'inline-block';
                letterSpan.style.transform = 'translateY(100%)';
                letterSpan.style.transition = `transform 0.6s ease ${(wordIndex * 0.1 + letterIndex * 0.05)}s`;
                
                wordSpan.appendChild(letterSpan);
            });
            
            element.appendChild(wordSpan);
            
            if (wordIndex < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });
        
        return element;
    }
    
    static reveal(element) {
        const letters = element.querySelectorAll('.word span');
        letters.forEach(letter => {
            letter.style.transform = 'translateY(0)';
        });
    }
}

// ===== FLOATING ELEMENTS =====
class FloatingElements {
    constructor(container, count = 5) {
        this.container = container;
        this.elements = [];
        this.count = count;
        
        this.create();
        this.animate();
    }
    
    create() {
        for (let i = 0; i < this.count; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.position = 'absolute';
            element.style.width = Math.random() * 20 + 10 + 'px';
            element.style.height = element.style.width;
            element.style.borderRadius = '50%';
            element.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
            element.style.opacity = Math.random() * 0.3 + 0.1;
            element.style.left = Math.random() * 100 + '%';
            element.style.top = Math.random() * 100 + '%';
            
            this.container.appendChild(element);
            this.elements.push({
                element,
                x: Math.random() * 100,
                y: Math.random() * 100,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }
    
    animate() {
        this.elements.forEach(item => {
            item.x += item.vx;
            item.y += item.vy;
            
            if (item.x < 0 || item.x > 100) item.vx *= -1;
            if (item.y < 0 || item.y > 100) item.vy *= -1;
            
            item.element.style.left = item.x + '%';
            item.element.style.top = item.y + '%';
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== INITIALIZE ADVANCED ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animator
    const scrollAnimator = new ScrollAnimator();
    
    // Set up initial states and observe elements
    document.querySelectorAll('.scroll-animate').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        scrollAnimator.observe(element, 'fadeInUp');
    });
    
    document.querySelectorAll('.scroll-animate-left').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-50px)';
        scrollAnimator.observe(element, 'fadeInLeft');
    });
    
    document.querySelectorAll('.scroll-animate-right').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        scrollAnimator.observe(element, 'fadeInRight');
    });
    
    document.querySelectorAll('.scroll-animate-scale').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        scrollAnimator.observe(element, 'scaleIn');
    });
    
    // Initialize text reveals
    document.querySelectorAll('.text-reveal').forEach(element => {
        TextReveal.splitText(element);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    TextReveal.reveal(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
    
    // Initialize magnetic cursor (only on desktop)
    if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        new MagneticCursor();
    }
    
    // Initialize floating elements in hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new FloatingElements(heroSection.querySelector('.hero-bg'), 8);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AnimationEngine,
        ScrollAnimator,
        ParticleSystem,
        TextReveal,
        FloatingElements
    };
}
