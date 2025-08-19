class ShowsManager {
    constructor() {
        this.shows = [];
        this.filteredShows = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortColumn = 'data';
        this.sortDirection = 'desc';
        this.searchTerm = '';
        this.localFilter = '';
        this.dateFilter = '';
        this.editingShowId = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadShows();
        this.updateUIBasedOnAuth();
        this.setMinDate();
    }
    
    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        const showDateInput = document.getElementById('showDate');
        if (showDateInput) {
            showDateInput.min = today;
        }
    }
    
    updateUIBasedOnAuth() {
        const addShowBtn = document.getElementById('addShowBtn');
        
        if (!auth.isAuthenticated()) {
            if (addShowBtn) addShowBtn.style.display = 'none';
            return;
        }
        
        const canCreateShow = auth.canPerform('create', 'show');
        if (addShowBtn) {
            addShowBtn.style.display = canCreateShow ? 'block' : 'none';
        }
    }
    
    bindEvents() {
        const searchInput = document.getElementById('searchShows');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterAndDisplayShows();
            }, 300));
        }
        
        const localFilter = document.getElementById('filterLocal');
        if (localFilter) {
            localFilter.addEventListener('change', (e) => {
                this.localFilter = e.target.value;
                this.filterAndDisplayShows();
            });
        }
        
        const dateFilter = document.getElementById('filterDate');
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.dateFilter = e.target.value;
                this.filterAndDisplayShows();
            });
        }
        
        const pageSizeSelect = document.getElementById('pageSize');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                this.pageSize = parseInt(e.target.value);
                this.currentPage = 1;
                this.displayShows();
            });
        }
        
        const showForm = document.getElementById('showForm');
        if (showForm) {
            showForm.addEventListener('submit', (e) => this.handleShowSubmit(e));
        }
    }
    
    async loadShows() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SHOWS, {
                method: 'GET',
                headers: getDefaultHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.shows) {
                    this.shows = data.data.shows;
                    this.filteredShows = [...this.shows];
                    this.updateFilters();
                    this.displayShows();
                } else {
                    throw new Error(data.message || 'Erro ao carregar shows');
                }
            } else {
                throw new Error('Erro na requisição');
            }
        } catch (error) {
            console.error('Error loading shows:', error);
            this.displayError('Erro ao carregar shows: ' + error.message);
        }
    }
    
    updateFilters() {
        const locals = [...new Set(this.shows.map(show => show.local).filter(Boolean))].sort();
        
        const localSelect = document.getElementById('filterLocal');
        if (localSelect) {
            localSelect.innerHTML = '<option value="">Todos os locais</option>';
            locals.forEach(local => {
                localSelect.innerHTML += `<option value="${local}">${local}</option>`;
            });
        }
    }
    
    filterAndDisplayShows() {
        this.filteredShows = this.shows.filter(show => {
            const matchesSearch = !this.searchTerm || 
                show.local.toLowerCase().includes(this.searchTerm) ||
                (show.data && show.data.toLowerCase().includes(this.searchTerm));
            
            const matchesLocal = !this.localFilter || show.local === this.localFilter;
            
            const matchesDate = !this.dateFilter || (show.data && show.data.startsWith(this.dateFilter));
            
            return matchesSearch && matchesLocal && matchesDate;
        });
        
        this.currentPage = 1;
        this.displayShows();
    }
    
    displayShows() {
        const tbody = document.getElementById('showsTableBody');
        const countElement = document.getElementById('totalShowsCount');
        
        if (!tbody) return;
        
        if (countElement) {
            countElement.textContent = `${this.filteredShows.length} show${this.filteredShows.length !== 1 ? 's' : ''}`;
        }
        
        this.sortShows();
        
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const paginatedShows = this.filteredShows.slice(startIndex, endIndex);
        
        if (paginatedShows.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="bi bi-calendar-event fs-1 text-muted"></i>
                        <p class="mt-2 text-muted">Nenhum show encontrado</p>
                        ${this.shows.length === 0 ? '<small>Clique em "Novo Show" para adicionar o primeiro show.</small>' : ''}
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = paginatedShows.map(show => this.createShowRow(show)).join('');
        }
        
        this.updatePagination();
    }
    
    createShowRow(show) {
        const canEdit = auth.canPerform('edit', 'show');
        const canDelete = auth.canPerform('delete', 'show');
        
        const showDate = new Date(show.data);
        const today = new Date();
        const isPast = showDate < today;
        const isToday = showDate.toDateString() === today.toDateString();
        const isFuture = showDate > today;
        
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
                <td>${show.id}</td>
                <td>
                    <strong>${show.local}</strong>
                </td>
                <td>
                    ${Utils.formatDate(show.data)}
                    ${isToday ? '<i class="bi bi-clock text-warning ms-1" title="Show hoje!"></i>' : ''}
                </td>
                <td>
                    ${show.publico_estimado ? 
                        `<span class="badge bg-info">${show.publico_estimado.toLocaleString()}</span>` : 
                        '<span class="text-muted">-</span>'
                    }
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline-info" onclick="viewShowDetails(${show.id})" title="Ver detalhes">
                            <i class="bi bi-eye"></i>
                        </button>
                        ${canEdit ? `
                            <button class="btn btn-sm btn-outline-warning" onclick="editShow(${show.id})" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                        ` : ''}
                        ${canDelete ? `
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteShow(${show.id})" title="Excluir">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : ''}
                        <button class="btn btn-sm btn-outline-primary" onclick="viewShowParticipations(${show.id})" title="Ver participações">
                            <i class="bi bi-people"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    sortShows() {
        this.filteredShows.sort((a, b) => {
            let aValue = a[this.sortColumn];
            let bValue = b[this.sortColumn];
            
            if (aValue == null) aValue = '';
            if (bValue == null) bValue = '';
            
            if (this.sortColumn === 'data') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else if (this.sortColumn === 'publico_estimado') {
                aValue = parseInt(aValue) || 0;
                bValue = parseInt(bValue) || 0;
            } else {
                aValue = aValue.toString().toLowerCase();
                bValue = bValue.toString().toLowerCase();
            }
            
            if (this.sortDirection === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });
    }
    
    updatePagination() {
        const pagination = document.getElementById('showsPagination');
        if (!pagination) return;
        
        const totalPages = Math.ceil(this.filteredShows.length / this.pageSize);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHtml = '';
        
        paginationHtml += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeShowsPage(${this.currentPage - 1})">Anterior</a>
            </li>
        `;
        
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changeShowsPage(1)">1</a></li>`;
            if (startPage > 2) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changeShowsPage(${i})">${i}</a>
                </li>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changeShowsPage(${totalPages})">${totalPages}</a></li>`;
        }
        
        paginationHtml += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changeShowsPage(${this.currentPage + 1})">Próximo</a>
            </li>
        `;
        
        pagination.innerHTML = paginationHtml;
    }
    
    changeShowsPage(page) {
        const totalPages = Math.ceil(this.filteredShows.length / this.pageSize);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.displayShows();
    }
    
    async handleShowSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const showData = {
            local: formData.get('local'),
            data: formData.get('data'),
            publico_estimado: formData.get('publico_estimado') ? parseInt(formData.get('publico_estimado')) : null
        };
        
        if (!this.validateShowForm(showData)) {
            return;
        }
        
        this.setLoadingState('saveShowBtn', true);
        
        try {
            let response;
            if (this.editingShowId) {
                showData.id = this.editingShowId;
                response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SHOWS + '/' + this.editingShowId, {
                    method: 'PUT',
                    headers: getDefaultHeaders(),
                    body: JSON.stringify({ show: showData })
                });
            } else {
                response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SHOWS, {
                    method: 'POST',
                    headers: getDefaultHeaders(),
                    body: JSON.stringify({ show: showData })
                });
            }
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    showToast(`Show ${this.editingShowId ? 'atualizado' : 'criado'} com sucesso!`, 'success');
                    
                    const modal = bootstrap.Modal.getInstance(document.getElementById('showModal'));
                    modal.hide();
                    
                    this.loadShows();
                } else {
                    throw new Error(result.message || 'Erro ao salvar show');
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro na requisição');
            }
        } catch (error) {
            console.error('Error saving show:', error);
            showToast('Erro ao salvar show: ' + error.message, 'error');
        } finally {
            this.setLoadingState('saveShowBtn', false);
        }
    }
    
    validateShowForm(showData) {
        let isValid = true;
        
        this.clearFormErrors();
        
        if (!showData.local || showData.local.trim().length < 3) {
            this.showFormError('showLocal', 'Local deve ter pelo menos 3 caracteres');
            isValid = false;
        }
        
        if (!showData.data) {
            this.showFormError('showDate', 'Data é obrigatória');
            isValid = false;
        } else {
            const showDate = new Date(showData.data);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (showDate < today) {
                this.showFormError('showDate', 'Data não pode ser no passado');
                isValid = false;
            }
        }
        
        if (showData.publico_estimado && showData.publico_estimado < 1) {
            this.showFormError('showAudience', 'Público estimado deve ser maior que zero');
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
    
    clearFormErrors() {
        const fields = ['showLocal', 'showDate', 'showAudience'];
        
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
        const tbody = document.getElementById('showsTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-danger">
                        <i class="bi bi-exclamation-circle fs-1"></i>
                        <p class="mt-2">${message}</p>
                        <button class="btn btn-outline-success" onclick="showsManager.loadShows()">
                            <i class="bi bi-arrow-clockwise"></i> Tentar Novamente
                        </button>
                    </td>
                </tr>
            `;
        }
    }
    
    showAddShowModal() {
        this.editingShowId = null;
        
        const form = document.getElementById('showForm');
        if (form) form.reset();
        
        this.clearFormErrors();
        
        this.setMinDate();
        
        const modalTitle = document.getElementById('showModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="bi bi-plus-circle"></i> Novo Show';
        }
        
        const saveBtn = document.getElementById('saveShowBtn');
        if (saveBtn) {
            saveBtn.querySelector('.btn-text').textContent = 'Salvar';
        }
    }
    
    showEditShowModal(showId) {
        const show = this.shows.find(s => s.id === showId);
        if (!show) return;
        
        this.editingShowId = showId;
        
        document.getElementById('showId').value = show.id;
        document.getElementById('showLocal').value = show.local;
        document.getElementById('showDate').value = Utils.formatDateForInput(show.data);
        document.getElementById('showAudience').value = show.publico_estimado || '';
        
        this.clearFormErrors();
        
        const modalTitle = document.getElementById('showModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="bi bi-pencil"></i> Editar Show';
        }
        
        const saveBtn = document.getElementById('saveShowBtn');
        if (saveBtn) {
            saveBtn.querySelector('.btn-text').textContent = 'Atualizar';
        }
        
        const modal = new bootstrap.Modal(document.getElementById('showModal'));
        modal.show();
    }
    
    async deleteShow(showId) {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SHOWS + '/' + showId, {
                method: 'DELETE',
                headers: getDefaultHeaders()
            });
            
            if (response.ok) {
                showToast('Show excluído com sucesso!', 'success');
                this.loadShows();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao excluir show');
            }
        } catch (error) {
            console.error('Error deleting show:', error);
            showToast('Erro ao excluir show: ' + error.message, 'error');
        }
    }
    
    viewShowDetails(showId) {
        const show = this.shows.find(s => s.id === showId);
        if (!show) return;
        
        const showDate = new Date(show.data);
        const today = new Date();
        const isPast = showDate < today;
        const isToday = showDate.toDateString() === today.toDateString();
        
        let statusInfo = '';
        if (isPast) {
            statusInfo = '<span class="badge bg-secondary">Show realizado</span>';
        } else if (isToday) {
            statusInfo = '<span class="badge bg-warning">Show hoje!</span>';
        } else {
            const daysUntil = Math.ceil((showDate - today) / (1000 * 60 * 60 * 24));
            statusInfo = `<span class="badge bg-success">Em ${daysUntil} dia${daysUntil !== 1 ? 's' : ''}</span>`;
        }
        
        const content = `
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="bi bi-geo-alt"></i> Local</h6>
                    <p class="lead">${show.local}</p>
                </div>
                <div class="col-md-6">
                    <h6><i class="bi bi-calendar"></i> Data</h6>
                    <p class="lead">${Utils.formatDate(show.data)} ${statusInfo}</p>
                </div>
            </div>
            
            <hr>
            
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="bi bi-people"></i> Público Estimado</h6>
                    <p>${show.publico_estimado ? show.publico_estimado.toLocaleString() + ' pessoas' : 'Não informado'}</p>
                </div>
                <div class="col-md-6">
                    <h6><i class="bi bi-hash"></i> ID do Show</h6>
                    <p>${show.id}</p>
                </div>
            </div>
            
            <div class="mt-3">
                <button class="btn btn-primary" onclick="viewShowParticipations(${show.id})">
                    <i class="bi bi-people"></i> Ver Participações
                </button>
            </div>
        `;
        
        document.getElementById('showDetailsContent').innerHTML = content;
        
        const modal = new bootstrap.Modal(document.getElementById('showDetailsModal'));
        modal.show();
    }
    
    async exportShows(format) {
        try {
            const endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.SHOWS_EXPORT_CSV :
                           format === 'json' ? API_CONFIG.ENDPOINTS.SHOWS_EXPORT_JSON :
                           API_CONFIG.ENDPOINTS.SHOWS_EXPORT_XML;
            
            const response = await fetch(API_CONFIG.BASE_URL + endpoint, {
                method: 'GET',
                headers: getDefaultHeaders()
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `shows.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                showToast(`Shows exportados em ${format.toUpperCase()}!`, 'success');
            } else {
                throw new Error('Erro ao exportar shows');
            }
        } catch (error) {
            console.error('Error exporting shows:', error);
            showToast('Erro ao exportar shows: ' + error.message, 'error');
        }
    }
    
    async importShows() {
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
            formData.append(format, file);  // Use format as key (csv, json, xml)
            
            const endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.SHOWS_IMPORT_CSV :
                           format === 'json' ? API_CONFIG.ENDPOINTS.SHOWS_IMPORT_JSON :
                           API_CONFIG.ENDPOINTS.SHOWS_IMPORT_XML;
            
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
                    showToast('Shows importados com sucesso!', 'success');
                    fileInput.value = '';
                    this.loadShows();
                } else {
                    throw new Error(result.message || 'Erro ao importar shows');
                }
            } else {
                throw new Error('Erro na requisição');
            }
        } catch (error) {
            console.error('Error importing shows:', error);
            showToast('Erro ao importar shows: ' + error.message, 'error');
        }
    }
}

let showsManager;

function refreshShows() {
    showsManager.loadShows();
}

function sortShows(column) {
    if (showsManager.sortColumn === column) {
        showsManager.sortDirection = showsManager.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        showsManager.sortColumn = column;
        showsManager.sortDirection = 'asc';
    }
    
    document.querySelectorAll('th .bi').forEach(icon => {
        icon.className = 'bi bi-chevron-expand text-muted';
    });
    
    const currentHeader = document.querySelector(`th[onclick="sortShows('${column}')"] .bi`);
    if (currentHeader) {
        currentHeader.className = `bi bi-chevron-${showsManager.sortDirection === 'asc' ? 'up' : 'down'} text-primary`;
    }
    
    showsManager.displayShows();
}

function changeShowsPage(page) {
    showsManager.changeShowsPage(page);
}

function showAddShowModal() {
    showsManager.showAddShowModal();
}

function editShow(showId) {
    showsManager.showEditShowModal(showId);
}

function deleteShow(showId) {
    const show = showsManager.shows.find(s => s.id === showId);
    if (!show) return;
    
    document.getElementById('deleteShowLocal').textContent = show.local;
    showsManager.showToDelete = showId;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteShowModal'));
    modal.show();
}

function confirmDeleteShow() {
    if (showsManager.showToDelete) {
        showsManager.deleteShow(showsManager.showToDelete);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteShowModal'));
        modal.hide();
    }
}

function viewShowDetails(showId) {
    showsManager.viewShowDetails(showId);
}

function viewShowParticipations(showId) {
    window.location.href = `participations.html?show=${showId}`;
}

function exportShows(format) {
    showsManager.exportShows(format);
}

function importShows() {
    showsManager.importShows();
}

document.addEventListener('DOMContentLoaded', function() {
    showsManager = new ShowsManager();
});