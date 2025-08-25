// frontend/js/user-profile.js
class UserProfile {
    constructor() {
        // Bandas
        this.members = [];
        this.userBandCount = 0;
        this.membersLoaded = false;
        this.membersError = false;

        // Participações (shows das bandas do músico)
        this.participations = [];          // agregadas de cada /bands/{id}/shows
        this.userShowCount = 0;
        this.participationsLoaded = false;
        this.participationsError = false;

        this.init();
    }

    async init() {
        if (!auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        const user = auth.getUser();
        if (user && user.role === 'musician') {
            // Primeiro precisa saber em quais bandas está
            this.loadMembers();
        }

        this.loadUserInfo();
        this.loadUserStats(); // placeholders iniciais
        this.loadUserActivity();
    }

    // --- UI Base ---
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
                    <p class="mb-0">${user.criado_em ? Utils.formatDate(user.criado_em) : 'N/A'}</p>
                </div>
            </div>
        `;
        document.getElementById('userInfo').innerHTML = userInfoHtml;
    }

    async loadUserStats() {
        try {
            const user = auth.getUser();
            if (!user) return;

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
                // Bandas
                let bandasValor;
                if (!this.membersLoaded && !this.membersError) {
                    bandasValor = `<div class="spinner-border spinner-border-sm text-primary" role="status"></div>`;
                } else if (this.membersError) {
                    bandasValor = '<span class="text-danger">Erro</span>';
                } else {
                    bandasValor = this.userBandCount;
                }

                // Shows (dependem de membros + fetchs por banda)
                let showsValor;
                if (
                    (!this.membersLoaded && !this.membersError) ||
                    (!this.participationsLoaded && !this.participationsError)
                ) {
                    showsValor = `<div class="spinner-border spinner-border-sm text-success" role="status"></div>`;
                } else if (this.membersError || this.participationsError) {
                    showsValor = '<span class="text-danger">Erro</span>';
                } else {
                    showsValor = this.userShowCount;
                }

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
                            <h4 class="mt-2">${bandasValor}</h4>
                            <p class="text-muted">Minhas Bandas</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-item text-center">
                            <i class="bi bi-calendar-event fs-1 text-success"></i>
                            <h4 class="mt-2">${showsValor}</h4>
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
        } catch (err) {
            console.error('Error loading user stats:', err);
        }
    }

    // --- Carregamentos ---
    async loadMembers() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BAND_MEMBERS, {
                headers: getDefaultHeaders()
            });
            if (!response.ok) throw new Error('Erro na requisição de membros');

            const data = await response.json();
            if (!(data.success && data.data)) throw new Error(data.message || 'Erro ao carregar membros');

            this.members = data.data.members || [];
            this.computeUserBandCount();
            this.membersLoaded = true;
        } catch (e) {
            console.error('Error loading members:', e);
            this.membersError = true;
        } finally {
            const user = auth.getUser();
            if (user?.role === 'musician') {
                // Após saber bandas, busca shows específicos
                if (!this.membersError) {
                    this.loadBandShows();
                } else {
                    this.participationsLoaded = true; // evita spinner infinito
                }
                this.loadUserStats();
            }
        }
    }

    async loadBandShows() {
        const user = auth.getUser();
        if (!user) return;

        // Bandas do usuário
        const myBandIds = Array.from(new Set(
            this.members
                .filter(m => String(m.id_usuario) === String(user.id))
                .map(m => m.id_banda)
        ));

        if (myBandIds.length === 0) {
            this.participations = [];
            this.userShowCount = 0;
            this.participationsLoaded = true;
            this.loadUserStats();
            return;
        }

        try {
            const requests = myBandIds.map(id =>
                this.fetchBandShows(id)
            );

            const results = await Promise.allSettled(requests);

            const aggregated = [];
            let anyError = false;

            results.forEach(r => {
                if (r.status === 'fulfilled') {
                    aggregated.push(...r.value);
                } else {
                    anyError = true;
                }
            });

            if (anyError && aggregated.length === 0) {
                this.participationsError = true;
            }

            this.participations = aggregated;
            if (!this.participationsError) {
                this.computeUserShowCount(); // agora baseado em agregação
            }
        } catch (err) {
            console.error('Erro agregando shows por banda:', err);
            this.participationsError = true;
        } finally {
            this.participationsLoaded = true;
            this.loadUserStats();
        }
    }

    async fetchBandShows(bandId) {
        const endpoint = API_CONFIG.ENDPOINTS.PARTICIPATIONS_BY_BAND.replace('%id', bandId);
        const url = API_CONFIG.BASE_URL + endpoint;

        let resp;
        try {
            resp = await fetch(url, { headers: getDefaultHeaders() });
        } catch (netErr) {
            throw new Error(`Falha de rede ao buscar shows da banda ${bandId}: ${netErr.message}`);
        }

        if (!resp.ok) {
            throw new Error(`Falha HTTP (${resp.status}) ao buscar shows da banda ${bandId}`);
        }

        const json = await resp.json();

        if (!json?.success) {
            throw new Error(`API retornou erro para banda ${bandId}: ${json?.message || 'sem mensagem'}`);
        }

        const payload = json.data || {};
        const nomeBanda = payload.nome_banda ?? payload.nome ?? null;

        let shows = Array.isArray(payload.shows) ? payload.shows : [];
        if (shows.length === 0 && Array.isArray(payload.participacoes)) {
            shows = payload.participacoes;
        }

        return shows
            .filter(s => s && (s.id_show !== undefined && s.id_show !== null))
            .map(s => ({
                id_banda: payload.id_banda ?? bandId,
                nome_banda: nomeBanda,
                id_show: s.id_show,
                nome_show: s.nome_show ?? s.nome ?? null,
                ordem_apresentacao: s.ordem_apresentacao ?? null,
                tempo_execucao_min: s.tempo_execucao_min ?? null
            }));
    }

    computeUserBandCount() {
        const user = auth.getUser();
        if (!user) return;
        const myMemberships = this.members.filter(m => String(m.id_usuario) === String(user.id));
        this.userBandCount = (new Set(myMemberships.map(m => m.id_banda))).size;
    }

    computeUserShowCount() {
        const uniqueShowIds = new Set(
            this.participations
                .map(p => p.id_show)
                .filter(id => id !== undefined && id !== null)
        );
        this.userShowCount = uniqueShowIds.size;
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

    // --- Utilitários ---
    getRoleBadgeClass(role) {
        switch (role) {
            case 'admin': return 'bg-danger';
            case 'musician': return 'bg-primary';
            case 'organizador': return 'bg-warning text-dark';
            default: return 'bg-secondary';
        }
    }

    getRoleDisplayName(role) {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'musician': return 'Músico';
            case 'organizador': return 'Organizador';
            default: return 'Usuário';
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

document.addEventListener('DOMContentLoaded', () => {
    new UserProfile();
});