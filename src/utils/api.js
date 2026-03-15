const API = process.env.VUE_APP_API || "http://lifestealer86.ru/api-shop";

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
            .then((result) => resolve(result.data.user_token))
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
            .then((response) => {
                if (!response.ok) {
                    // Если ошибка сервера — выбрасываем её
                    return response.json().then((errorData) => {
                        reject(errorData.error || { message: "Registration failed" });
                    });
                }
                return response.json();
            })
            .then((result) => {
                if (result.data && result.data.user_token) {
                    resolve(result.data.user_token);
                } else {
                    reject({ message: "Invalid response from server" });
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};