const API_BASE = 'http://lifestealer86.ru/api-shop';

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const token = localStorage.getItem('user_token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    const response = await fetch(url, config);

    const data = await response.json();

    if (!response.ok) {
        throw data.error || { message: 'Неизвестная ошибка' };
    }

    return data;
}

export const api = {
    login: (email, password) =>
        request('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

    register: (fio, email, password) =>
        request('/signup', { method: 'POST', body: JSON.stringify({ fio, email, password }) }),

    getProducts: () => request('/products'),

    addToCart: (productId) => request(`/cart/${productId}`, { method: 'POST' }),
    getCart: () => request('/cart'),
    removeFromCart: (cartItemId) => request(`/cart/${cartItemId}`, { method: 'DELETE' }),

    logout: () => request('/logout')
};