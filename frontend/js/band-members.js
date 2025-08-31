class BandMembersManager {
    constructor() {
        this.members = [];
        this.bands = [];
        this.users = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortField = 'id_usuario';
        this.sortDirection = 'asc';
        this.searchTerm = '';
        this.roleFilter = '';
        this.bandFilter = '';
        this.editingMember = null;
        this.deletingMember = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUIBasedOnAuth();
        this.loadData();
    }

    updateUIBasedOnAuth() {
        const addMemberBtn = document.getElementById('addMemberBtn');

        if (!auth.isAuthenticated()) {
            if (addMemberBtn) addMemberBtn.style.display = 'none';
            return;
        }

        const canCreate = auth.canPerform('create', 'band_member');
        if (addMemberBtn) {
            addMemberBtn.style.display = canCreate ? 'block' : 'none';
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchMembers');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(() => {
                this.searchTerm = searchInput.value;
                this.currentPage = 1;
                this.loadMembers();
            }, 300));
        }

        const roleFilter = document.getElementById('filterRole');
        if (roleFilter) {
            roleFilter.addEventListener('change', () => {
                this.roleFilter = roleFilter.value;
                this.currentPage = 1;
                this.loadMembers();
            });
        }

        const bandFilter = document.getElementById('filterBand');
        if (bandFilter) {
            bandFilter.addEventListener('change', () => {
                this.bandFilter = bandFilter.value;
                this.currentPage = 1;
                this.loadMembers();
            });
        }

        const pageSize = document.getElementById('pageSize');
        if (pageSize) {
            pageSize.addEventListener('change', () => {
                this.pageSize = parseInt(pageSize.value);
                this.currentPage = 1;
                this.loadMembers();
            });
        }

        const memberModal = document.getElementById('memberModal');
        if (memberModal) {
            memberModal.addEventListener('hidden.bs.modal', () => {
                this.resetForm();
            });
        }
    }

    async loadData() {
        try {
            await this.loadBands();
            await this.loadUsers();
            await this.loadMembers();
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Erro ao carregar dados iniciais', 'error');
        }
    }

    async loadMembers() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BAND_MEMBERS, {
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    this.members = data.data.members;
                    this.filterAndDisplayMembers();
                } else {
                    throw new Error(data.message || 'Erro ao carregar membros');
                }
            } else {
                throw new Error('Erro na requisição');
            }
        } catch (error) {
            console.error('Error loading members:', error);
            this.showError('Erro ao carregar membros: ' + error.message);
        }
    }

    async loadBands() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BANDS, {
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    this.bands = data.data.bandas;
                    this.populateBandSelects();
                }
            }
        } catch (error) {
            console.error('Error loading bands:', error);
        }
    }

    async loadUsers() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.USERS, {
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    this.users = data.data.usuarios;
                    this.populateBandSelects();
                }
            }
        } catch (error) {
            console.error('Error loading bands:', error);
        }
        this.populateUserSelects();
    }

    populateBandSelects() {
        const selects = ['bandId', 'filterBand'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const firstOption = select.querySelector('option');
                select.innerHTML = '';
                if (firstOption) {
                    select.appendChild(firstOption);
                }

                this.bands.forEach(band => {
                    const option = document.createElement('option');
                    option.value = band.id;
                    option.textContent = band.nome;
                    select.appendChild(option);
                });
            }
        });
    }

    populateUserSelects() {
        const select = document.getElementById('userId');
        if (select) {
            const firstOption = select.querySelector('option');
            select.innerHTML = '';
            if (firstOption) {
                select.appendChild(firstOption);
            }

            this.users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.username} (${user.email})`;
                select.appendChild(option);
            });
        }
    }

    filterAndDisplayMembers() {
        let filteredMembers = [...this.members];

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filteredMembers = filteredMembers.filter(member => {
                const userName = this.getUserName(member.id_usuario).toLowerCase();
                const bandName = this.getBandName(member.id_banda).toLowerCase();
                const role = member.funcao.toLowerCase();
                return userName.includes(term) || bandName.includes(term) || role.includes(term);
            });
        }

        if (this.roleFilter) {
            filteredMembers = filteredMembers.filter(member => member.funcao === this.roleFilter);
        }

        if (this.bandFilter) {
            filteredMembers = filteredMembers.filter(member => member.id_banda == this.bandFilter);
        }

        filteredMembers.sort((a, b) => {
            let aValue = a[this.sortField];
            let bValue = b[this.sortField];

            if (this.sortField === 'username') {
                aValue = this.getUserName(a.id_usuario);
                bValue = this.getUserName(b.id_usuario);
            } else if (this.sortField === 'banda_nome') {
                aValue = this.getBandName(a.id_banda);
                bValue = this.getBandName(b.id_banda);
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (this.sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        const totalMembers = filteredMembers.length;
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageMembers = filteredMembers.slice(startIndex, endIndex);

        this.displayMembers(pageMembers);
        this.displayPagination(totalMembers);
        this.updateMembersCount(totalMembers);
    }

    displayMembers(members) {
        const tbody = document.getElementById('membersTableBody');
        if (!tbody) return;

        const canCreate = typeof auth !== 'undefined' && auth.isAuthenticated() && auth.canPerform('create', 'band_member');

        if (members.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <i class="bi bi-inbox fs-1 text-muted"></i>
                        <p class="mt-2 text-muted">Nenhum membro encontrado</p>
                        ${canCreate ? `
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#memberModal">
                            <i class="bi bi-plus"></i> Adicionar Primeiro Membro
                        </button>` : ''}
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = members.map(member => this.createMemberRow(member)).join('');
    }

    createMemberRow(member) {
        const userName = this.getUserName(member.id_usuario);
        const bandName = this.getBandName(member.id_banda);
        const roleBadge = this.getRoleBadge(member.funcao);

        const canEdit = typeof auth !== 'undefined' && auth.isAuthenticated() && auth.canPerform('edit', 'band_member');
        const canDelete = typeof auth !== 'undefined' && auth.isAuthenticated() && auth.canPerform('delete', 'band_member');

        const actionButtons = (canEdit || canDelete) ? `
            <div class="btn-group btn-group-sm" role="group">
                ${canEdit ? `
                <button type="button" class="btn btn-outline-warning" onclick="bandMembers.editMember(${member.id_usuario}, ${member.id_banda})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>` : ''}
                ${canDelete ? `
                <button type="button" class="btn btn-outline-danger" onclick="bandMembers.deleteMember(${member.id_usuario}, ${member.id_banda})" title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>` : ''}
            </div>` : '';

        return `
            <tr>
                <td>${member.id_usuario}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-person-circle fs-4 text-primary me-2"></i>
                        <div>
                            <div class="fw-bold">${userName}</div>
                            <small class="text-muted">${this.getUserEmail(member.id_usuario)}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-people fs-4 text-info me-2"></i>
                        <span>${bandName}</span>
                    </div>
                </td>
                <td>${roleBadge}</td>
                <td>${actionButtons}</td>
            </tr>
        `;
    }

    getRoleBadge(role) {
        const badges = {
            'vocalista': {class: 'bg-primary', label: 'Vocalista'},
            'guitarrista': {class: 'bg-success', label: 'Guitarrista'},
            'baixista': {class: 'bg-indigo', label: 'Baixista'},
            'baterista': {class: 'bg-warning text-dark', label: 'Baterista'},
            'tecladista': {class: 'bg-secondary', label: 'Tecladista'},
            'outro': {class: 'bg-dark', label: 'Outro'}
        };

        if (role.includes('/')) {
            const parts = role.split('/');
            if (badges[parts[0]] && badges[parts[1]]) {
                return `<span class="badge ${badges[parts[0]].class}">${badges[parts[0]].label} / ${badges[parts[1]].label}</span>`;
            }
        }
        if (badges[role]) {
            return `<span class="badge ${badges[role].class}">${badges[role].label}</span>`;
        }
        return `<span class="badge bg-dark text-light">${role}</span>`;
    }

    getUserName(userId) {
        const user = this.users.find(u => u.id == userId);
        return user ? user.username : `Usuário ${userId}`;
    }

    getUserEmail(userId) {
        const user = this.users.find(u => u.id == userId);
        return user ? user.email : '';
    }

    getBandName(bandId) {
        const band = this.bands.find(b => b.id == bandId);
        return band ? band.nome : `Banda ${bandId}`;
    }

    displayPagination(totalItems) {
        const pagination = document.getElementById('membersPagination');
        if (!pagination) return;

        const totalPages = Math.ceil(totalItems / this.pageSize);
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHtml = '';

        paginationHtml += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="bandMembers.goToPage(${this.currentPage - 1})">Anterior</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHtml += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="bandMembers.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHtml += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        paginationHtml += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="bandMembers.goToPage(${this.currentPage + 1})">Próximo</a>
            </li>
        `;

        pagination.innerHTML = paginationHtml;
    }

    updateMembersCount(count) {
        const countElement = document.getElementById('membersCount');
        if (countElement) {
            countElement.textContent = `${count} ${count === 1 ? 'membro' : 'membros'}`;
        }
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.members.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.filterAndDisplayMembers();
        }
    }

    sortBy(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        this.filterAndDisplayMembers();
    }

    resetForm() {
        const form = document.getElementById('memberForm');
        if (form) {
            form.reset();
            form.classList.remove('was-validated');
        }

        this.editingMember = null;

        const modalTitle = document.getElementById('memberModalTitle');
        if (modalTitle) {
            modalTitle.textContent = 'Novo Membro';
        }

        const saveButton = document.getElementById('saveButtonText');
        if (saveButton) {
            saveButton.textContent = 'Salvar';
        }
    }

    editMember(userId, bandId) {
        const member = this.members.find(m => m.id_usuario == userId && m.id_banda == bandId);
        if (!member) return;

        this.editingMember = {userId, bandId};

        document.getElementById('userId').value = member.id_usuario;
        document.getElementById('bandId').value = member.id_banda;
        document.getElementById('role').value = member.funcao;

        const modalTitle = document.getElementById('memberModalTitle');
        if (modalTitle) {
            modalTitle.textContent = 'Editar Membro';
        }

        const saveButton = document.getElementById('saveButtonText');
        if (saveButton) {
            saveButton.textContent = 'Atualizar';
        }

        const modal = new bootstrap.Modal(document.getElementById('memberModal'));
        modal.show();
    }

    async saveMember() {
        const form = document.getElementById('memberForm');
        if (!form) return;

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const userId = document.getElementById('userId').value;
        const bandId = document.getElementById('bandId').value;
        const role = document.getElementById('role').value;

        const memberData = {
            usuario_banda: {
                id_usuario: parseInt(userId),
                id_banda: parseInt(bandId),
                funcao: role
            }
        };

        try {
            this.setLoading(true, 'save');

            let url, method;
            if (this.editingMember) {
                url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BAND_MEMBERS}/${this.editingMember.userId}/${this.editingMember.bandId}`;
                method = 'PUT';
            } else {
                url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BAND_MEMBERS;
                method = 'POST';
            }

            const response = await fetch(url, {
                method: method,
                headers: getDefaultHeaders(),
                body: JSON.stringify(memberData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showToast(this.editingMember ? 'Membro atualizado com sucesso!' : 'Membro adicionado com sucesso!', 'success');

                const modal = bootstrap.Modal.getInstance(document.getElementById('memberModal'));
                modal.hide();

                await this.loadMembers();
            } else {
                throw new Error(data.message || 'Erro ao salvar membro');
            }
        } catch (error) {
            console.error('Error saving member:', error);
            showToast('Erro ao salvar membro: ' + error.message, 'error');
        } finally {
            this.setLoading(false, 'save');
        }
    }

    deleteMember(userId, bandId) {
        const member = this.members.find(m => m.id_usuario == userId && m.id_banda == bandId);
        if (!member) return;

        this.deletingMember = {userId, bandId};

        document.getElementById('deleteUserName').textContent = this.getUserName(userId);
        document.getElementById('deleteBandName').textContent = this.getBandName(bandId);

        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    async confirmDelete() {
        if (!this.deletingMember) return;

        try {
            this.setLoading(true, 'delete');

            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BAND_MEMBERS}/${this.deletingMember.userId}/${this.deletingMember.bandId}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                showToast('Membro removido com sucesso!', 'success');

                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                modal.hide();

                await this.loadMembers();
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Erro ao remover membro');
            }
        } catch (error) {
            console.error('Error deleting member:', error);
            showToast('Erro ao remover membro: ' + error.message, 'error');
        } finally {
            this.setLoading(false, 'delete');
            this.deletingMember = null;
        }
    }

    async exportMembers(format) {
        try {
            showToast(`Exportando membros em ${format.toUpperCase()}...`, 'info');

            const endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.BANDS_EXPORT_CSV :
                format === 'json' ? API_CONFIG.ENDPOINTS.BANDS_EXPORT_JSON :
                    API_CONFIG.ENDPOINTS.BANDS_EXPORT_XML;

            const url = API_CONFIG.BASE_URL + endpoint.replace('/bands/', '/bands/members/');

            const response = await fetch(url, {
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `membros_bandas.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(downloadUrl);

                showToast(`Membros exportados em ${format.toUpperCase()}!`, 'success');
            } else {
                throw new Error('Erro ao exportar membros');
            }
        } catch (error) {
            console.error('Error exporting members:', error);
            showToast('Erro ao exportar membros: ' + error.message, 'error');
        }
    }

    async importMembers() {
        const fileInput = document.getElementById('importFile');
        const formatSelect = document.getElementById('importFormat');

        if (!fileInput.files[0]) {
            showToast('Selecione um arquivo para importar', 'warning');
            return;
        }

        const format = formatSelect.value;
        const file = fileInput.files[0];

        const formData = new FormData();
        formData.append(format, file);

        try {
            showToast('Importando membros...', 'info');

            const endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.BANDS_IMPORT_CSV :
                format === 'json' ? API_CONFIG.ENDPOINTS.BANDS_IMPORT_JSON :
                    format === 'xml' ? API_CONFIG.ENDPOINTS.BANDS_IMPORT_XML :
                        API_CONFIG.ENDPOINTS.BANDS_IMPORT_JSON;

            const url = API_CONFIG.BASE_URL + endpoint.replace('/bands/', '/bands/members/');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': getDefaultHeaders()['Authorization']
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showToast('Membros importados com sucesso!', 'success');
                fileInput.value = '';
                await this.loadMembers();
            } else {
                throw new Error(data.message || 'Erro ao importar membros');
            }
        } catch (error) {
            console.error('Error importing members:', error);
            showToast('Erro ao importar membros: ' + error.message, 'error');
        }
    }

    setLoading(loading, type) {
        const button = type === 'save' ? 'saveButtonText' : 'deleteButtonText';
        const spinner = type === 'save' ? 'saveSpinner' : 'deleteSpinner';

        const buttonElement = document.getElementById(button);
        const spinnerElement = document.getElementById(spinner);

        if (buttonElement && spinnerElement) {
            if (loading) {
                buttonElement.classList.add('d-none');
                spinnerElement.classList.remove('d-none');
            } else {
                buttonElement.classList.remove('d-none');
                spinnerElement.classList.add('d-none');
            }
        }
    }

    showError(message) {
        const tbody = document.getElementById('membersTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4">
                        <i class="bi bi-exclamation-triangle fs-1 text-danger"></i>
                        <p class="mt-2 text-danger">${message}</p>
                        <button type="button" class="btn btn-outline-primary" onclick="bandMembers.loadMembers()">
                            <i class="bi bi-arrow-clockwise"></i> Tentar Novamente
                        </button>
                    </td>
                </tr>
            `;
        }
    }
}

function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.querySelector('.toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');

    if (toastContainer && toastTitle && toastBody) {
        toastContainer.className = `toast hide border-${type === 'error' ? 'danger' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'}`;

        toastTitle.textContent = type === 'error' ? 'Erro' : type === 'success' ? 'Sucesso' : type === 'warning' ? 'Atenção' : 'Informação';
        toastBody.innerHTML = message;

        const toast = new bootstrap.Toast(toastContainer, {delay: duration});
        toast.show();
    }
}

let bandMembers;

document.addEventListener('DOMContentLoaded', function () {
    bandMembers = new BandMembersManager();
});