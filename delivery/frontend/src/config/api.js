// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5003/api";

// Specific API endpoints
export const API_ENDPOINTS = {
    BASE: API_BASE_URL.replace('/api', ''),
    ADMIN: `${API_BASE_URL}/admin`,
    AUTH: `${API_BASE_URL}/auth`,
    RESTAURANTS: `${API_BASE_URL}/restaurants`,
    MENU: `${API_BASE_URL}/menu`,
    CUSTOMERS: `${API_BASE_URL}/customers`,
    ORDERS: `${API_BASE_URL}/orders`,
    PAYMENTS: `${API_BASE_URL}/payments`,
    REVIEWS: `${API_BASE_URL}/reviews`,
    DELIVERY_PARTNERS: `${API_BASE_URL}/delivery-partners`,
    PROMOTIONS: `${API_BASE_URL}/promotions`,
    REPORTS: `${API_BASE_URL}/reports`,
    SETTINGS: `${API_BASE_URL}/settings`,
};