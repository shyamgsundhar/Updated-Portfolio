// ===== MAIN JAVASCRIPT FILE =====

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const loadingScreen = document.getElementById('loading-screen');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoading();
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initMLPipeline();
    initTypingEffect();
    initSmoothScrolling();
    initParallax();
    
    // Performance optimizations
    lazyLoadImages();
    preloadCriticalResources();
    
    // Prevent unwanted modal creation
    preventUnwantedModals();
});

// ===== LOADING SCREEN =====
function initLoading() {
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove loading screen after transition
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
        
        // Start entrance animations
        startEntranceAnimations();
    }, 2000);
}

function startEntranceAnimations() {
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero .animate-on-load');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animate-fade-in-up');
        }, index * 200);
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Active link highlighting
    window.addEventListener('scroll', updateActiveNavLink);
}

function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Special handling for different animation types
                if (entry.target.classList.contains('skill-progress')) {
                    animateSkillBar(entry.target);
                }
                
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale').forEach(el => {
        observer.observe(el);
    });
    
    // Observe skill bars
    document.querySelectorAll('.skill-progress').forEach(el => {
        observer.observe(el);
    });
    
    // Observe stat numbers
    document.querySelectorAll('.stat-number').forEach(el => {
        observer.observe(el);
    });
}

// ===== SKILL BARS ANIMATION =====
function initSkillBars() {
    // Set up skill progress data
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.setProperty('--progress-width', progress + '%');
    });
}

function animateSkillBar(skillBar) {
    const progress = skillBar.getAttribute('data-progress');
    skillBar.style.width = progress + '%';
}

// ===== ML PIPELINE ANIMATION =====
function initMLPipeline() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');
                
                // Animate progress bar
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                }, 500);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// ===== COUNTER ANIMATION =====
function animateCounter(element) {
    const target = parseFloat(element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current * 10) / 10;
        }
    }, 16);
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRight = element.style.borderRight === 'none' 
                        ? '2px solid var(--primary-color)' 
                        : 'none';
                }, 500);
            }
        };
        
        // Start typing effect when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== PARALLAX EFFECTS =====
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== LAZY LOADING =====
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function preloadCriticalResources() {
    // Preload critical CSS
    const criticalCSS = ['main.css', 'animations.css', 'components.css'];
    criticalCSS.forEach(css => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = `assets/css/${css}`;
        document.head.appendChild(link);
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== THEME SWITCHING (FUTURE ENHANCEMENT) =====
function initThemeSwitch() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            // Store preference
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here
});

// ===== RESIZE HANDLER =====
window.addEventListener('resize', debounce(() => {
    // Handle resize events
    updateLayoutOnResize();
}, 250));

function updateLayoutOnResize() {
    // Recalculate any layout-dependent elements
    const mobileBreakpoint = 768;
    const isMobile = window.innerWidth <= mobileBreakpoint;
    
    if (isMobile) {
        // Mobile-specific adjustments
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
        // Close mobile menu if open
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
}

// ===== SCROLL TO TOP =====
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

// Initialize scroll to top when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollToTop);

// ===== PREVENT UNWANTED MODALS =====
function preventUnwantedModals() {
    // Remove click handlers that create modals on project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.style.cursor = 'default';
        card.removeEventListener('click', () => {});
    });
    
    // Remove click handlers on achievement cards
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.style.cursor = 'default';
        card.removeEventListener('click', () => {});
    });
    
    // Remove click handlers on experience items
    document.querySelectorAll('.experience-item').forEach(item => {
        item.style.cursor = 'default';
        item.removeEventListener('click', () => {});
    });
    
    // Prevent any existing modals from showing
    document.querySelectorAll('.project-modal, .modal, .popup').forEach(modal => {
        modal.remove();
    });
    
    // Override modal creation functions
    if (window.showProjectDetails) {
        window.showProjectDetails = function() {
            // Do nothing - disable modal creation
            return false;
        };
    }
}

// ===== CLEAN UP UNWANTED ELEMENTS =====
function cleanUpUnwantedElements() {
    // Remove any floating or unwanted elements
    document.querySelectorAll('.project-modal, .modal, .popup, .floating-modal').forEach(element => {
        element.remove();
    });
    
    // Remove any elements that might be appearing below contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const footer = document.querySelector('.footer');
        if (footer) {
            // Ensure nothing appears between contact and footer
            let nextElement = contactSection.nextElementSibling;
            while (nextElement && nextElement !== footer) {
                const toRemove = nextElement;
                nextElement = nextElement.nextElementSibling;
                if (!toRemove.classList.contains('footer') && !toRemove.tagName.toLowerCase().includes('script')) {
                    toRemove.remove();
                }
            }
        }
    }
}

// Call cleanup function periodically
setInterval(cleanUpUnwantedElements, 1000);

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        debounce,
        throttle
    };
}
