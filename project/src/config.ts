// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    HEALTH: `${API_BASE_URL}/health`,
    DETECT: `${API_BASE_URL}/detect`,
} as const;
