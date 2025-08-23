class BandsManager {
    constructor() {
        this.bands = [];
        this.filteredBands = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortColumn = 'id';
        this.sortDirection = 'asc';
        this.searchTerm = '';
        this.genreFilter = '';
        this.countryFilter = '';
        this.editingBandId = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadBands();
        this.updateUIBasedOnAuth();
    }
    
    // atualiza UI de acordo com a autenticação
    updateUIBasedOnAuth() {
        const addBandBtn = document.getElementById('addBandBtn');
        
        if (!auth.isAuthenticated()) {
            if (addBandBtn) addBandBtn.style.display = 'none';
            return;
        }
        
        const canCreateBand = auth.canPerform('create', 'band');
        if (addBandBtn) {
            addBandBtn.style.display = canCreateBand ? 'block' : 'none';
        }
    }
    
    bindEvents() {
        const searchInput = document.getElementById('searchBands');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.filterAndDisplayBands();
            }, 300));
        }
        
        const genreFilter = document.getElementById('filterGenre');
        if (genreFilter) {
            genreFilter.addEventListener('change', (e) => {
                this.genreFilter = e.target.value;
                this.filterAndDisplayBands();
            });
        }
        
        const countryFilter = document.getElementById('filterCountry');
        if (countryFilter) {
            countryFilter.addEventListener('change', (e) => {
                this.countryFilter = e.target.value;
                this.filterAndDisplayBands();
            });
        }
        
        const pageSizeSelect = document.getElementById('pageSize');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                this.pageSize = parseInt(e.target.value);
                this.currentPage = 1;
                this.displayBands();
            });
        }
        
        const bandForm = document.getElementById('bandForm');
        if (bandForm) {
            bandForm.addEventListener('submit', (e) => this.handleBandSubmit(e));
        }
    }
    
    async loadBands() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BANDS, {
                method: 'GET',
                headers: getDefaultHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data && data.data.bandas) {
                    this.bands = data.data.bandas;
                    this.filteredBands = [...this.bands];
                    this.updateFilters();
                    this.displayBands();
                } else {
                    throw new Error(data.message || 'Erro ao carregar bandas');
                }
            } else {
                throw new Error('Erro na requisição');
            }
        } catch (error) {
            console.error('Error loading bands:', error);
            this.displayError('Erro ao carregar bandas: ' + error.message);
        }
    }
    
    updateFilters() {
        const genres = [...new Set(this.bands.map(band => band.genero).filter(Boolean))].sort();
        const countries = [...new Set(this.bands.map(band => band.pais_origem).filter(Boolean))].sort();
        
        const genreSelect = document.getElementById('filterGenre');
        if (genreSelect) {
            genreSelect.innerHTML = '<option value="">Todos os gêneros</option>';
            genres.forEach(genre => {
                genreSelect.innerHTML += `<option value="${genre}">${genre}</option>`;
            });
        }
        
        const countrySelect = document.getElementById('filterCountry');
        if (countrySelect) {
            countrySelect.innerHTML = '<option value="">Todos os países</option>';
            countries.forEach(country => {
                countrySelect.innerHTML += `<option value="${country}">${country}</option>`;
            });
        }
    }
    
    filterAndDisplayBands() {
        this.filteredBands = this.bands.filter(band => {
            const matchesSearch = !this.searchTerm || 
                band.nome.toLowerCase().includes(this.searchTerm) ||
                (band.genero && band.genero.toLowerCase().includes(this.searchTerm)) ||
                (band.pais_origem && band.pais_origem.toLowerCase().includes(this.searchTerm));
            
            const matchesGenre = !this.genreFilter || band.genero === this.genreFilter;
            const matchesCountry = !this.countryFilter || band.pais_origem === this.countryFilter;
            
            return matchesSearch && matchesGenre && matchesCountry;
        });
        
        this.currentPage = 1;
        this.displayBands();
    }
    
    displayBands() {
        const tbody = document.getElementById('bandsTableBody');
        const countElement = document.getElementById('totalBandsCount');
        
        if (!tbody) return;
        
        if (countElement) {
            countElement.textContent = `${this.filteredBands.length} banda${this.filteredBands.length !== 1 ? 's' : ''}`;
        }
        
        this.sortBands();
        
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const paginatedBands = this.filteredBands.slice(startIndex, endIndex);
        
        if (paginatedBands.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="bi bi-music-note-beamed fs-1 text-muted"></i>
                        <p class="mt-2 text-muted">Nenhuma banda encontrada</p>
                        ${this.bands.length === 0 ? '<small>Clique em "Nova Banda" para adicionar a primeira banda.</small>' : ''}
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = paginatedBands.map(band => this.createBandRow(band)).join('');
        }
        
        this.updatePagination();
    }
    
    createBandRow(band) {
        const canEdit = auth.canPerform('edit', 'band');
        const canDelete = auth.canPerform('delete', 'band');
        
        return `
            <tr class="fade-in">
                <td>${band.id}</td>
                <td>
                    <strong>${band.nome}</strong>
                </td>
                <td>
                    ${band.genero ? `<span class="badge bg-secondary">${band.genero}</span>` : '<span class="text-muted">-</span>'}
                </td>
                <td>${band.pais_origem || '<span class="text-muted">-</span>'}</td>
                <td>${band.ano_formacao || '<span class="text-muted">-</span>'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline-info" onclick="viewBandDetails(${band.id})" title="Ver detalhes">
                            <i class="bi bi-eye"></i>
                        </button>
                        ${canEdit ? `
                            <button class="btn btn-sm btn-outline-warning" onclick="editBand(${band.id})" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                        ` : ''}
                        ${canDelete ? `
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteBand(${band.id})" title="Excluir">
                                <i class="bi bi-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }

    sortBands() {
        const numericColumns = ['id', 'ano_formacao'];

        this.filteredBands.sort((a, b) => {
            const col = this.sortColumn;

            if (numericColumns.includes(col)) {
                const aNum = a[col] !== null && a[col] !== undefined ? Number(a[col]) : Number.NEGATIVE_INFINITY;
                const bNum = b[col] !== null && b[col] !== undefined ? Number(b[col]) : Number.NEGATIVE_INFINITY;
                return this.sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
            }

            // texto (case-insensitive)
            let aVal = a[col];
            let bVal = b[col];
            if (aVal == null) aVal = '';
            if (bVal == null) bVal = '';
            aVal = aVal.toString().toLowerCase();
            bVal = bVal.toString().toLowerCase();

            return this.sortDirection === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        });
    }
    
    updatePagination() {
        const pagination = document.getElementById('bandsPagination');
        if (!pagination) return;
        
        const totalPages = Math.ceil(this.filteredBands.length / this.pageSize);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHtml = '';
        
        paginationHtml += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${this.currentPage - 1})">Anterior</a>
            </li>
        `;
        
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        if (startPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>`;
            if (startPage > 2) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a></li>`;
        }
        
        paginationHtml += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="changePage(${this.currentPage + 1})">Próximo</a>
            </li>
        `;
        
        pagination.innerHTML = paginationHtml;
    }
    
    changePage(page) {
        const totalPages = Math.ceil(this.filteredBands.length / this.pageSize);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.displayBands();
    }
    
    async handleBandSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const bandData = {
            nome: formData.get('nome'),
            genero: formData.get('genero') || null,
            pais_origem: formData.get('pais_origem') || null,
            ano_formacao: formData.get('ano_formacao') ? parseInt(formData.get('ano_formacao')) : null
        };
        
        if (!this.validateBandForm(bandData)) {
            return;
        }
        
        this.setLoadingState('saveBandBtn', true);
        
        try {
            let response;
            if (this.editingBandId) {
                bandData.id = this.editingBandId;
                response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BANDS + '/' + this.editingBandId, {
                    method: 'PUT',
                    headers: getDefaultHeaders(),
                    body: JSON.stringify({ banda: bandData })
                });
            } else {
                response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BANDS, {
                    method: 'POST',
                    headers: getDefaultHeaders(),
                    body: JSON.stringify({ banda: bandData })
                });
            }
            
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    showToast(`Banda ${this.editingBandId ? 'atualizada' : 'criada'} com sucesso!`, 'success');
                    
                    const modal = bootstrap.Modal.getInstance(document.getElementById('bandModal'));
                    modal.hide();
                    
                    this.loadBands();
                } else {
                    throw new Error(result.message || 'Erro ao salvar banda');
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro na requisição');
            }
        } catch (error) {
            console.error('Error saving band:', error);
            showToast('Erro ao salvar banda: ' + error.message, 'error');
        } finally {
            this.setLoadingState('saveBandBtn', false);
        }
    }
    
    validateBandForm(bandData) {
        let isValid = true;
        
        this.clearFormErrors();
        
        if (!bandData.nome || bandData.nome.trim().length < 2) {
            this.showFormError('bandName', 'Nome da banda deve ter pelo menos 2 caracteres');
            isValid = false;
        }
        
        if (bandData.ano_formacao) {
            const currentYear = new Date().getFullYear();
            if (bandData.ano_formacao < 1900 || bandData.ano_formacao > currentYear) {
                this.showFormError('bandYear', `Ano deve estar entre 1900 e ${currentYear}`);
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
        const fields = ['bandName', 'bandGenre', 'bandCountry', 'bandYear'];
        
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
        const tbody = document.getElementById('bandsTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-danger">
                        <i class="bi bi-exclamation-circle fs-1"></i>
                        <p class="mt-2">${message}</p>
                        <button class="btn btn-outline-primary" onclick="bandsManager.loadBands()">
                            <i class="bi bi-arrow-clockwise"></i> Tentar Novamente
                        </button>
                    </td>
                </tr>
            `;
        }
    }
    
    showAddBandModal() {
        this.editingBandId = null;
        
        const form = document.getElementById('bandForm');
        if (form) form.reset();
        
        this.clearFormErrors();
        
        const modalTitle = document.getElementById('bandModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="bi bi-plus-circle"></i> Nova Banda';
        }
        
        const saveBtn = document.getElementById('saveBandBtn');
        if (saveBtn) {
            saveBtn.querySelector('.btn-text').textContent = 'Salvar';
        }
    }
    
    showEditBandModal(bandId) {
        const band = this.bands.find(b => b.id === bandId);
        if (!band) return;
        
        this.editingBandId = bandId;
        
        document.getElementById('bandId').value = band.id;
        document.getElementById('bandName').value = band.nome;
        document.getElementById('bandGenre').value = band.genero || '';
        document.getElementById('bandCountry').value = band.pais_origem || '';
        document.getElementById('bandYear').value = band.ano_formacao || '';
        
        this.clearFormErrors();
        
        const modalTitle = document.getElementById('bandModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="bi bi-pencil"></i> Editar Banda';
        }
        
        const saveBtn = document.getElementById('saveBandBtn');
        if (saveBtn) {
            saveBtn.querySelector('.btn-text').textContent = 'Atualizar';
        }
        
        const modal = new bootstrap.Modal(document.getElementById('bandModal'));
        modal.show();
    }

     viewBandDetails(bandId) {
        const band = bandsManager.bands.find(b => b.id === bandId);
        if (!band) return;

        const content = `
        <div class="row">
            <div class="col-md-6">
                <h6><i class="bi bi-person-badge"></i> Nome</h6>
                <p class="lead">${band.nome}</p>
            </div>
            <div class="col-md-6">
                <h6><i class="bi bi-music-note"></i> Gênero</h6>
                <p class="lead">${band.genero || 'Não informado'}</p>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-6">
                <h6><i class="bi bi-flag"></i> País de Origem</h6>
                <p>${band.pais_origem || 'Não informado'}</p>
            </div>
            <div class="col-md-6">
                <h6><i class="bi bi-calendar"></i> Ano de Formação</h6>
                <p>${band.ano_formacao || 'Não informado'}</p>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-12">
                <h6><i class="bi bi-hash"></i> ID da Banda</h6>
                <p>${band.id}</p>
            </div>
        </div>
    `;

        document.getElementById('bandDetailsContent').innerHTML = content;

        const modal = new bootstrap.Modal(document.getElementById('bandDetailsModal'));
        modal.show();
    }
    
    async deleteBand(bandId) {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BANDS + '/' + bandId, {
                method: 'DELETE',
                headers: getDefaultHeaders()
            });
            
            if (response.ok) {
                showToast('Banda excluída com sucesso!', 'success');
                this.loadBands();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao excluir banda');
            }
        } catch (error) {
            console.error('Error deleting band:', error);
            showToast('Erro ao excluir banda: ' + error.message, 'error');
        }
    }
    
    async exportBands(format) {
        try {
            const endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.BANDS_EXPORT_CSV :
                           format === 'json' ? API_CONFIG.ENDPOINTS.BANDS_EXPORT_JSON :
                           API_CONFIG.ENDPOINTS.BANDS_EXPORT_XML;
            
            const response = await fetch(API_CONFIG.BASE_URL + endpoint, {
                method: 'GET',
                headers: getDefaultHeaders()
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `bandas.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                showToast(`Bandas exportadas em ${format.toUpperCase()}!`, 'success');
            } else {
                throw new Error('Erro ao exportar bandas');
            }
        } catch (error) {
            console.error('Error exporting bands:', error);
            showToast('Erro ao exportar bandas: ' + error.message, 'error');
        }
    }
    
    async importBands() {
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
            
            const endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.BANDS_IMPORT_CSV :
                           format === 'json' ? API_CONFIG.ENDPOINTS.BANDS_IMPORT_JSON :
                           API_CONFIG.ENDPOINTS.BANDS_IMPORT_XML;
            
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
                    showToast('Bandas importadas com sucesso!', 'success');
                    fileInput.value = '';
                    this.loadBands();
                } else {
                    throw new Error(result.message || 'Erro ao importar bandas');
                }
            } else {
                throw new Error('Erro na requisição');
            }
        } catch (error) {
            console.error('Error importing bands:', error);
            showToast('Erro ao importar bandas: ' + error.message, 'error');
        }
    }
}

let bandsManager;

function refreshBands() {
    bandsManager.loadBands();
}

function sortBands(column) {
    if (bandsManager.sortColumn === column) {
        bandsManager.sortDirection = bandsManager.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        bandsManager.sortColumn = column;
        bandsManager.sortDirection = 'asc';
    }

    document.querySelectorAll('th[data-column]').forEach(th => {
        const icon = th.querySelector('.bi');
        if (icon) icon.className = 'bi bi-chevron-expand text-muted';
        th.removeAttribute('aria-sort');
    });

    const currentHeader = document.querySelector(`th[data-column="${column}"]`);
    if (currentHeader) {
        const icon = currentHeader.querySelector('.bi');
        if (icon) {
            icon.className = `bi bi-chevron-${bandsManager.sortDirection === 'asc' ? 'up' : 'down'} text-primary`;
        }
        currentHeader.setAttribute('aria-sort', bandsManager.sortDirection === 'asc' ? 'ascending' : 'descending');
    }

    bandsManager.displayBands();
}

function changePage(page) {
    bandsManager.changePage(page);
}

function showAddBandModal() {
    bandsManager.showAddBandModal();
}

function editBand(bandId) {
    bandsManager.showEditBandModal(bandId);
}

function deleteBand(bandId) {
    const band = bandsManager.bands.find(b => b.id === bandId);
    if (!band) return;
    
    document.getElementById('deleteBandName').textContent = band.nome;
    bandsManager.bandToDelete = bandId;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteBandModal'));
    modal.show();
}

function confirmDeleteBand() {
    if (bandsManager.bandToDelete) {
        bandsManager.deleteBand(bandsManager.bandToDelete);

        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteBandModal'));
        modal.hide();
    }
}

function viewBandDetails(bandId) {
    bandsManager.viewBandDetails(bandId);
}

function exportBands(format) {
    bandsManager.exportBands(format);
}

function importBands() {
    bandsManager.importBands();
}

document.addEventListener('DOMContentLoaded', function() {
    bandsManager = new BandsManager();
});