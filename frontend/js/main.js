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
        
        this.initializeManagers();
    }

    setupNavigation() {
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });

        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                this.showSection(e.state.section, false);
            }
        });
        const hash = window.location.hash.substring(1);
        if (hash && ['dashboard', 'bands', 'shows', 'participations'].includes(hash)) {
            this.showSection(hash, false);
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
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

        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
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
        document.addEventListener('DOMContentLoaded', () => {
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
        const validSections = ['dashboard', 'bands', 'shows', 'participations'];
        if (!validSections.includes(sectionName)) {
            console.warn('Invalid section:', sectionName);
            return;
        }

        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('d-none');
        });

        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('d-none');
            
            targetSection.classList.add('fade-in');
            setTimeout(() => {
                targetSection.classList.remove('fade-in');
            }, 500);
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentSection = sectionName;

        if (updateHistory) {
            const url = `${window.location.pathname}#${sectionName}`;
            history.pushState({ section: sectionName }, '', url);
        }

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
            const [bandsResponse, showsResponse, participationsResponse] = await Promise.all([
                API.getBands(),
                API.getShows(),
                API.getParticipations()
            ]);

            this.updateDashboardStats({
                bands: bandsResponse.success ? bandsResponse.data.bandas?.length || 0 : 0,
                shows: showsResponse.success ? showsResponse.data.shows?.length || 0 : 0,
                participations: participationsResponse.success ? participationsResponse.data.participacoes?.length || 0 : 0
            });

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.updateDashboardStats({ bands: 0, shows: 0, participations: 0 });
        }
    }

    updateDashboardStats(stats) {
        this.animateCounter('total-bands', stats.bands);
        this.animateCounter('total-shows', stats.shows);
        this.animateCounter('total-participations', stats.participations);
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = parseInt(element.textContent) || 0;
        const duration = 1000; // 1 segundo eeee
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
        
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }

    checkPermissions() {
        const userRole = Auth.getUserRole();
        
        document.querySelectorAll('[data-role]').forEach(element => {
            const requiredRoles = element.getAttribute('data-role').split(',');
            if (!requiredRoles.includes(userRole) && userRole !== 'admin') {
                element.style.display = 'none';
            }
        });
    }

    initializeAccessibility() {
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label') && button.title) {
                button.setAttribute('aria-label', button.title);
            }
        });

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

        const style = document.createElement('style');
        style.textContent = `
            .focus-visible:focus {
                outline: 2px solid #007bff !important;
                outline-offset: 2px !important;
            }
        `;
        document.head.appendChild(style);
    }

    handleGlobalError(error) {
        console.error('Global error:', error);
        this.showToast('Erro', 'Ocorreu um erro inesperado. Tente novamente.', 'danger');
    }
}

function showSection(sectionName) {
    if (window.mainApp) {
        window.mainApp.showSection(sectionName);
    }
}

window.addEventListener('error', (e) => {
    console.error('Uncaught error:', e.error);
    if (window.mainApp) {
        window.mainApp.handleGlobalError(e.error);
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    if (window.mainApp) {
        window.mainApp.handleGlobalError(e.reason);
    }
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('login.html')) {
        window.mainApp = new MainApp();
        
        window.mainApp.initializeAccessibility();
        
        window.mainApp.checkPermissions();
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(err => {
                console.log('Service worker registration failed:', err);
            });
        }
    }
});

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
        if (window.mainApp) {
            window.mainApp.onSectionChange(window.mainApp.currentSection);
        }
    }
});

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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainApp;
}