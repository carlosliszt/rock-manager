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
        const recentActivityElement = document.getElementById('recentActivity');
        if (!recentActivityElement) return;
        
        try {
            const [bandsResponse, showsResponse] = await Promise.all([
                fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BANDS, {
                    method: 'GET',
                    headers: getDefaultHeaders()
                }),
                fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SHOWS, {
                    method: 'GET',
                    headers: getDefaultHeaders()
                })
            ]);
            
            const activities = [];
            
            if (bandsResponse.ok) {
                const bandsData = await bandsResponse.json();
                if (bandsData.success && bandsData.data && bandsData.data.bandas) {
                    const recentBands = bandsData.data.bandas.slice(-3);
                    recentBands.forEach(band => {
                        activities.push({
                            type: 'band',
                            title: `Nova banda cadastrada: ${band.nome}`,
                            description: `Gênero: ${band.genero || 'Não informado'}`,
                            icon: 'bi-people',
                            color: 'text-info'
                        });
                    });
                }
            }
            
            if (showsResponse.ok) {
                const showsData = await showsResponse.json();
                if (showsData.success && showsData.data && showsData.data.shows) {
                    const recentShows = showsData.data.shows.slice(-3);
                    recentShows.forEach(show => {
                        activities.push({
                            type: 'show',
                            title: `Novo show criado`,
                            description: `Local: ${show.local} - Data: ${Utils.formatDate(show.data)}`,
                            icon: 'bi-calendar-event',
                            color: 'text-success'
                        });
                    });
                }
            }
            
            this.displayRecentActivity(activities.slice(0, 6));
            
        } catch (error) {
            console.error('Error loading recent activity:', error);
            recentActivityElement.innerHTML = `
                <div class="text-center text-muted">
                    <i class="bi bi-exclamation-circle fs-4"></i>
                    <p class="mt-2">Erro ao carregar atividades recentes</p>
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
                    <small>Comece criando bandas e shows para ver as atividades aqui.</small>
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
    
    refresh() {
        this.loadStats();
        this.loadRecentActivity();
        showToast('Dashboard atualizado!', 'success');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const dashboard = new Dashboard();
    
    window.refreshDashboard = () => dashboard.refresh();
    
    setInterval(() => {
        dashboard.loadStats();
    }, 300000);
});