class AdminPanel {
    constructor() {
        this.init();
        this.users = []; //carregando da API apenas para exibição, não para manipulação real (não implementado - 19/08/2025)
    }
    
    init() {
        if (!auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        if (!auth.hasRole('admin')) {
            this.showAccessDenied();
            return;
        }
        
        this.loadSystemStats();
        this.loadSystemActivity();
        this.loadUsers();
    }
    
    showAccessDenied() {
        const modal = new bootstrap.Modal(document.getElementById('accessDeniedModal'));
        modal.show();
    }
    
    async loadSystemStats() {
        try {
            await Promise.all([
                this.loadBandsCount(),
                this.loadShowsCount(),
                this.loadParticipationsCount(),
                this.loadUsersCount()
            ]);
        } catch (error) {
            console.error('Error loading system stats:', error);
            showToast('Erro ao carregar estatísticas do sistema', 'error');
        }
    }

    async loadBandsCount() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BANDS, {
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    document.getElementById('totalBands').textContent = data.data.bandas.length || 0;
                }
            }
        } catch (error) {
            console.error('Error loading bands count:', error);
        }
    }

    async loadShowsCount() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SHOWS, {
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    document.getElementById('totalShows').textContent = data.data.shows.length || 0;
                }
            }
        } catch (error) {
            console.error('Error loading shows count:', error);
        }
    }

    async loadParticipationsCount() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.PARTICIPATIONS, {
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    document.getElementById('totalParticipations').textContent = data.data.participacoes.length || 0;
                }
            }
        } catch (error) {
            console.error('Error loading participations count:', error);
        }
    }

    async loadUsersCount() {
        try {
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.USERS, {
                headers: getDefaultHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    document.getElementById('totalUsers').textContent = data.data.usuarios.length || 0;
                }
            }
        } catch (error) {
            console.error('Error loading participations count:', error);
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
                }
            }
        } catch (error) {
            console.error('Error loading bands:', error);
        }
        
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';
        
        this.users.forEach(user => {
            const row = this.createUserRow(user);
            tbody.appendChild(row);
        });
    }
    
    createUserRow(user) {
        const row = document.createElement('tr');
        
        const roleBadgeClass = this.getRoleBadgeClass(user.role);
        const roleDisplayName = this.getRoleDisplayName(user.role);
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span class="badge ${roleBadgeClass}">${roleDisplayName}</span></td>
            <td><span class="badge bg-success">Ativo</span></td>
            <td>${Utils.formatDate(user.criado_em)}</td>
            <td>
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" class="btn btn-outline-primary" onclick="adminPanel.editUser(${user.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-outline-warning" onclick="adminPanel.toggleUserStatus(${user.id})" title="Ativar/Desativar">
                        <i class="bi bi-toggle-on"></i>
                    </button>
                    <button type="button" class="btn btn-outline-danger" onclick="adminPanel.deleteUser(${user.id})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }
    
    loadSystemActivity() {
        const activityHtml = `
            <div class="activity-item d-flex align-items-center mb-3 p-3 border-start border-primary border-4">
                <div class="activity-icon me-3">
                    <i class="bi bi-server text-success fs-4"></i>
                </div>
                <div class="activity-content flex-grow-1">
                    <h6 class="mb-1">Sistema iniciado</h6>
                    <p class="mb-1 text-muted">Servidor web iniciado com sucesso</p>
                    <small class="text-muted">Há 2 horas</small>
                </div>
            </div>
            <div class="activity-item d-flex align-items-center mb-3 p-3 border-start border-info border-4">
                <div class="activity-icon me-3">
                    <i class="bi bi-person-plus text-primary fs-4"></i>
                </div>
                <div class="activity-content flex-grow-1">
                    <h6 class="mb-1">Novo usuário registrado</h6>
                    <p class="mb-1 text-muted">Um novo usuário se registrou no sistema</p>
                    <small class="text-muted">Há 3 horas</small>
                </div>
            </div>
            <div class="activity-item d-flex align-items-center mb-3 p-3 border-start border-success border-4">
                <div class="activity-icon me-3">
                    <i class="bi bi-database text-info fs-4"></i>
                </div>
                <div class="activity-content flex-grow-1">
                    <h6 class="mb-1">Backup automático concluído</h6>
                    <p class="mb-1 text-muted">Backup diário do banco de dados realizado</p>
                    <small class="text-muted">Há 6 horas</small>
                </div>
            </div>
            <div class="activity-item d-flex align-items-center mb-3 p-3 border-start border-warning border-4">
                <div class="activity-icon me-3">
                    <i class="bi bi-music-note text-warning fs-4"></i>
                </div>
                <div class="activity-content flex-grow-1">
                    <h6 class="mb-1">Nova banda cadastrada</h6>
                    <p class="mb-1 text-muted">Uma nova banda foi adicionada ao sistema</p>
                    <small class="text-muted">Ontem</small>
                </div>
            </div>
        `;
        
        document.getElementById('systemActivity').innerHTML = activityHtml;
    }
    
    // Admin action methods
    async exportBackup() {
        try {
            showToast('Iniciando backup do sistema...', 'info');
            
            const response = await fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BACKUP, {
                headers: getDefaultHeaders()
            });
            
            if (response.ok) {
                // Create download link
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rock_api_backup_${new Date().toISOString().split('T')[0]}.sql`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                showToast('Backup realizado com sucesso!', 'success');
            } else {
                throw new Error('Erro ao realizar backup');
            }
        } catch (error) {
            console.error('Error creating backup:', error);
            showToast('Erro ao realizar backup do sistema', 'error');
        }
    }
    
    viewLogs() {
        showToast('Funcionalidade de logs em desenvolvimento', 'info');
    }
    
    systemInfo() {
        const info = `
            <strong>Sistema:</strong> Rock Manager<br>
            <strong>Versão:</strong> 1.0.0<br>
            <strong>PHP:</strong> ${navigator.userAgent}<br>
            <strong>Usuário Atual:</strong> ${auth.getUser().username}<br>
            <strong>Tipo:</strong> ${auth.getUser().role}
        `;
        
        showToast(info, 'info', 10000);
    }
    
    async exportAllData() {
        try {
            showToast('Preparando exportação de todos os dados...', 'info');

            const [bandsResponse, showsResponse, participationsResponse, membersResponse] = await Promise.allSettled([
                fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BANDS, { headers: getDefaultHeaders() }),
                fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SHOWS, { headers: getDefaultHeaders() }),
                fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.PARTICIPATIONS, { headers: getDefaultHeaders() }),
                fetch(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.BAND_MEMBERS, { headers: getDefaultHeaders() })
            ]);
            
            const allData = {
                export_date: new Date().toISOString(),
                system: 'Rock Manager',
                version: '1.0.0',
                data: {}
            };
            
            if (bandsResponse.status === 'fulfilled' && bandsResponse.value.ok) {
                const bandsData = await bandsResponse.value.json();
                allData.data.bands = bandsData.data || [];
            }
            
            if (showsResponse.status === 'fulfilled' && showsResponse.value.ok) {
                const showsData = await showsResponse.value.json();
                allData.data.shows = showsData.data || [];
            }
            
            if (participationsResponse.status === 'fulfilled' && participationsResponse.value.ok) {
                const participationsData = await participationsResponse.value.json();
                allData.data.participations = participationsData.data || [];
            }
            
            if (membersResponse.status === 'fulfilled' && membersResponse.value.ok) {
                const membersData = await membersResponse.value.json();
                allData.data.band_members = membersData.data || [];
            }
            
            const jsonData = JSON.stringify(allData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rock_api_full_export_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showToast('Exportação completa realizada com sucesso!', 'success');
        } catch (error) {
            console.error('Error exporting all data:', error);
            showToast('Erro ao exportar dados: ' + error.message, 'error');
        }
    }
    
    importData() {
        const modalHtml = `
            <div class="modal fade" id="importDataModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Importar Dados</h5>
                            <button type="button" class="btn-close btn-close-circle" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-warning">
                                <i class="bi bi-exclamation-triangle"></i>
                                <strong>Atenção:</strong> Esta operação irá importar dados para o sistema. 
                                Certifique-se de que o arquivo está no formato correto.
                            </div>
                            <div class="mb-3">
                                <label for="importFileInput" class="form-label">Selecione o arquivo:</label>
                                <input type="file" class="form-control" id="importFileInput" accept=".json,.csv,.xml">
                            </div>
                            <div class="mb-3">
                                <label for="importTypeSelect" class="form-label">Tipo de dados:</label>
                                <select class="form-select" id="importTypeSelect">
                                    <option value="bands">Bandas</option>
                                    <option value="shows">Shows</option>
                                    <option value="participations">Participações</option>
                                    <option value="members">Membros de Bandas</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="importFormatSelect" class="form-label">Formato:</label>
                                <select class="form-select" id="importFormatSelect">
                                    <option value="json">JSON</option>
                                    <option value="csv">CSV</option>
                                    <option value="xml">XML</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="adminPanel.executeImport()">
                                <i class="bi bi-upload"></i> Importar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('importDataModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('importDataModal'));
        modal.show();
    }
    
    async executeImport() {
        const fileInput = document.getElementById('importFileInput');
        const typeSelect = document.getElementById('importTypeSelect');
        const formatSelect = document.getElementById('importFormatSelect');
        
        if (!fileInput.files[0]) {
            showToast('Selecione um arquivo para importar', 'warning');
            return;
        }
        
        const file = fileInput.files[0];
        const dataType = typeSelect.value;
        const format = formatSelect.value;
        
        try {
            showToast('Importando dados...', 'info');
            
            const formData = new FormData();
            formData.append(format, file);
            
            let endpoint;
            switch (dataType) {
                case 'bands':
                    endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.BANDS_IMPORT_CSV :
                              format === 'json' ? API_CONFIG.ENDPOINTS.BANDS_IMPORT_JSON :
                              API_CONFIG.ENDPOINTS.BANDS_IMPORT_XML;
                    break;
                case 'shows':
                    endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.SHOWS_IMPORT_CSV :
                              format === 'json' ? API_CONFIG.ENDPOINTS.SHOWS_IMPORT_JSON :
                              API_CONFIG.ENDPOINTS.SHOWS_IMPORT_XML;
                    break;
                case 'participations':
                    endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.PARTICIPATIONS_IMPORT_CSV :
                              format === 'json' ? API_CONFIG.ENDPOINTS.PARTICIPATIONS_IMPORT_JSON :
                              API_CONFIG.ENDPOINTS.PARTICIPATIONS_IMPORT_XML;
                    break;
                case 'members':
                    endpoint = format === 'csv' ? API_CONFIG.ENDPOINTS.BAND_MEMBERS_IMPORT_CSV :
                              format === 'json' ? API_CONFIG.ENDPOINTS.BAND_MEMBERS_IMPORT_JSON :
                              API_CONFIG.ENDPOINTS.BAND_MEMBERS_IMPORT_XML;
                    break;
                default:
                    throw new Error('Tipo de dados não suportado');
            }
            
            const response = await fetch(API_CONFIG.BASE_URL + endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': getDefaultHeaders()['Authorization']
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showToast('Dados importados com sucesso!', 'success');
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('importDataModal'));
                modal.hide();
                
                this.loadSystemStats();
            } else {
                throw new Error(data.message || 'Erro ao importar dados');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            showToast('Erro ao importar dados: ' + error.message, 'error');
        }
    }
    
    cleanupData() {
        const modalHtml = `
            <div class="modal fade" id="cleanupDataModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-warning text-dark">
                            <h5 class="modal-title">
                                <i class="bi bi-exclamation-triangle"></i> Limpeza de Dados
                            </h5>
                            <button type="button" class="btn-close btn-close-circle" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger">
                                <i class="bi bi-exclamation-circle"></i>
                                <strong>ATENÇÃO:</strong> Esta operação removerá dados do sistema e não pode ser desfeita!
                            </div>
                            <p>Selecione quais dados deseja limpar:</p>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="cleanupParticipations">
                                <label class="form-check-label" for="cleanupParticipations">
                                    Participações órfãs (sem banda ou show válido)
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="cleanupMembers">
                                <label class="form-check-label" for="cleanupMembers">
                                    Membros órfãos (sem banda válida)
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="cleanupLogs">
                                <label class="form-check-label" for="cleanupLogs">
                                    Logs antigos (mais de 30 dias)
                                </label>
                            </div>
                            <hr>
                            <div class="form-check">
                                <input class="form-check-input text-danger" type="checkbox" id="confirmCleanup">
                                <label class="form-check-label text-danger" for="confirmCleanup">
                                    <strong>Confirmo que entendo que esta ação não pode ser desfeita</strong>
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-danger" onclick="adminPanel.executeCleanup()">
                                <i class="bi bi-trash"></i> Executar Limpeza
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('cleanupDataModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('cleanupDataModal'));
        modal.show();
    }
    
    executeCleanup() {
        const confirmCheckbox = document.getElementById('confirmCleanup');
        const cleanupParticipations = document.getElementById('cleanupParticipations').checked;
        const cleanupMembers = document.getElementById('cleanupMembers').checked;
        const cleanupLogs = document.getElementById('cleanupLogs').checked;
        
        if (!confirmCheckbox.checked) {
            showToast('Você deve confirmar que entende as consequências desta ação', 'warning');
            return;
        }
        
        if (!cleanupParticipations && !cleanupMembers && !cleanupLogs) {
            showToast('Selecione pelo menos uma opção de limpeza', 'warning');
            return;
        }
        
        showToast('Iniciando limpeza de dados...', 'info');

        //falso, apenas para visualização de como será no sistema completo.
        setTimeout(() => {
            let cleanedItems = [];
            
            if (cleanupParticipations) {
                cleanedItems.push('2 participações órfãs removidas');
            }
            
            if (cleanupMembers) {
                cleanedItems.push('1 membro órfão removido');
            }
            
            if (cleanupLogs) {
                cleanedItems.push('15 logs antigos removidos');
            }
            
            const message = `Limpeza concluída:<br>• ${cleanedItems.join('<br>• ')}`;
            showToast(message, 'success', 8000);
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('cleanupDataModal'));
            modal.hide();
            
            this.loadSystemStats();
        }, 2000);
    }
    
    editUser(userId) {
        const user = this.getUserById(userId);
        if (!user) {
            showToast('Usuário não encontrado', 'error');
            return;
        }
        
        const modalHtml = `
            <div class="modal fade" id="editUserModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Editar Usuário</h5>
                            <button type="button" class="btn-close btn-close-circle" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editUserForm">
                                <div class="mb-3">
                                    <label for="editUsername" class="form-label">Nome de Usuário</label>
                                    <input type="text" class="form-control" id="editUsername" value="${user.username}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="editEmail" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="editEmail" value="${user.email}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="editRole" class="form-label">Função</label>
                                    <select class="form-select" id="editRole" required>
                                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                                        <option value="musician" ${user.role === 'musician' ? 'selected' : ''}>Músico</option>
                                        <option value="organizador" ${user.role === 'organizador' ? 'selected' : ''}>Organizador</option>
                                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuário</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="editStatus" class="form-label">Status</label>
                                    <select class="form-select" id="editStatus">
                                        <option value="active" ${user.ativo === 1 ? 'selected' : ''}>Ativo</option>
                                        <option value="inactive" ${user.ativo !== 1 ? 'selected' : ''}>Inativo</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" onclick="adminPanel.saveUser(${userId})">
                                <i class="bi bi-save"></i> Salvar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('editUserModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
        modal.show();
    }
    
    saveUser(userId) {
        const username = document.getElementById('editUsername').value;
        const email = document.getElementById('editEmail').value;
        const role = document.getElementById('editRole').value;
        const status = document.getElementById('editStatus').value;
        
        if (!username || !email || !role) {
            showToast('Preencha todos os campos obrigatórios', 'warning');
            return;
        }
        
        showToast('Salvando alterações...', 'info');
        
        setTimeout(() => {
            showToast(`Usuário ${username} atualizado com sucesso!`, 'success');
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();
            
            this.loadUsers();
        }, 1000);
    }
    
    getUserById(userId) {
        return this.users.find(user => user.id === userId);
    }
    
    toggleUserStatus(userId) {
        const user = this.getUserById(userId);
        if (!user) {
            showToast('Usuário não encontrado', 'error');
            return;
        }
        
        const currentStatus = user.ativo === 1 ? 'ativo' : 'inativo';
        const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
        const action = newStatus === 'ativo' ? 'ativar' : 'desativar';
        
        if (confirm(`Tem certeza que deseja ${action} o usuário ${user.username}?`)) {
            showToast(`${action === 'ativar' ? 'Ativando' : 'Desativando'} usuário...`, 'info');
            
            setTimeout(() => {
                showToast(`Usuário ${user.username} ${action === 'ativar' ? 'ativado' : 'desativado'} com sucesso!`, 'success');
                this.loadUsers(); // Refresh user list
            }, 1000);
        }
    }
    
    deleteUser(userId) {
        const user = this.getUserById(userId);
        if (!user) {
            showToast('Usuário não encontrado', 'error');
            return;
        }
        
        if (user.role === 'admin') {
            showToast('Não é possível excluir usuários administradores', 'error');
            return;
        }
        
        const modalHtml = `
            <div class="modal fade" id="deleteUserModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-danger text-white">
                            <h5 class="modal-title">
                                <i class="bi bi-exclamation-triangle"></i> Confirmar Exclusão
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger">
                                <i class="bi bi-exclamation-circle"></i>
                                <strong>ATENÇÃO:</strong> Esta ação não pode ser desfeita!
                            </div>
                            <p>Tem certeza que deseja excluir o usuário <strong>${user.username}</strong>?</p>
                            <p class="text-muted">
                                Isso também removerá:
                                <ul>
                                    <li>Todas as participações em bandas</li>
                                    <li>Histórico de atividades</li>
                                    <li>Configurações personalizadas</li>
                                </ul>
                            </p>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="confirmUserDeletion">
                                <label class="form-check-label" for="confirmUserDeletion">
                                    Confirmo que entendo as consequências desta ação
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-danger" onclick="adminPanel.confirmUserDeletion(${userId})">
                                <i class="bi bi-trash"></i> Excluir Usuário
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('deleteUserModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
        modal.show();
    }
    
    confirmUserDeletion(userId) {
        const confirmCheckbox = document.getElementById('confirmUserDeletion');
        
        if (!confirmCheckbox.checked) {
            showToast('Você deve confirmar que entende as consequências desta ação', 'warning');
            return;
        }
        
        const user = this.getUserById(userId);
        
        showToast('Excluindo usuário...', 'info');
        
        setTimeout(() => {
            showToast(`Usuário ${user.username} excluído com sucesso!`, 'success');
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
            modal.hide();
            
            this.loadUsers();
        }, 1500);
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
}

let adminPanel;

document.addEventListener('DOMContentLoaded', function() {
    adminPanel = new AdminPanel();
});