// API Communication Module
class API {
    static baseURL = window.location.origin;

    static async request(method, endpoint, data = null, headers = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            method: method.toUpperCase(),
            headers: {
                'Content-Type': 'application/json',
                ...Auth.getAuthHeaders(),
                ...headers
            }
        };

        if (data && ['POST', 'PUT'].includes(config.method)) {
            config.body = JSON.stringify(data);
        }

        try {
            showLoading(true);
            const response = await fetch(url, config);
            
            // Handle different content types
            const contentType = response.headers.get('content-type');
            let responseData;
            
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else if (contentType && contentType.includes('text/')) {
                responseData = { success: true, data: await response.text() };
            } else {
                // Handle binary responses (downloads)
                if (response.ok) {
                    return response; // Return raw response for downloads
                } else {
                    responseData = { success: false, message: 'Request failed' };
                }
            }

            // Handle authentication errors
            if (response.status === 401) {
                Auth.logout();
                return { success: false, message: 'Session expired' };
            }

            return responseData;
        } catch (error) {
            console.error(`API Error (${method} ${endpoint}):`, error);
            return {
                success: false,
                message: 'Connection error. Please try again.',
                error: error.message
            };
        } finally {
            showLoading(false);
        }
    }

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

    // Specific API endpoints
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
        return this.post('/bands', { banda: bandData });
    }

    static async updateBand(id, bandData) {
        return this.put(`/bands/${id}`, { banda: bandData });
    }

    static async deleteBand(id) {
        return this.delete(`/bands/${id}`);
    }

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

    static async getBandShows(bandId) {
        return this.get(`/bands/${bandId}/shows`);
    }

    static async getBandMembers(bandId) {
        return this.get(`/bands/${bandId}/members`);
    }

    // Export functions
    static async exportBands(format) {
        return this.downloadFile(`/bands/exportar/${format}`, `bandas.${format}`);
    }

    static async exportShows(format) {
        return this.downloadFile(`/shows/exportar/${format}`, `shows.${format}`);
    }

    static async exportParticipations(format) {
        return this.downloadFile(`/participacoes/exportar/${format}`, `participacoes.${format}`);
    }

    static async downloadFile(endpoint, filename) {
        try {
            showLoading(true);
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: Auth.getAuthHeaders()
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

// Loading indicator functions
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

// Toast notification function
function showToast(title, message, type = 'info') {
    const toastEl = document.getElementById('liveToast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toastEl || !toastTitle || !toastMessage) {
        console.warn('Toast elements not found');
        return;
    }
    
    // Set toast content
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Remove existing background classes and add new one
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
    
    // Show toast
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Error handler
function handleApiError(error, action = 'perform action') {
    console.error('API Error:', error);
    
    if (error.message && error.message.includes('401')) {
        showToast('Session Expired', 'Please log in again', 'warning');
        Auth.logout();
        return;
    }
    
    const message = error.message || `Failed to ${action}. Please try again.`;
    showToast('Error', message, 'danger');
}

// Debounce function for search
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

// Format date function
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Format number function
function formatNumber(number) {
    if (number === null || number === undefined) return '';
    return number.toLocaleString('pt-BR');
}

// Validation helpers
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