/**
 *
 * Objetivo: centralizar chamadas à API, padronizar headers, tratamento de erros,
 * exibição de loading e utilidades auxiliares (formatadores e validações).
 *
 *  @author Carlos Miguel, Lucas Baruel e Mario Rodrigues.
 */

class API {

    // URL base (usa o do site, no caso localhost em dev)
    static baseURL = window.location.origin; // ALTERAR EM PROD!

    /**
     * Método genérico para requisições.
     * method: verbo HTTP (GET, POST, PUT, DELETE)
     * endpoint: caminho relativo (ex.: /bands)
     * data: payload para POST/PUT
     * headers: headers adicionais opcionais
     */
    static async request(method, endpoint, data = null, headers = {}) {
        const url = `${this.baseURL}${endpoint}`;

        const config = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
                // Headers de autenticação (token etc.)
                ...Auth.getAuthHeaders(),
                ...headers
            }
        };

        // Só envia body em POST/PUT com JSON.
        if (data && ['POST', 'PUT'].includes(config.method)) {
            config.body = JSON.stringify(data);
        }

        try {
            showLoading(true); // spinner uuu
            const response = await fetch(url, config);

            // Detecta tipo de conteúdo para parse adequado.
            const contentType = response.headers.get('content-type');
            let responseData;

            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else if (contentType && contentType.includes('text/')) {
                // Envolve texto simples em objeto consistente.
                responseData = { success: true, data: await response.text() };
            } else {
                // Arquivos ou outros tipos: retorna Response cru se ok.
                if (response.ok) {
                    return response;
                } else {
                    responseData = { success: false, message: 'Request failed' };
                }
            }

            // Se o token expirou, o logout é forçado.
            if (response.status === 401) {
                Auth.logout("token_expired");
                return { success: false, message: 'Session expired' };
            }

            return responseData;
        } catch (error) {
            // Erro de rede / exceção inesperada.
            console.error(`API Error (${method} ${endpoint}):`, error);
            return {
                success: false,
                message: 'Connection error. Please try again.',
                error: error.message
            };
        } finally {
            // tchau spinner :c
            showLoading(false);
        }
    }

    // alguns atalhos para não ficar repetindo o uso do request ^^
    static async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request('GET', url);
    }

    static async post(endpoint, data) {
        return this.request('POST', endpoint, data);
    }

    static async put(endpoint, data) {
        return this.request('PUT', endpoint, data);
    }

    static async delete(endpoint) {
        return this.request('DELETE', endpoint);
    }

    // --- BANDAS --------------------------------------------------------------
    static async getBands(page = null, limit = null) {
        const params = {};
        if (page) params.page = page;
        if (limit) params.limit = limit;
        return this.get('/bands', params);
    }

    static async getBand(id) {
        return this.get(`/bands/${id}`);
    }

    static async createBand(bandData) {
        // backend espera objeto envolto em { banda: {...} }
        return this.post('/bands', { banda: bandData });
    }

    static async updateBand(id, bandData) {
        return this.put(`/bands/${id}`, { banda: bandData });
    }

    static async deleteBand(id) {
        return this.delete(`/bands/${id}`);
    }

    // --- SHOWS ---------------------------------------------------------------
    static async getShows(page = null, limit = null) {
        const params = {};
        if (page) params.page = page;
        if (limit) params.limit = limit;
        return this.get('/shows', params);
    }

    static async getShow(id) {
        return this.get(`/shows/${id}`);
    }

    static async createShow(showData) {
        return this.post('/shows', { show: showData });
    }

    static async updateShow(id, showData) {
        return this.put(`/shows/${id}`, { show: showData });
    }

    static async deleteShow(id) {
        return this.delete(`/shows/${id}`);
    }

    // --- PARTICIPAÇÕES -------------------------------------------------------
    static async getParticipations(page = null, limit = null) {
        const params = {};
        if (page) params.page = page;
        if (limit) params.limit = limit;
        return this.get('/participacoes', params);
    }

    static async getParticipation(idBanda, idShow) {
        return this.get(`/participacoes/${idBanda}/${idShow}`);
    }

    static async createParticipation(participationData) {
        return this.post('/participacoes', { participacao: participationData });
    }

    static async updateParticipation(idBanda, idShow, participationData) {
        return this.put(`/participacoes/${idBanda}/${idShow}`, { participacao: participationData });
    }

    static async deleteParticipation(idBanda, idShow) {
        return this.delete(`/participacoes/${idBanda}/${idShow}`);
    }

    // --- RELACIONAMENTOS -----------------------------------------------------
    static async getBandShows(bandId) {
        return this.get(`/bands/${bandId}/shows`);
    }

    static async getBandMembers(bandId) {
        return this.get(`/bands/${bandId}/members`);
    }

    // --- EXPORTAÇÃO DE ARQUIVOS ----------------------------------------------
    static async exportBands(format) {
        return this.downloadFile(`/bands/exportar/${format}`, `bandas.${format}`);
    }

    static async exportShows(format) {
        return this.downloadFile(`/shows/exportar/${format}`, `shows.${format}`);
    }

    static async exportParticipations(format) {
        return this.downloadFile(`/participacoes/exportar/${format}`, `participacoes.${format}`);
    }

    /**
     * Download genérico: cria link temporário e força clique.
     */
    static async downloadFile(endpoint, filename) {
        try {
            showLoading(true);
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: auth.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (error) {
            console.error('Download error:', error);
            return { success: false, message: 'Download failed' };
        } finally {
            showLoading(false);
        }
    }
}

// controla a exibição do spinner c:
function showLoading(show = true) {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        if (show) {
            spinner.classList.remove('d-none');
        } else {
            spinner.classList.add('d-none');
        }
    }
}

/**
 * Exibe toast Bootstrap reutilizável.
 * title: título do toast
 * message: corpo
 * type: info | success | warning | danger
 */
function showToast(title, message, type = 'info') {
    const toastEl = document.getElementById('liveToast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');

    if (!toastEl || !toastTitle || !toastMessage) {
        console.warn('Toast elements not found');
        return;
    }

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    // Reseta classes e aplica cor conforme tipo.
    toastEl.className = 'toast';
    if (type === 'success') {
        toastEl.classList.add('bg-success', 'text-white');
    } else if (type === 'danger' || type === 'error') {
        toastEl.classList.add('bg-danger', 'text-white');
    } else if (type === 'warning') {
        toastEl.classList.add('bg-warning', 'text-dark');
    } else {
        toastEl.classList.add('bg-info', 'text-white');
    }

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

/**
 * Tratamento centralizado de erros de API em pontos específicos.
 */
function handleApiError(error, action = 'perform action') {
    console.error('API Error:', error);

    // Caso típico de sessão expirada.
    if (error.message && error.message.includes('401')) {
        showToast('Session Expired', 'Please log in again', 'warning');
        auth.logout("token_expired");
        return;
    }

    const message = error.message || `Failed to ${action}. Please try again.`;
    showToast('Error', message, 'danger');
}

/**
 * debounce: limita a frequência de execução de uma função (ex.: busca ao digitar).
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Formatadores simples para exibição friendly.
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatNumber(number) {
    if (number === null || number === undefined) return '';
    return number.toLocaleString('pt-BR');
}

// Validações básicas reutilizáveis em formulários.
function validateRequired(value, fieldName) {
    if (!value || value.toString().trim() === '') {
        throw new Error(`${fieldName} é obrigatório`);
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
    }
}

function validateYear(year) {
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
        throw new Error(`Ano deve estar entre 1900 e ${currentYear}`);
    }
}

function validatePositiveNumber(number, fieldName) {
    if (number <= 0) {
        throw new Error(`${fieldName} deve ser um número positivo`);
    }
}