const API = "http://lifestealer86.ru/api-shop"

export const loginRequest = (user) => {
    return new Promise((resolve, reject) => {
        fetch(`${API}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(user),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        reject(errorData.error || { message: "Login failed" })
                    })
                }
                return response.json()
            })
            .then((result) => {
                if (result.data && result.data.user_token) {
                    resolve(result.data.user_token)
                } else {
                    reject({ message: "Invalid response" })
                }
            })
            .catch((error) => {
                reject(error)
            })
    })
}

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
                    return response.json().then((errorData) => {
                        reject(errorData.error || { message: "Registration failed" })
                    })
                }
                return response.json()
            })
            .then((result) => {
                if (result.data && result.data.user_token) {
                    resolve(result.data.user_token)
                } else {
                    reject({ message: "Invalid response" })
                }
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const logoutRequest = () => {
    return new Promise((resolve) => {
        const token = localStorage.getItem("myAppToken")
        fetch(`${API}/logout`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(() => resolve())
            .catch(() => resolve())
    })
}