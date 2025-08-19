class LoginPage {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.checkAuthentication();
    }
    
    checkAuthentication() {
        if (auth.isAuthenticated()) {
            window.location.href = '../index.html';
        }
    }
    
    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility('password', 'togglePassword'));
        }
        
        const toggleRegPassword = document.getElementById('toggleRegPassword');
        if (toggleRegPassword) {
            toggleRegPassword.addEventListener('click', () => this.togglePasswordVisibility('regPassword', 'toggleRegPassword'));
        }

        this.setupFormValidation();
    }
    
    async handleLogin(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        
        this.clearFormErrors('login');
        
        if (!this.validateLoginForm(email, password)) {
            return;
        }
        
        this.setLoadingState('loginBtn', true);
        
        try {
            const result = await auth.login(email, password);
            
            if (result.success) {
                window.location.href = '../index.html';
            } else {
                this.showFormError('email', result.error || 'Erro no login');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Erro inesperado durante o login', 'error');
        } finally {
            this.setLoadingState('loginBtn', false);
        }
    }
    
    async handleRegister(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            senha: formData.get('password')
        };
        const passwordConfirm = formData.get('passwordConfirm');
        
        this.clearFormErrors('register');
        
        if (!this.validateRegisterForm(userData, passwordConfirm)) {
            return;
        }
        
        this.setLoadingState('registerBtn', true);
        
        try {
            const result = await auth.register(userData);
            
            if (result.success) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                modal.hide();
                
                form.reset();
                
                showToast('Conta criada com sucesso! Você pode fazer login agora.', 'success');
            } else {
                this.showFormError('regEmail', result.error || 'Erro no registro');
            }
        } catch (error) {
            console.error('Register error:', error);
            showToast('Erro inesperado durante o registro', 'error');
        } finally {
            this.setLoadingState('registerBtn', false);
        }
    }
    
    validateLoginForm(email, password) {
        let isValid = true;
        
        if (!email) {
            this.showFormError('email', 'Email é obrigatório');
            isValid = false;
        } else if (!Utils.isValidEmail(email)) {
            this.showFormError('email', 'Email inválido');
            isValid = false;
        }
        
        if (!password) {
            this.showFormError('password', 'Senha é obrigatória');
            isValid = false;
        }
        
        return isValid;
    }
    
    validateRegisterForm(userData, passwordConfirm) {
        let isValid = true;
        
        if (!userData.username) {
            this.showFormError('regUsername', 'Nome de usuário é obrigatório');
            isValid = false;
        } else if (userData.username.length < 3) {
            this.showFormError('regUsername', 'Nome de usuário deve ter pelo menos 3 caracteres');
            isValid = false;
        }
        
        if (!userData.email) {
            this.showFormError('regEmail', 'Email é obrigatório');
            isValid = false;
        } else if (!Utils.isValidEmail(userData.email)) {
            this.showFormError('regEmail', 'Email inválido');
            isValid = false;
        }
        
        if (!userData.password) {
            this.showFormError('regPassword', 'Senha é obrigatória');
            isValid = false;
        } else if (userData.password.length < API_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
            this.showFormError('regPassword', API_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH_MESSAGE);
            isValid = false;
        }
        
        if (!passwordConfirm) {
            this.showFormError('regPasswordConfirm', 'Confirmação de senha é obrigatória');
            isValid = false;
        } else if (userData.password !== passwordConfirm) {
            this.showFormError('regPasswordConfirm', 'Senhas não coincidem');
            isValid = false;
        }
        
        return isValid;
    }
    
    showFormError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.add('is-invalid');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    clearFormErrors(formType) {
        const prefix = formType === 'register' ? 'reg' : '';
        const fields = formType === 'register' 
            ? ['regUsername', 'regEmail', 'regPassword', 'regPasswordConfirm']
            : ['email', 'password'];
            
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(fieldId + 'Error');
            
            if (field) {
                field.classList.remove('is-invalid');
            }
            
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }
    
    setLoadingState(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        const textSpan = button.querySelector('.btn-text');
        const spinner = button.querySelector('.spinner-border');
        
        if (isLoading) {
            button.disabled = true;
            if (textSpan) textSpan.style.display = 'none';
            if (spinner) spinner.classList.remove('d-none');
        } else {
            button.disabled = false;
            if (textSpan) textSpan.style.display = 'inline';
            if (spinner) spinner.classList.add('d-none');
        }
    }
    
    togglePasswordVisibility(passwordFieldId, toggleButtonId) {
        const passwordField = document.getElementById(passwordFieldId);
        const toggleButton = document.getElementById(toggleButtonId);
        
        if (!passwordField || !toggleButton) return;
        
        const icon = toggleButton.querySelector('i');
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            icon.className = 'bi bi-eye-slash';
        } else {
            passwordField.type = 'password';
            icon.className = 'bi bi-eye';
        }
    }
    
    setupFormValidation() {
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        if (emailField) {
            emailField.addEventListener('blur', () => {
                const email = emailField.value;
                if (email && !Utils.isValidEmail(email)) {
                    this.showFormError('email', 'Email inválido');
                } else {
                    emailField.classList.remove('is-invalid');
                    document.getElementById('emailError').textContent = '';
                }
            });
        }
        
        const regPasswordField = document.getElementById('regPassword');
        const regPasswordConfirmField = document.getElementById('regPasswordConfirm');
        
        if (regPasswordField) {
            regPasswordField.addEventListener('input', () => {
                const password = regPasswordField.value;
                if (password.length > 0 && password.length < API_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH) {
                    this.showFormError('regPassword', API_CONFIG.VALIDATION.PASSWORD_MIN_LENGTH_MESSAGE);
                } else {
                    regPasswordField.classList.remove('is-invalid');
                    document.getElementById('regPasswordError').textContent = '';
                }
            });
        }
        
        if (regPasswordConfirmField) {
            regPasswordConfirmField.addEventListener('input', () => {
                const password = document.getElementById('regPassword').value;
                const confirmPassword = regPasswordConfirmField.value;
                
                if (confirmPassword.length > 0 && password !== confirmPassword) {
                    this.showFormError('regPasswordConfirm', 'Senhas não coincidem');
                } else {
                    regPasswordConfirmField.classList.remove('is-invalid');
                    document.getElementById('regPasswordConfirmError').textContent = '';
                }
            });
        }
    }
}

// Initialize login page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new LoginPage();
});