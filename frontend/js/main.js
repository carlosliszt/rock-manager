// Main Application Controller
class MainApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.managers = {};
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadDashboardData();
        
        // Initialize managers
        this.initializeManagers();
    }

    setupNavigation() {
        // Handle navigation clicks
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.showSection(e.state.section, false);
            }
        });

        // Set initial state
        const hash = window.location.hash.substring(1);
        if (hash && ['dashboard', 'bands', 'shows', 'participations'].includes(hash)) {
            this.showSection(hash, false);
        }
    }

    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + 1-4 for quick navigation
            if (e.altKey && !e.ctrlKey && !e.shiftKey) {
                switch(e.code) {
                    case 'Digit1':
                        e.preventDefault();
                        this.showSection('dashboard');
                        break;
                    case 'Digit2':
                        e.preventDefault();
                        this.showSection('bands');
                        break;
                    case 'Digit3':
                        e.preventDefault();
                        this.showSection('shows');
                        break;
                    case 'Digit4':
                        e.preventDefault();
                        this.showSection('participations');
                        break;
                }
            }
        });

        // Handle responsive navigation toggle
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            // Close mobile menu when clicking a nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                });
            });
        }
    }

    initializeManagers() {
        // Initialize managers when their sections are first accessed
        document.addEventListener('DOMContentLoaded', () => {
            // Dashboard is shown by default, so initialize all managers
            setTimeout(() => {
                if (document.getElementById('bands-section')) {
                    this.managers.bands = new BandsManager();
                }
                if (document.getElementById('shows-section')) {
                    this.managers.shows = new ShowsManager();
                }
                if (document.getElementById('participations-section')) {
                    this.managers.participations = new ParticipationsManager();
                }
            }, 100);
        });
    }

    showSection(sectionName, updateHistory = true) {
        // Validate section name
        const validSections = ['dashboard', 'bands', 'shows', 'participations'];
        if (!validSections.includes(sectionName)) {
            console.warn('Invalid section:', sectionName);
            return;
        }

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('d-none');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('d-none');
            
            // Add animation class
            targetSection.classList.add('fade-in');
            setTimeout(() => {
                targetSection.classList.remove('fade-in');
            }, 500);
        }

        // Update navigation active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update current section
        this.currentSection = sectionName;

        // Update URL and browser history
        if (updateHistory) {
            const url = `${window.location.pathname}#${sectionName}`;
            history.pushState({ section: sectionName }, '', url);
        }

        // Load section-specific data if needed
        this.onSectionChange(sectionName);
    }

    onSectionChange(sectionName) {
        switch(sectionName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'bands':
                if (this.managers.bands) {
                    this.managers.bands.loadBands();
                }
                break;
            case 'shows':
                if (this.managers.shows) {
                    this.managers.shows.loadShows();
                }
                break;
            case 'participations':
                if (this.managers.participations) {
                    this.managers.participations.loadData();
                }
                break;
        }
    }

    async loadDashboardData() {
        try {
            // Load all data for dashboard statistics
            const [bandsResponse, showsResponse, participationsResponse] = await Promise.all([
                API.getBands(),
                API.getShows(),
                API.getParticipations()
            ]);

            // Update dashboard statistics
            this.updateDashboardStats({
                bands: bandsResponse.success ? bandsResponse.data.bandas?.length || 0 : 0,
                shows: showsResponse.success ? showsResponse.data.shows?.length || 0 : 0,
                participations: participationsResponse.success ? participationsResponse.data.participacoes?.length || 0 : 0
            });

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Show default values
            this.updateDashboardStats({ bands: 0, shows: 0, participations: 0 });
        }
    }

    updateDashboardStats(stats) {
        // Update total counts with animation
        this.animateCounter('total-bands', stats.bands);
        this.animateCounter('total-shows', stats.shows);
        this.animateCounter('total-participations', stats.participations);
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = parseInt(element.textContent) || 0;
        const duration = 1000; // 1 second
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);
            element.textContent = currentValue.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Utility methods for global use
    showLoading(show = true) {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            if (show) {
                spinner.classList.remove('d-none');
            } else {
                spinner.classList.add('d-none');
            }
        }
    }

    showToast(title, message, type = 'info') {
        const toastEl = document.getElementById('liveToast');
        const toastTitle = document.getElementById('toast-title');
        const toastMessage = document.getElementById('toast-message');
        
        if (!toastEl || !toastTitle || !toastMessage) {
            console.warn('Toast elements not found');
            return;
        }
        
        // Set toast content
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        // Remove existing background classes and add new one
        toastEl.className = 'toast';
        if (type === 'success') {
            toastEl.classList.add('bg-success', 'text-white');
        } else if (type === 'danger' || type === 'error') {
            toastEl.classList.add('bg-danger', 'text-white');
        } else if (type === 'warning') {
            toastEl.classList.add('bg-warning', 'text-dark');
        } else {
            toastEl.classList.add('bg-info', 'text-white');
        }
        
        // Show toast
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }

    // Check user permissions and show appropriate UI elements
    checkPermissions() {
        const userRole = Auth.getUserRole();
        
        // Hide/show elements based on permissions
        document.querySelectorAll('[data-role]').forEach(element => {
            const requiredRoles = element.getAttribute('data-role').split(',');
            if (!requiredRoles.includes(userRole) && userRole !== 'admin') {
                element.style.display = 'none';
            }
        });
    }

    // Initialize accessibility features
    initializeAccessibility() {
        // Add ARIA labels and descriptions
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label') && button.title) {
                button.setAttribute('aria-label', button.title);
            }
        });

        // Ensure keyboard navigation works
        document.querySelectorAll('[onclick]').forEach(element => {
            if (!element.getAttribute('tabindex') && element.tagName !== 'BUTTON') {
                element.setAttribute('tabindex', '0');
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        element.click();
                    }
                });
            }
        });

        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible:focus {
                outline: 2px solid #007bff !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Error handling
    handleGlobalError(error) {
        console.error('Global error:', error);
        this.showToast('Erro', 'Ocorreu um erro inesperado. Tente novamente.', 'danger');
    }
}

// Global helper functions
function showSection(sectionName) {
    if (window.mainApp) {
        window.mainApp.showSection(sectionName);
    }
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Uncaught error:', e.error);
    if (window.mainApp) {
        window.mainApp.handleGlobalError(e.error);
    }
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    if (window.mainApp) {
        window.mainApp.handleGlobalError(e.reason);
    }
    e.preventDefault();
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on main pages (not login)
    if (!window.location.pathname.includes('login.html')) {
        window.mainApp = new MainApp();
        
        // Initialize accessibility features
        window.mainApp.initializeAccessibility();
        
        // Check permissions
        window.mainApp.checkPermissions();
        
        // Add service worker for offline support (optional)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => {
                console.log('Service worker registration failed:', err);
            });
        }
    }
});

// Handle page visibility changes (pause/resume functionality)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause timers/requests
        console.log('Page hidden');
    } else {
        // Page is visible again, resume functionality
        console.log('Page visible');
        if (window.mainApp) {
            // Refresh current section data
            window.mainApp.onSectionChange(window.mainApp.currentSection);
        }
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    if (window.mainApp) {
        window.mainApp.showToast('Conexão', 'Conexão com a internet restaurada', 'success');
    }
});

window.addEventListener('offline', function() {
    if (window.mainApp) {
        window.mainApp.showToast('Conexão', 'Você está offline', 'warning');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainApp;
}