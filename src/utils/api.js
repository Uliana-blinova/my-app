const API = "http://lifestealer86.ru/api-shop";

export const loginRequest = (user) => {
    return new Promise((resolve, reject) => {
        fetch(`${API}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.data && result.data.user_token) {
                    resolve(result.data.user_token);
                } else {
                    reject(result.error || { message: "Invalid response from server" });
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const registerRequest = (user) => {
    return new Promise((resolve, reject) => {
        fetch(`${API}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.data && result.data.user_token) {
                    resolve(result.data.user_token);
                } else {
                    reject(result.error || { message: "Invalid response from server" });
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getProducts = () => {
    return new Promise((resolve, reject) => {
        fetch(`${API}/products`)
            .then((response) => response.json())
            .then((result) => {
                if (result.data) {
                    resolve(result.data);
                } else {
                    reject(result.error || { message: "Invalid response" });
                }
            })
            .catch((error) => reject(error));
    });
};

export const addToCartRequest = (productId, token) => {
    return new Promise((resolve, reject) => {
        fetch(`${API}/cart/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((result) => resolve(result))
            .catch((error) => reject(error));
    });
};

export const logoutRequest = () => {
    return new Promise((resolve, reject) => {
        fetch(`${API}/logout`)
            .then((response) => response.json())
            .then((result) => resolve(result))
            .catch((error) => reject(error));
    });
};