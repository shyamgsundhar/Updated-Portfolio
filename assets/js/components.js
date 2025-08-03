// ===== COMPONENT-SPECIFIC JAVASCRIPT =====

// ===== SKILL PROGRESS BARS =====
class SkillProgressManager {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.animatedBars = new Set();
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.addHoverEffects();
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedBars.has(entry.target)) {
                    this.animateSkillBar(entry.target);
                    this.animatedBars.add(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.skillBars.forEach(bar => observer.observe(bar));
    }
    
    animateSkillBar(bar) {
        const progress = parseInt(bar.getAttribute('data-progress'));
        let current = 0;
        const increment = progress / 60; // 60 frames for smooth animation
        
        const animate = () => {
            current += increment;
            if (current >= progress) {
                bar.style.width = progress + '%';
                this.addProgressText(bar, progress);
            } else {
                bar.style.width = current + '%';
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    addProgressText(bar, progress) {
        const progressText = document.createElement('span');
        progressText.className = 'progress-text';
        progressText.textContent = progress + '%';
        progressText.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: white;
            font-size: 12px;
            font-weight: 600;
            opacity: 0;
            animation: fadeIn 0.5s ease 0.5s forwards;
        `;
        
        bar.style.position = 'relative';
        bar.appendChild(progressText);
    }
    
    addHoverEffects() {
        this.skillBars.forEach(bar => {
            const skillItem = bar.closest('.skill-item');
            
            skillItem.addEventListener('mouseenter', () => {
                bar.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.5)';
                bar.style.transform = 'scaleY(1.2)';
            });
            
            skillItem.addEventListener('mouseleave', () => {
                bar.style.boxShadow = '';
                bar.style.transform = '';
            });
        });
    }
}

// ===== PROJECT CARD INTERACTIONS =====
class ProjectCardManager {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }
    
    init() {
        this.addHoverEffects();
        this.addClickEffects();
        this.setupFilterSystem();
    }
    
    addHoverEffects() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.onCardHover(e.target);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.onCardLeave(e.target);
            });
        });
    }
    
    onCardHover(card) {
        // Add glow effect
        card.style.boxShadow = '0 20px 40px rgba(33, 150, 243, 0.3)';
        
        // Scale tech tags
        const techTags = card.querySelectorAll('.tech-tag');
        techTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'scale(1.05)';
            }, index * 50);
        });
        
        // Animate project image
        const projectImage = card.querySelector('.project-image');
        if (projectImage) {
            projectImage.style.transform = 'scale(1.05)';
        }
    }
    
    onCardLeave(card) {
        card.style.boxShadow = '';
        
        const techTags = card.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            tag.style.transform = '';
        });
        
        const projectImage = card.querySelector('.project-image');
        if (projectImage) {
            projectImage.style.transform = '';
        }
    }
    
    addClickEffects() {
        this.cards.forEach(card => {
            // Only add click effects for project links, not modal creation
            const projectLinks = card.querySelectorAll('.project-link');
            projectLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    // Allow normal link behavior
                    e.stopPropagation();
                });
            });
            
            // Remove any modal creation click handlers
            card.addEventListener('click', (e) => {
                // Prevent modal creation
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        });
    }
    
    showProjectDetails(card) {
        // Disable modal creation to prevent unwanted elements
        return false;
    }
    
    setupFilterSystem() {
        // Create filter buttons
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="mobile">Mobile</button>
            <button class="filter-btn" data-filter="ai">AI/ML</button>
            <button class="filter-btn" data-filter="iot">IoT</button>
            <button class="filter-btn" data-filter="web">Web</button>
        `;
        
        const projectsSection = document.querySelector('.projects-grid');
        if (projectsSection) {
            projectsSection.parentNode.insertBefore(filterContainer, projectsSection);
            
            // Add filter functionality
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    this.filterProjects(e.target.dataset.filter);
                    
                    // Update active button
                    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    e.target.classList.add('active');
                }
            });
        }
    }
    
    filterProjects(filter) {
        this.cards.forEach(card => {
            const categories = card.querySelector('.project-category').textContent.toLowerCase();
            
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ===== TIMELINE INTERACTIONS =====
class TimelineManager {
    constructor() {
        this.timelineItems = document.querySelectorAll('.timeline-item, .experience-item');
        this.init();
    }
    
    init() {
        this.addScrollAnimations();
        this.addHoverEffects();
    }
    
    addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.3 });
        
        this.timelineItems.forEach(item => {
            observer.observe(item);
        });
    }
    
    addHoverEffects() {
        this.timelineItems.forEach(item => {
            // Prevent any click handlers that might create modals
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            
            item.addEventListener('mouseenter', () => {
                const marker = item.querySelector('.timeline-marker, .experience-item::after');
                if (marker) {
                    marker.style.transform = 'scale(1.5)';
                    marker.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.5)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const marker = item.querySelector('.timeline-marker, .experience-item::after');
                if (marker) {
                    marker.style.transform = '';
                    marker.style.boxShadow = '';
                }
            });
        });
    }
}

// ===== CONTACT FORM ENHANCEMENTS =====
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.addInputAnimations();
        this.addValidation();
        this.addAutoResize();
    }
    
    addInputAnimations() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            const formGroup = input.parentElement;
            
            input.addEventListener('focus', () => {
                formGroup.classList.add('focused');
                input.style.borderColor = 'var(--primary-color)';
                input.style.boxShadow = '0 0 0 3px rgba(33, 150, 243, 0.1)';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    formGroup.classList.remove('focused');
                }
                input.style.borderColor = '';
                input.style.boxShadow = '';
            });
            
            // Add typing animation
            input.addEventListener('input', () => {
                const label = formGroup.querySelector('label');
                if (input.value.trim()) {
                    label.style.color = 'var(--primary-color)';
                    label.style.fontSize = '14px';
                    label.style.transform = 'translateY(-25px)';
                } else {
                    label.style.color = '';
                    label.style.fontSize = '';
                    label.style.transform = '';
                }
            });
        });
    }
    
    addValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                this.submitForm();
            }
        });
    }
    
    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const formGroup = input.parentElement;
        
        // Remove existing error
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        let isValid = true;
        let errorMessage = '';
        
        // Validation rules
        if (input.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (input.name === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long';
        }
        
        if (!isValid) {
            input.style.borderColor = '#ff6b6b';
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            errorElement.style.cssText = `
                color: #ff6b6b;
                font-size: 12px;
                margin-top: 5px;
                display: block;
                animation: fadeIn 0.3s ease;
            `;
            formGroup.appendChild(errorElement);
        } else {
            input.style.borderColor = '#4caf50';
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    addAutoResize() {
        const textarea = this.form.querySelector('textarea');
        if (textarea) {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        }
    }
    
    submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Show success animation
            this.showSuccessMessage();
            
            // Reset form
            this.form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Reset input states
            this.form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('focused');
                const label = group.querySelector('label');
                if (label) {
                    label.style.color = '';
                    label.style.fontSize = '';
                    label.style.transform = '';
                }
            });
        }, 2000);
    }
    
    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h4>Message Sent Successfully!</h4>
                <p>Thank you for your message. I'll get back to you soon.</p>
            </div>
        `;
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-card);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: var(--shadow-2xl);
            z-index: 1000;
            text-align: center;
            animation: scaleIn 0.5s ease;
        `;
        
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }
}

// ===== ACHIEVEMENT CARDS ANIMATION =====
class AchievementManager {
    constructor() {
        this.cards = document.querySelectorAll('.achievement-card');
        this.init();
    }
    
    init() {
        this.addHoverEffects();
        this.addScrollAnimations();
    }
    
    addHoverEffects() {
        this.cards.forEach(card => {
            // Remove any click handlers that might create modals
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.achievement-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.boxShadow = '0 10px 30px rgba(33, 150, 243, 0.4)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.achievement-icon');
                if (icon) {
                    icon.style.transform = '';
                    icon.style.boxShadow = '';
                }
            });
        });
    }
    
    addScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'scaleIn 0.6s ease forwards';
                }
            });
        }, { threshold: 0.3 });
        
        this.cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }
}

// ===== NAVIGATION ENHANCEMENTS =====
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }
    
    init() {
        this.addScrollSpy();
        this.addSmoothScrolling();
        this.addProgressBar();
    }
    
    addScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveNavLink(id);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-20% 0px -60% 0px'
        });
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    updateActiveNavLink(activeId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }
    
    addSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Add visual feedback
                    link.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        link.style.transform = '';
                    }, 200);
                }
            });
        });
    }
    
    addProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--gradient-primary);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }
}

// ===== MOBILE DETECTION & ALERT =====
// Mobile Detection and Alert
function detectMobileAndAlert() {
  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /iPad|Android.*(?!.*Mobile)/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 768;
  
  // Check if user has already dismissed the alert (using localStorage)
  const alertDismissed = localStorage.getItem('mobileAlertDismissed');
  
  if ((isMobile || isTablet || isSmallScreen) && !alertDismissed) {
    showMobileAlert();
  }
}

function showMobileAlert() {
  // Create custom alert overlay
  const alertOverlay = document.createElement('div');
  alertOverlay.className = 'mobile-alert-overlay';
  
  alertOverlay.innerHTML = `
    <div class="mobile-alert-container">
      <div class="mobile-alert-content">
        <div class="alert-icon">
          <i class="fas fa-desktop"></i>
        </div>
        <h3>Better Experience on Desktop</h3>
        <p>This portfolio is optimized for desktop viewing. For the best experience with animations, interactions, and full feature access, please visit on a desktop or laptop.</p>
        <div class="alert-actions">
          <button class="alert-btn primary" onclick="dismissMobileAlert(true)">
            <i class="fas fa-check"></i>
            Continue Anyway
          </button>
          <button class="alert-btn secondary" onclick="dismissMobileAlert(false)">
            <i class="fas fa-times"></i>
            Remind Me Later
          </button>
        </div>
        <div class="alert-features">
          <div class="feature-item">
            <i class="fas fa-magic"></i>
            <span>Enhanced Animations</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-expand-arrows-alt"></i>
            <span>Full Screen Experience</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-mouse-pointer"></i>
            <span>Interactive Elements</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(alertOverlay);
  
  // Add animation
  setTimeout(() => {
    alertOverlay.classList.add('show');
  }, 100);
}

function dismissMobileAlert(remember = false) {
  const alertOverlay = document.querySelector('.mobile-alert-overlay');
  
  if (alertOverlay) {
    alertOverlay.classList.add('hide');
    
    setTimeout(() => {
      alertOverlay.remove();
    }, 300);
  }
  
  // Remember user's choice if they clicked "Continue Anyway"
  if (remember) {
    localStorage.setItem('mobileAlertDismissed', 'true');
  }
}

// Initialize mobile detection when page loads
document.addEventListener('DOMContentLoaded', detectMobileAndAlert);

// Re-check on window resize
window.addEventListener('resize', () => {
  const alertDismissed = localStorage.getItem('mobileAlertDismissed');
  if (!alertDismissed && window.innerWidth <= 768) {
    // Small delay to avoid multiple alerts on rapid resize
    setTimeout(detectMobileAndAlert, 500);
  }
});

// ===== INITIALIZE ALL COMPONENTS =====
document.addEventListener('DOMContentLoaded', () => {
    new SkillProgressManager();
    new ProjectCardManager();
    new TimelineManager();
    new ContactFormManager();
    new AchievementManager();
    new NavigationManager();
});

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SkillProgressManager,
        ProjectCardManager,
        TimelineManager,
        ContactFormManager,
        AchievementManager,
        NavigationManager
    };
}
