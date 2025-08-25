const API_CONFIG = {
    BASE_URL: window.location.origin,
    ENDPOINTS: {
        // autenticação
        LOGIN: '/login',
        REGISTER: '/register',
        
        // bandas
        BANDS: '/bands',
        BANDS_BY_ID: '/bands',
        BANDS_EXPORT_CSV: '/bands/exportar/csv',
        BANDS_EXPORT_JSON: '/bands/exportar/json',
        BANDS_EXPORT_XML: '/bands/exportar/xml',
        BANDS_IMPORT_CSV: '/bands/importar/csv',
        BANDS_IMPORT_JSON: '/bands/importar/json',
        BANDS_IMPORT_XML: '/bands/importar/xml',
        
        // shows
        SHOWS: '/shows',
        SHOWS_BY_ID: '/shows',
        SHOWS_EXPORT_CSV: '/shows/exportar/csv',
        SHOWS_EXPORT_JSON: '/shows/exportar/json',
        SHOWS_EXPORT_XML: '/shows/exportar/xml',
        SHOWS_IMPORT_CSV: '/shows/importar/csv',
        SHOWS_IMPORT_JSON: '/shows/importar/json',
        SHOWS_IMPORT_XML: '/shows/importar/xml',
        
        // participações
        PARTICIPATIONS: '/participacoes',
        PARTICIPATIONS_BY_IDS: '/participacoes',
        PARTICIPATIONS_BY_BAND: '/bands',
        PARTICIPATIONS_EXPORT_CSV: '/participacoes/exportar/csv',
        PARTICIPATIONS_EXPORT_JSON: '/participacoes/exportar/json',
        PARTICIPATIONS_EXPORT_XML: '/participacoes/exportar/xml',
        PARTICIPATIONS_IMPORT_CSV: '/participacoes/importar/csv',
        PARTICIPATIONS_IMPORT_JSON: '/participacoes/importar/json',
        PARTICIPATIONS_IMPORT_XML: '/participacoes/importar/xml',
        
        // membros da banda
        BAND_MEMBERS: '/bands/members',
        BAND_MEMBERS_BY_BAND: '/bands',
        BAND_MEMBERS_BY_IDS: '/bands/members',
        BAND_MEMBERS_EXPORT_CSV: '/bands/members/exportar/csv',
        BAND_MEMBERS_EXPORT_JSON: '/bands/members/exportar/json',
        BAND_MEMBERS_EXPORT_XML: '/bands/members/exportar/xml',
        BAND_MEMBERS_IMPORT_CSV: '/bands/members/importar/csv',
        BAND_MEMBERS_IMPORT_JSON: '/bands/members/importar/json',
        BAND_MEMBERS_IMPORT_XML: '/bands/members/importar/xml',

        // gerenciamento de usuários -- não implementado (25/08/2025)

        USERS: '/users',
        
        // backup
        BACKUP: '/backup'
    },
    
    // paginação padrão e opções.
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100]
    },
    
    // configurações da exibição do toast.
    TOAST: {
        SUCCESS_DURATION: 3000,
        ERROR_DURATION: 5000,
        WARNING_DURATION: 4000,
        INFO_DURATION: 3000
    },
    
    // validação do formulário
    VALIDATION: {
        REQUIRED_FIELD_MESSAGE: 'Este campo é obrigatório',
        EMAIL_INVALID_MESSAGE: 'Por favor, insira um email válido',
        PASSWORD_MIN_LENGTH: 6,
        PASSWORD_MIN_LENGTH_MESSAGE: 'A senha deve ter pelo menos 6 caracteres'
    },
    
    // cargos de usuário
    USER_ROLES: {
        ADMIN: 'admin',
        MUSICIAN: 'musician',
        ORGANIZER: 'organizador',
        USER: 'user'
    }
};

// headers padrão para requisições API com autenticação
const getDefaultHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    
    const token = localStorage.getItem('authToken');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

// utils diversos
const Utils = {
    formatDate: (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    },
    
    formatDateForInput: (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    generateId: () => {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },
    
    safeJsonParse: (str, fallback = null) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return fallback;
        }
    },
    
    capitalize: (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    truncate: (str, length = 50) => {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substr(0, length) + '...';
    }
};