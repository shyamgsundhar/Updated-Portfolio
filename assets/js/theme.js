/**
 * Theme Toggle Functionality
 * Handles switching between light and dark modes
 */

class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.body = document.body;
        this.currentTheme = this.getStoredTheme() || 'dark';
        
        this.init();
    }

    init() {
        // Set initial theme
        this.applyTheme(this.currentTheme);
        
        // Bind event listeners
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Update icon
        this.updateThemeIcon();
    }

    getStoredTheme() {
        return localStorage.getItem('portfolio-theme');
    }

    storeTheme(theme) {
        localStorage.setItem('portfolio-theme', theme);
    }

    applyTheme(theme) {
        if (theme === 'light') {
            this.body.classList.add('light-theme');
        } else {
            this.body.classList.remove('light-theme');
        }
        this.currentTheme = theme;
        this.storeTheme(theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.updateThemeIcon();
        
        // Add a subtle animation to the toggle button
        this.animateToggle();
    }

    updateThemeIcon() {
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            if (icon) {
                if (this.currentTheme === 'dark') {
                    icon.className = 'fas fa-sun';
                } else {
                    icon.className = 'fas fa-moon';
                }
            }
        }
    }

    animateToggle() {
        if (this.themeToggle) {
            this.themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.themeToggle.style.transform = 'scale(1)';
            }, 150);
        }
    }

    // Detect system theme preference
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Listen for system theme changes
    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                    this.updateThemeIcon();
                }
            });
        }
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
