class UserProfile {
    constructor() {
        this.init();
    }
    
    init() {
        if (!auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        
        this.loadUserInfo();
        this.loadUserStats();
        this.loadUserActivity();
    }
    
    loadUserInfo() {
        const user = auth.getUser();
        
        if (!user) {
            this.showError('Não foi possível carregar as informações do usuário.');
            return;
        }
        
        const userInfoHtml = `
            <div class="col-md-6">
                <div class="info-item mb-3">
                    <label class="fw-bold text-muted">Nome de Usuário:</label>
                    <p class="mb-0">${user.username || 'N/A'}</p>
                </div>
                <div class="info-item mb-3">
                    <label class="fw-bold text-muted">Email:</label>
                    <p class="mb-0">${user.email || 'N/A'}</p>
                </div>
                <div class="info-item mb-3">
                    <label class="fw-bold text-muted">Tipo de Usuário:</label>
                    <span class="badge ${this.getRoleBadgeClass(user.role)} fs-6">
                        ${this.getRoleDisplayName(user.role)}
                    </span>
                </div>
            </div>
            <div class="col-md-6">
                <div class="info-item mb-3">
                    <label class="fw-bold text-muted">ID:</label>
                    <p class="mb-0">${user.id || 'N/A'}</p>
                </div>
                <div class="info-item mb-3">
                    <label class="fw-bold text-muted">Status:</label>
                    <span class="badge bg-success fs-6">Ativo</span>
                </div>
                <div class="info-item mb-3">
                    <label class="fw-bold text-muted">Data de Criação:</label>
                    <p class="mb-0">${user.created_at ? Utils.formatDate(user.created_at) : 'N/A'}</p>
                </div>
            </div>
        `;
        
        document.getElementById('userInfo').innerHTML = userInfoHtml;
    }
    
    async loadUserStats() {
        try {
            const user = auth.getUser();
            let statsHtml = '';
            
            if (user.role === 'admin') {
                statsHtml = `
                    <div class="col-md-3">
                        <div class="stat-item text-center">
                            <i class="bi bi-shield-check fs-1 text-primary"></i>
                            <h4 class="mt-2">Administrador</h4>
                            <p class="text-muted">Acesso Total</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-item text-center">
                            <i class="bi bi-people fs-1 text-info"></i>
                            <h4 class="mt-2">Todas</h4>
                            <p class="text-muted">Bandas</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-item text-center">
                            <i class="bi bi-calendar-event fs-1 text-success"></i>
                            <h4 class="mt-2">Todos</h4>
                            <p class="text-muted">Shows</p>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-item text-center">
                            <i class="bi bi-gear fs-1 text-warning"></i>
                            <h4 class="mt-2">Sistema</h4>
                            <p class="text-muted">Configurações</p>
                        </div>
                    </div>
                `;
            } else if (user.role === 'musician') {
                statsHtml = `
                    <div class="col-md-4">
                        <div class="stat-item text-center">
                            <i class="bi bi-music-note fs-1 text-primary"></i>
                            <h4 class="mt-2">Músico</h4>
                            <p class="text-muted">Perfil Artístico</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-item text-center">
                            <i class="bi bi-people fs-1 text-info"></i>
                            <h4 class="mt-2">-</h4>
                            <p class="text-muted">Minhas Bandas</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-item text-center">
                            <i class="bi bi-calendar-event fs-1 text-success"></i>
                            <h4 class="mt-2">-</h4>
                            <p class="text-muted">Shows Participados</p>
                        </div>
                    </div>
                `;
            } else if (user.role === 'organizador') {
                statsHtml = `
                    <div class="col-md-4">
                        <div class="stat-item text-center">
                            <i class="bi bi-calendar-plus fs-1 text-primary"></i>
                            <h4 class="mt-2">Organizador</h4>
                            <p class="text-muted">Eventos</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-item text-center">
                            <i class="bi bi-calendar-event fs-1 text-success"></i>
                            <h4 class="mt-2">-</h4>
                            <p class="text-muted">Shows Organizados</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-item text-center">
                            <i class="bi bi-people fs-1 text-info"></i>
                            <h4 class="mt-2">-</h4>
                            <p class="text-muted">Bandas Colaboradoras</p>
                        </div>
                    </div>
                `;
            } else {
                statsHtml = `
                    <div class="col-md-12">
                        <div class="stat-item text-center">
                            <i class="bi bi-person fs-1 text-primary"></i>
                            <h4 class="mt-2">Usuário</h4>
                            <p class="text-muted">Acesso básico ao sistema</p>
                        </div>
                    </div>
                `;
            }
            
            document.getElementById('userStats').innerHTML = statsHtml;
            document.getElementById('userStatsCard').style.display = 'block';
            
        } catch (error) {
            console.error('Error loading user stats:', error);
        }
    }
    
    loadUserActivity() {
        const activityHtml = `
            <div class="activity-item d-flex align-items-center mb-3">
                <div class="activity-icon me-3">
                    <i class="bi bi-box-arrow-in-right text-success fs-4"></i>
                </div>
                <div class="activity-content">
                    <p class="mb-1">Login realizado com sucesso</p>
                    <small class="text-muted">Há poucos minutos</small>
                </div>
            </div>
            <div class="activity-item d-flex align-items-center mb-3">
                <div class="activity-icon me-3">
                    <i class="bi bi-person-circle text-info fs-4"></i>
                </div>
                <div class="activity-content">
                    <p class="mb-1">Perfil acessado</p>
                    <small class="text-muted">Agora</small>
                </div>
            </div>
        `;
        
        document.getElementById('userActivity').innerHTML = activityHtml;
        document.getElementById('userActivityCard').style.display = 'block';
    }
    
    getRoleBadgeClass(role) {
        switch (role) {
            case 'admin':
                return 'bg-danger';
            case 'musician':
                return 'bg-primary';
            case 'organizador':
                return 'bg-warning text-dark';
            default:
                return 'bg-secondary';
        }
    }
    
    getRoleDisplayName(role) {
        switch (role) {
            case 'admin':
                return 'Administrador';
            case 'musician':
                return 'Músico';
            case 'organizador':
                return 'Organizador';
            default:
                return 'Usuário';
        }
    }
    
    showError(message) {
        const errorHtml = `
            <div class="col-12">
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-triangle"></i> ${message}
                </div>
            </div>
        `;
        document.getElementById('userInfo').innerHTML = errorHtml;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new UserProfile();
});