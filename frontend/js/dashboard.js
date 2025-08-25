class Dashboard {
    constructor() {
        this.stats = {
            bands: 0,
            shows: 0,
            participations: 0,
            users: 0
        };
        this.init();
    }

    init() {
        this.loadStats();
        this.loadRecentActivity();
    }

    async loadStats() {
        try {
            await this.loadBandsCount();

            await this.loadShowsCount();

            await this.loadParticipationsCount();

            await this.loadUsersCount();

            this.updateStatsUI();

        } catch (error) {
            console.error('Error loading stats:', error);
            showToast('Erro ao carregar estatísticas', 'error');
        }
    }

    async loadBandsCount() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BANDS, {
                method: 'GET',
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.bandas) {
                    this.stats.bands = data.data.bandas.length;
                }
            }
        } catch (error) {
            console.error('Error loading bands count:', error);
        }
    }

    async loadUsersCount() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.USERS, {
                method: 'GET',
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.usuarios) {
                    this.stats.users = data.data.usuarios.length;
                }
            }
        } catch (error) {
            console.error('Error loading users count:', error);
        }
    }

    async loadShowsCount() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SHOWS, {
                method: 'GET',
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.shows) {
                    this.stats.shows = data.data.shows.length;
                }
            }
        } catch (error) {
            console.error('Error loading shows count:', error);
        }
    }

    async loadParticipationsCount() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.PARTICIPATIONS, {
                method: 'GET',
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.participacoes) {
                    this.stats.participations = data.data.participacoes.length;
                }
            }
        } catch (error) {
            console.error('Error loading participations count:', error);
        }
    }

    updateStatsUI() {
        const totalBandsElement = document.getElementById('totalBands');
        const totalShowsElement = document.getElementById('totalShows');
        const totalParticipationsElement = document.getElementById('totalParticipations');
        const totalUsersElement = document.getElementById('totalUsers');

        if (totalBandsElement) {
            totalBandsElement.textContent = this.stats.bands;
        }

        if (totalShowsElement) {
            totalShowsElement.textContent = this.stats.shows;
        }

        if (totalParticipationsElement) {
            totalParticipationsElement.textContent = this.stats.participations;
        }

        if (totalUsersElement) {
            totalUsersElement.textContent = this.stats.users;
        }
    }

    async loadRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;

        container.innerHTML = `
        <div class="text-center text-muted">
            <div class="spinner-border spinner-border-sm me-2"></div>
            Carregando usuários recentes...
        </div>
    `;

        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.USERS, {
                method: 'GET',
                headers: getDefaultHeaders()
            });

            if (!response.ok) throw new Error('Falha ao obter usuários');

            const data = await response.json();
            const usuarios = (data.success && data.data && data.data.usuarios) ? data.data.usuarios : [];

            const sorted = [...usuarios].sort((a, b) => {
                if (a.criado_em && b.criado_em) {
                    return new Date(b.criado_em) - new Date(a.criado_em);
                }
                return (b.id || 0) - (a.id || 0);
            });

            const recent = sorted.slice(0, 6);

            if (!recent.length) {
                container.innerHTML = `
                <div class="text-center text-muted">
                    <i class="bi bi-person fs-4"></i>
                    <p class="mt-2">Nenhum usuário cadastrado ainda</p>
                    <small>Registros aparecerão aqui.</small>
                </div>
            `;
                return;
            }

            const activities = recent.map(u => {
                const badgeClass = `badge ${this.getRoleBadgeClass(u.role)}`;
                const roleLabel = this.getRoleDisplayName(u.role);
                const roleBadge = `<span class="${badgeClass}">${roleLabel}</span>`;
                return {
                    type: 'user',
                    title: `Novo usuário: ${u.username || u.email || 'Sem nome'}`,
                    description: `Criado: ${Utils.formatDate(u.criado_em)} • ${roleBadge}`,
                    icon: 'bi-person-plus',
                    color: 'text-primary'
                };
            });

            this.displayRecentActivity(activities);

        } catch (err) {
            console.error('Erro ao carregar usuários recentes:', err);
            container.innerHTML = `
            <div class="text-center text-muted">
                <i class="bi bi-exclamation-circle fs-4"></i>
                <p class="mt-2">Erro ao carregar usuários recentes</p>
            </div>
        `;
        }
    }

    displayRecentActivity(activities) {
        const recentActivityElement = document.getElementById('recentActivity');
        if (!recentActivityElement) return;

        if (activities.length === 0) {
            recentActivityElement.innerHTML = `
                <div class="text-center text-muted">
                    <i class="bi bi-clock-history fs-4"></i>
                    <p class="mt-2">Nenhuma atividade recente encontrada</p>
                    <small>Usuários recentemente registrados aparecerão aqui.</small>
                </div>
            `;
            return;
        }

        let activityHtml = '<div class="list-group list-group-flush">';

        activities.forEach((activity, index) => {
            activityHtml += `
                <div class="list-group-item list-group-item-action fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="d-flex w-100 justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <i class="bi ${activity.icon} fs-4 ${activity.color} me-3"></i>
                            <div>
                                <h6 class="mb-1">${activity.title}</h6>
                                <p class="mb-0 text-muted small">${activity.description}</p>
                            </div>
                        </div>
                        <small class="text-muted">Recente</small>
                    </div>
                </div>
            `;
        });

        activityHtml += '</div>';

        activityHtml += `
            <div class="text-center mt-3">
                <small class="text-muted">
                    Acesse as seções específicas para gerenciar 
                    <a href="pages/bands.html" class="text-decoration-none">bandas</a>, 
                    <a href="pages/shows.html" class="text-decoration-none">shows</a> e 
                    <a href="pages/participations.html" class="text-decoration-none">participações</a>.
                </small>
            </div>
        `;

        recentActivityElement.innerHTML = activityHtml;
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


    refresh() {
        this.loadStats();
        this.loadRecentActivity();
        showToast('Dashboard atualizado!', 'success');
    }


}

document.addEventListener('DOMContentLoaded', function () {
    const dashboard = new Dashboard();

    window.refreshDashboard = () => dashboard.refresh();

    setInterval(() => {
        dashboard.loadStats();
    }, 300000);
});