class ParticipationsManager {
    constructor() {
        this.participations = [];
        this.filteredParticipations = [];
        this.bands = [];
        this.shows = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortColumn = 'data_show';
        this.sortDirection = 'desc';
        this.searchTerm = '';
        this.bandFilter = '';
        this.showFilter = '';
        this.editingParticipation = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadData();
        this.updateUIBasedOnAuth();
        this.checkURLParams();
    }
    
    checkURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const showId = urlParams.get('show');
        const bandId = urlParams.get('band');
        
        if (showId) {
            setTimeout(() => {
                const showSelect = document.getElementById('filterShow');
                if (showSelect) {
                    showSelect.value = showId;
                    this.showFilter = showId;
                    this.filterAndDisplayParticipations();
                }
            }, 1000);
        }
        
        if (bandId) {
            setTimeout(() => {
                const bandSelect = document.getElementById('filterBand');
                if (bandSelect) {
                    bandSelect.value = bandId;
                    this.bandFilter = bandId;
                    this.filterAndDisplayParticipations();
                }
            }, 1000);
        }
    }
    
    updateUIBasedOnAuth() {
        const addParticipationBtn = document.getElementById('addParticipationBtn');
        
        if (!auth.isAuthenticated()) {
            if (addParticipationBtn) addParticipationBtn.style.display = 'none';
            return;
        }
        
        const canCreateParticipation = auth.canPerform('create', 'participation');
        if (addParticipationBtn) {
            addParticipationBtn.style.display = canCreateParticipation ? 'block' : 'none';
        }
    }
    
    bindEvents() {
        const searchInput = document.getElementById('searchParticipations');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterAndDisplayParticipations();
            }, 300));
        }
        
        const bandFilter = document.getElementById('filterBand');
        if (bandFilter) {
            bandFilter.addEventListener('change', (e) => {
                this.bandFilter = e.target.value;
                this.filterAndDisplayParticipations();
            });
        }
        
        const showFilter = document.getElementById('filterShow');
        if (showFilter) {
            showFilter.addEventListener('change', (e) => {
                this.showFilter = e.target.value;
                this.filterAndDisplayParticipations();
            });
        }
        
        const pageSizeSelect = document.getElementById('pageSize');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                this.pageSize = parseInt(e.target.value);
                this.currentPage = 1;
                this.displayParticipations();
            });
        }
        
        const participationForm = document.getElementById('participationForm');
        if (participationForm) {
            participationForm.addEventListener('submit', (e) => this.handleParticipationSubmit(e));
        }
    }
    
    async loadData() {
        try {
            await Promise.all([
                this.loadParticipations(),
                this.loadBands(),
                this.loadShows()
            ]);
            
            this.updateFilters();
            this.updateFormSelects();
            this.displayParticipations();
        } catch (error) {
            console.error('Error loading data:', error);
            this.displayError('Erro ao carregar dados: ' + error.message);
        }
    }
    
    async loadParticipations() {
        const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.PARTICIPATIONS, {
            method: 'GET',
            headers: getDefaultHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data && data.data.participacoes) {
                this.participations = data.data.participacoes;
                this.filteredParticipations = [...this.participations];
            } else {
                throw new Error(data.message || 'Erro ao carregar participações');
            }
        } else {
            throw new Error('Erro na requisição de participações');
        }
    }
    
    async loadBands() {
        const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BANDS, {
            method: 'GET',
            headers: getDefaultHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data && data.data.bandas) {
                this.bands = data.data.bandas;
            } else {
                throw new Error(data.message || 'Erro ao carregar bandas');
            }
        } else {
            throw new Error('Erro na requisição de bandas');
        }
    }
    
    async loadShows() {
        const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SHOWS, {
            method: 'GET',
            headers: getDefaultHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data && data.data.shows) {
                this.shows = data.data.shows;
            } else {
                throw new Error(data.message || 'Erro ao carregar shows');
            }
        } else {
            throw new Error('Erro na requisição de shows');
        }
    }
    
    updateFilters() {
        const bandSelect = document.getElementById('filterBand');
        if (bandSelect) {
            bandSelect.innerHTML = '<option value="">Todas as bandas</option>';
            this.bands.forEach(band => {
                bandSelect.innerHTML += `<option value="${band.id}">${band.nome}</option>`;
            });
        }
        
        const showSelect = document.getElementById('filterShow');
        if (showSelect) {
            showSelect.innerHTML = '<option value="">Todos os shows</option>';
            this.shows.forEach(show => {
                showSelect.innerHTML += `<option value="${show.id}">${show.local} - ${Utils.formatDate(show.data)}</option>`;
            });
        }
    }
    
    updateFormSelects() {
        const participationBandSelect = document.getElementById('participationBand');
        if (participationBandSelect) {
            participationBandSelect.innerHTML = '<option value="">Selecione uma banda...</option>';
            this.bands.forEach(band => {
                participationBandSelect.innerHTML += `<option value="${band.id}">${band.nome}</option>`;
            });
        }
        
        const participationShowSelect = document.getElementById('participationShow');
        if (participationShowSelect) {
            participationShowSelect.innerHTML = '<option value="">Selecione um show...</option>';
            const futureShows = this.shows.filter(show => new Date(show.data) >= new Date());
            futureShows.forEach(show => {
                participationShowSelect.innerHTML += `<option value="${show.id}">${show.local} - ${Utils.formatDate(show.data)}</option>`;
            });
        }
    }
    
    filterAndDisplayParticipations() {
        this.filteredParticipations = this.participations.filter(participation => {
            const band = this.bands.find(b => b.id == participation.id_banda);
            const show = this.shows.find(s => s.id == participation.id_show);
            
            const matchesSearch = !this.searchTerm || 
                (band && band.nome.toLowerCase().includes(this.searchTerm)) ||
                (show && show.local.toLowerCase().includes(this.searchTerm));
            
            const matchesBand = !this.bandFilter || participation.id_banda == this.bandFilter;
            const matchesShow = !this.showFilter || participation.id_show == this.showFilter;
            
            return matchesSearch && matchesBand && matchesShow;
        });
        
        this.currentPage = 1;
        this.displayParticipations();
    }
    
    displayParticipations() {
        const tbody = document.getElementById('participationsTableBody');
        const countElement = document.getElementById('totalParticipationsCount');
        
        if (!tbody) return;
        
        if (countElement) {
            countElement.textContent = `${this.filteredParticipations.length} participaç${this.filteredParticipations.length !== 1 ? 'ões' : 'ão'}`;
        }
        
        this.sortParticipations();
        
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const paginatedParticipations = this.filteredParticipations.slice(startIndex, endIndex);
        
        if (paginatedParticipations.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="bi bi-link-45deg fs-1 text-muted"></i>
                        <p class="mt-2 text-muted">Nenhuma participação encontrada</p>
                        ${this.participations.length === 0 ? '<small>Clique em "Nova Participação" para vincular bandas aos shows.</small>' : ''}
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = paginatedParticipations.map(participation => this.createParticipationRow(participation)).join('');
        }
        
        this.updatePagination();
    }
    
    createParticipationRow(participation) {
        const canEdit = auth.canPerform('edit', 'participation');
        const canDelete = auth.canPerform('delete', 'participation');
        
        const band = this.bands.find(b => b.id == participation.id_banda);
        const show = this.shows.find(s => s.id == participation.id_show);
        
        const showDate = show ? new Date(show.data) : null;
        const today = new Date();
        const isPast = showDate && showDate < today;
        const isToday = showDate && showDate.toDateString() === today.toDateString();
        
        let statusBadge = '';
        if (isPast) {
            statusBadge = '<span class="badge bg-secondary">Realizado</span>';
        } else if (isToday) {
            statusBadge = '<span class="badge bg-warning">Hoje</span>';
        } else {
            statusBadge = '<span class="badge bg-success">Agendado</span>';
        }
        
        return `
            <tr class="fade-in">
                <td>
                    <strong>${band ? band.nome : 'Banda não encontrada'}</strong>
                    ${band && band.genero ? `<br><small class="text-muted">${band.genero}</small>` : ''}
                </td>
                <td>
                    <strong>${show ? show.local : 'Show não encontrado'}</strong>
                    ${show && show.publico_estimado ? `<br><small class="text-muted">${show.publico_estimado.toLocaleString()} pessoas</small>` : ''}
                </td>
                <td>
                    ${show ? Utils.formatDate(show.data) : '-'}
                    ${isToday ? '<br><i class="bi bi-clock text-warning" title="Show hoje!"></i>' : ''}
                </td>
                <td>
                    <span class="badge bg-primary">${participation.ordem_apresentacao}°</span>
                </td>
                <td>
                    <span class="badge bg-info">${participation.tempo_execucao_min} min</span>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-buttons">
                        ${canEdit ? `
                            <button class="btn btn-sm btn-outline-warning" onclick="editParticipation(${participation.id_banda}, ${participation.id_show})" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                        ` : ''}
                        ${canDelete ? `
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteParticipation(${participation.id_banda}, ${participation.id_show})" title="Excluir">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-sm btn-outline-info" onclick="viewBandShows(${participation.id_banda})" title="Ver shows da banda">
                            <i class="bi bi-calendar-event"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    sortParticipations() {
        this.filteredParticipations.sort((a, b) => {
            let aValue, bValue;
            
            switch (this.sortColumn) {
                case 'id_banda':
                    const bandA = this.bands.find(b => b.id == a.id_banda);
                    const bandB = this.bands.find(b => b.id == b.id_banda);
                    aValue = bandA ? bandA.nome : '';
                    bValue = bandB ? bandB.nome : '';
                    break;
                case 'show_local':
                    const showA = this.shows.find(s => s.id == a.id_show);
                    const showB = this.shows.find(s => s.id == b.id_show);
                    aValue = showA ? showA.local : '';
                    bValue = showB ? showB.local : '';
                    break;
                case 'data_show':
                    const dateA = this.shows.find(s => s.id == a.id_show);
                    const dateB = this.shows.find(s => s.id == b.id_show);
                    aValue = dateA ? new Date(dateA.data) : new Date(0);
                    bValue = dateB ? new Date(dateB.data) : new Date(0);
                    break;
                default:
                    aValue = a[this.sortColumn];
                    bValue = b[this.sortColumn];
            }
            
            if (aValue == null) aValue = '';
            if (bValue == null) bValue = '';
            
            if (this.sortColumn === 'data_show') {
                if (this.sortDirection === 'asc') {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                if (this.sortDirection === 'asc') {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            } else {
                aValue = aValue.toString().toLowerCase();
                bValue = bValue.toString().toLowerCase();
                
                if (this.sortDirection === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            }
        });
    }
    
    updatePagination() {
        const pagination = document.getElementById('participationsPagination');
        if (!pagination) return;
        
        const totalPages = Math.ceil(this.filteredParticipations.length / this.pageSize);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHtml = '';
        
        paginationHtml += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeParticipationsPage(${this.currentPage - 1})">Anterior</a>
            </li>
        `;
        
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changeParticipationsPage(1)">1</a></li>`;
            if (startPage > 2) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeParticipationsPage(${i})">${i}</a>
                </li>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changeParticipationsPage(${totalPages})">${totalPages}</a></li>`;
        }
        
        paginationHtml += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeParticipationsPage(${this.currentPage + 1})">Próximo</a>
            </li>
        `;
        
        pagination.innerHTML = paginationHtml;
    }
    
    changeParticipationsPage(page) {
        const totalPages = Math.ceil(this.filteredParticipations.length / this.pageSize);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.displayParticipations();
    }
    
    async handleParticipationSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const participationData = {
            id_banda: parseInt(formData.get('id_banda')),
            id_show: parseInt(formData.get('id_show')),
            ordem_apresentacao: parseInt(formData.get('ordem_apresentacao')),
            tempo_execucao_min: parseInt(formData.get('tempo_execucao_min'))
        };
        
        if (!this.validateParticipationForm(participationData)) {
            return;
        }
        
        this.setLoadingState('saveParticipationBtn', true);
        
        try {
            let response;
            if (this.editingParticipation) {
                const originalBandId = formData.get('originalBandId');
                const originalShowId = formData.get('originalShowId');
                
                response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.PARTICIPATIONS + '/' + originalBandId + '/' + originalShowId, {
                    method: 'PUT',
                    headers: getDefaultHeaders(),
                    body: JSON.stringify({ participacao: participationData })
                });
            } else {
                response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.PARTICIPATIONS, {
                    method: 'POST',
                    headers: getDefaultHeaders(),
                    body: JSON.stringify({ participacao: participationData })
                });
            }
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    showToast(`Participação ${this.editingParticipation ? 'atualizada' : 'criada'} com sucesso!`, 'success');
                    
                    const modal = bootstrap.Modal.getInstance(document.getElementById('participationModal'));
                    modal.hide();
                    
                    this.loadData();
                } else {
                    throw new Error(result.message || 'Erro ao salvar participação');
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro na requisição');
            }
        } catch (error) {
            console.error('Error saving participation:', error);
            showToast('Erro ao salvar participação: ' + error.message, 'error');
        } finally {
            this.setLoadingState('saveParticipationBtn', false);
        }
    }
    
    validateParticipationForm(participationData) {
        let isValid = true;
        
        this.clearFormErrors();
        
        if (!participationData.id_banda) {
            this.showFormError('participationBand', 'Selecione uma banda');
            isValid = false;
        }
        
        if (!participationData.id_show) {
            this.showFormError('participationShow', 'Selecione um show');
            isValid = false;
        }
        
        if (!participationData.ordem_apresentacao || participationData.ordem_apresentacao < 1) {
            this.showFormError('participationOrder', 'Ordem deve ser maior que zero');
            isValid = false;
        }
        
        if (!participationData.tempo_execucao_min || participationData.tempo_execucao_min < 1) {
            this.showFormError('participationDuration', 'Duração deve ser maior que zero');
            isValid = false;
        }
        
        if (!this.editingParticipation) {
            const existingParticipation = this.participations.find(p => 
                p.id_banda == participationData.id_banda && p.id_show == participationData.id_show
            );
            
            if (existingParticipation) {
                this.showFormError('participationBand', 'Esta banda já está cadastrada neste show');
                this.showFormError('participationShow', 'Esta banda já está cadastrada neste show');
                isValid = false;
            }
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
    
    clearFormErrors() {
        const fields = ['participationBand', 'participationShow', 'participationOrder', 'participationDuration'];
        
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
    
    displayError(message) {
        const tbody = document.getElementById('participationsTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-danger">
                        <i class="bi bi-exclamation-circle fs-1"></i>
                        <p class="mt-2">${message}</p>
                        <button class="btn btn-outline-warning" onclick="participationsManager.loadData()">
                            <i class="bi bi-arrow-clockwise"></i> Tentar Novamente
                        </button>
                    </td>
                </tr>
            `;
        }
    }
    
    showAddParticipationModal() {
        this.editingParticipation = null;
        
        const form = document.getElementById('participationForm');
        if (form) form.reset();
        
        this.clearFormErrors();
        
        const modalTitle = document.getElementById('participationModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="bi bi-plus-circle"></i> Nova Participação';
        }
        
        const saveBtn = document.getElementById('saveParticipationBtn');
        if (saveBtn) {
            saveBtn.querySelector('.btn-text').textContent = 'Salvar';
        }
    }
    
    showEditParticipationModal(bandId, showId) {
        const participation = this.participations.find(p => p.id_banda == bandId && p.id_show == showId);
        if (!participation) return;
        
        this.editingParticipation = participation;
        
        document.getElementById('originalBandId').value = bandId;
        document.getElementById('originalShowId').value = showId;
        document.getElementById('participationBand').value = participation.id_banda;
        document.getElementById('participationShow').value = participation.id_show;
        document.getElementById('participationOrder').value = participation.ordem_apresentacao;
        document.getElementById('participationDuration').value = participation.tempo_execucao_min;
        
        this.clearFormErrors();
        
        const modalTitle = document.getElementById('participationModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="bi bi-pencil"></i> Editar Participação';
        }
        
        const saveBtn = document.getElementById('saveParticipationBtn');
        if (saveBtn) {
            saveBtn.querySelector('.btn-text').textContent = 'Atualizar';
        }
        
        const modal = new bootstrap.Modal(document.getElementById('participationModal'));
        modal.show();
    }
    
    async deleteParticipation(bandId, showId) {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.PARTICIPATIONS + '/' + bandId + '/' + showId, {
                method: 'DELETE',
                headers: getDefaultHeaders()
            });
            
            if (response.ok) {
                showToast('Participação excluída com sucesso!', 'success');
                this.loadData();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao excluir participação');
            }
        } catch (error) {
            console.error('Error deleting participation:', error);
            showToast('Erro ao excluir participação: ' + error.message, 'error');
        }
    }
    
    async exportParticipations(format) {
        try {
            const endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.PARTICIPATIONS_EXPORT_CSV :
                           format === 'json' ? API_CONFIG.ENDPOINTS.PARTICIPATIONS_EXPORT_JSON :
                           API_CONFIG.ENDPOINTS.PARTICIPATIONS_EXPORT_XML;
            
            const response = await fetch(API_CONFIG.BASE_URL + endpoint, {
                method: 'GET',
                headers: getDefaultHeaders()
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `participacoes.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                showToast(`Participações exportadas em ${format.toUpperCase()}!`, 'success');
            } else {
                throw new Error('Erro ao exportar participações');
            }
        } catch (error) {
            console.error('Error exporting participations:', error);
            showToast('Erro ao exportar participações: ' + error.message, 'error');
        }
    }
    
    async importParticipations() {
        const fileInput = document.getElementById('importFile');
        const formatSelect = document.getElementById('importFormat');
        
        if (!fileInput.files[0]) {
            showToast('Selecione um arquivo para importar', 'warning');
            return;
        }
        
        const file = fileInput.files[0];
        const format = formatSelect.value;
        
        try {
            const formData = new FormData();
            formData.append(format, file);
            
            const endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.PARTICIPATIONS_IMPORT_CSV :
                           format === 'json' ? API_CONFIG.ENDPOINTS.PARTICIPATIONS_IMPORT_JSON :
                           API_CONFIG.ENDPOINTS.PARTICIPATIONS_IMPORT_XML;
            
            const response = await fetch(API_CONFIG.BASE_URL + endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': getDefaultHeaders()['Authorization']
                },
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    showToast('Participações importadas com sucesso!', 'success');
                    fileInput.value = '';
                    this.loadData();
                } else {
                    throw new Error(result.message || 'Erro ao importar participações');
                }
            } else {
                throw new Error('Erro na requisição');
            }
        } catch (error) {
            console.error('Error importing participations:', error);
            showToast('Erro ao importar participações: ' + error.message, 'error');
        }
    }
}

let participationsManager;

function refreshParticipations() {
    participationsManager.loadData();
}

function sortParticipations(column) {
    if (participationsManager.sortColumn === column) {
        participationsManager.sortDirection = participationsManager.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        participationsManager.sortColumn = column;
        participationsManager.sortDirection = 'asc';
    }
    
    document.querySelectorAll('th .bi').forEach(icon => {
        icon.className = 'bi bi-chevron-expand text-muted';
    });
    
    const currentHeader = document.querySelector(`th[onclick="sortParticipations('${column}')"] .bi`);
    if (currentHeader) {
        currentHeader.className = `bi bi-chevron-${participationsManager.sortDirection === 'asc' ? 'up' : 'down'} text-primary`;
    }
    
    participationsManager.displayParticipations();
}

function changeParticipationsPage(page) {
    participationsManager.changeParticipationsPage(page);
}

function showAddParticipationModal() {
    participationsManager.showAddParticipationModal();
}

function editParticipation(bandId, showId) {
    participationsManager.showEditParticipationModal(bandId, showId);
}

function deleteParticipation(bandId, showId) {
    const participation = participationsManager.participations.find(p => p.id_banda == bandId && p.id_show == showId);
    if (!participation) return;
    
    const band = participationsManager.bands.find(b => b.id == bandId);
    const show = participationsManager.shows.find(s => s.id == showId);
    
    document.getElementById('deleteParticipationBand').textContent = band ? band.nome : 'Banda não encontrada';
    document.getElementById('deleteParticipationShow').textContent = show ? show.local : 'Show não encontrado';
    
    participationsManager.participationToDelete = { bandId, showId };
    
    const modal = new bootstrap.Modal(document.getElementById('deleteParticipationModal'));
    modal.show();
}

function confirmDeleteParticipation() {
    if (participationsManager.participationToDelete) {
        const { bandId, showId } = participationsManager.participationToDelete;
        participationsManager.deleteParticipation(bandId, showId);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteParticipationModal'));
        modal.hide();
    }
}

function viewBandShows(bandId) {
    window.location.href = `participations.html?band=${bandId}`;
}

function exportParticipations(format) {
    participationsManager.exportParticipations(format);
}

function importParticipations() {
    participationsManager.importParticipations();
}

document.addEventListener('DOMContentLoaded', function() {
    participationsManager = new ParticipationsManager();
});