class Auth {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = Utils.safeJsonParse(localStorage.getItem('user'));
        this.init();
    }

    init() {
        this.updateUI();
        this.bindEvents();
    }

    updateUI() {
        const userMenu = document.getElementById('userMenu');
        const loginMenu = document.getElementById('loginMenu');
        const usernameSpan = document.getElementById('username');
        const adminPanelMenu = document.getElementById('adminPanelMenu');
        const adminPanelMenuMain = document.getElementById('adminPanelMenuMain');

        if (this.isAuthenticated()) {
            if (userMenu) userMenu.style.display = 'block';
            if (loginMenu) loginMenu.style.display = 'none';
            if (usernameSpan && this.user) {
                usernameSpan.textContent = this.user.username || this.user.email || 'Usuário';
            }

            // Show admin panel menu for admins
            if (this.hasRole('admin')) {
                if (adminPanelMenu) adminPanelMenu.style.display = 'block';
                if (adminPanelMenuMain) adminPanelMenuMain.style.display = 'block';
            }
        } else {
            if (userMenu) userMenu.style.display = 'none';
            if (loginMenu) loginMenu.style.display = 'block';
            if (adminPanelMenu) adminPanelMenu.style.display = 'none';
            if (adminPanelMenuMain) adminPanelMenuMain.style.display = 'none';
        }
    }

    bindEvents() {
        this.checkTokenExpiration();

        setInterval(() => {
            this.checkTokenExpiration();
        }, 60000); // verificando a cada 60 segundos
    }

    isAuthenticated() {
        return this.token && this.user;
    }

    hasRole(role) {
        return this.isAuthenticated() && this.user.role === role;
    }

    canPerform(action, entityType = null) {
        if (!this.isAuthenticated()) return false;

        const userRole = this.user.role;

        switch (action) {
            case 'create':
                if (entityType === 'band') {
                    return userRole === 'admin' || userRole === 'musician';
                }
                if (entityType === 'show') {
                    return userRole === 'admin' || userRole === 'organizador';
                }
                if (entityType === 'participation') {
                    return userRole === 'admin' || userRole === 'musician' || userRole === 'organizador';
                }
                if (entityType === "band_member") {
                    return userRole === 'admin' || userRole === 'musician';
                }
                break;

            case 'edit':
            case 'delete':
                return userRole === 'admin' || userRole === 'musician' || userRole === 'organizador';

            default:
                return true; // visualização é normalmente permitida
        }

        return false;
    }

    async login(email, password) {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        email: email,
                        senha: password
                    }
                )
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.data.token;
                this.user = data.data.usuario;

                localStorage.setItem('authToken', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                showToast('Login realizado com sucesso!', 'success');

                this.updateUI();

                return { success: true };
            } else {
                throw new Error(data.message || 'Erro no login');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast(error.message || 'Erro ao fazer login', 'error');
            return { success: false, error: error.message };
        }
    }

    async register(userData) {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: userData
                })
            });

            const data = await response.json();

            if (data.success) {
                showToast('Registro realizado com sucesso! Faça login para continuar.', 'success');
                return { success: true };
            } else {
                throw new Error(data.message || 'Erro no registro');
            }
        } catch (error) {
            console.error('Register error:', error);
            showToast(error.message || 'Erro ao registrar usuário', 'error');
            return { success: false, error: error.message };
        }
    }

    logout(reason = "user_initiated") {
        this.token = null;
        this.user = null;

        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        this.updateUI();
        switch(reason) {
            case "user_initiated":
                showToast('Logout realizado com sucesso!', 'info');
                break;
            case "token_expired":
                showToast('Sua sessão expirou. Por favor, faça login novamente.', 'warning');
                break;
            default:
                showToast('Você saiu.', 'info');
        }

        if (window.location.pathname.includes('pages/') &&
            !window.location.pathname.includes('login.html') &&
            !window.location.pathname.includes('docs.html')) {
            window.location.href = '../index.html';
        }
    }

    checkTokenExpiration() {
        if (!this.token) return;

        try {
            // payload eeee
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);

            if (payload.exp && payload.exp < currentTime) {
                this.logout("token_expired");
            }
        } catch (error) {
            console.error('Error checking token expiration:', error);
            this.logout("token_expired");
        }
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }
}

const auth = new Auth();

function logout() {
    auth.logout();
}

function showToast(message, type = 'info', duration = null) {
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    let bgClass, iconClass, toastDuration;
    switch (type) {
        case 'success':
            bgClass = 'bg-success';
            iconClass = 'bi-check-circle';
            toastDuration = duration || API_CONFIG.TOAST.SUCCESS_DURATION;
            break;
        case 'error':
            bgClass = 'bg-danger';
            iconClass = 'bi-exclamation-circle';
            toastDuration = duration || API_CONFIG.TOAST.ERROR_DURATION;
            break;
        case 'warning':
            bgClass = 'bg-warning';
            iconClass = 'bi-exclamation-triangle';
            toastDuration = duration || API_CONFIG.TOAST.WARNING_DURATION;
            break;
        default:
            bgClass = 'bg-indigo';
            iconClass = 'bi-info-circle';
            toastDuration = duration || API_CONFIG.TOAST.INFO_DURATION;
    }

    const toastId = Utils.generateId();
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${bgClass} text-white">
                <i class="bi ${iconClass} me-2"></i>
                <strong class="me-auto">${Utils.capitalize(type)}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);

    const toastElement = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastElement, {
        delay: toastDuration
    });
    bsToast.show();

    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}