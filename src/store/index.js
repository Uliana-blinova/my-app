import { createStore } from "vuex";
import {
    loginRequest,
    registerRequest,
    getProducts,
    addToCartRequest,
    logoutRequest
} from "@/utils/api.js";

export default createStore({
    state: {
        token: localStorage.getItem("myAppToken") || "",
        products: [],
        cart: []
    },

    getters: {
        isAuthenticated: (state) => !!state.token,
        getProducts: (state) => state.products,
        getCart: (state) => state.cart
    },

    actions: {
        AUTH_REQUEST: ({ commit }, user) => {
            return new Promise((resolve, reject) => {
                loginRequest(user)
                    .then((token) => {
                        commit("AUTH_SUCCESS", token);
                        localStorage.setItem("myAppToken", token);
                        resolve();
                    })
                    .catch((error) => {
                        commit("AUTH_ERROR");
                        localStorage.removeItem("myAppToken");
                        reject(error);
                    });
            });
        },

        REGISTER_REQUEST: ({ commit }, user) => {
            return new Promise((resolve, reject) => {
                registerRequest(user)
                    .then((token) => {
                        commit("AUTH_SUCCESS", token);
                        localStorage.setItem("myAppToken", token);
                        resolve();
                    })
                    .catch((error) => {
                        commit("AUTH_ERROR");
                        localStorage.removeItem("myAppToken");
                        reject(error);
                    });
            });
        },

        FETCH_PRODUCTS: ({ commit }) => {
            return new Promise((resolve, reject) => {
                getProducts()
                    .then((products) => {
                        commit("SET_PRODUCTS", products);
                        resolve();
                    })
                    .catch((error) => reject(error));
            });
        },

        ADD_TO_CART: ({ state }, productId) => {
            return new Promise((resolve, reject) => {
                addToCartRequest(productId, state.token)
                    .then((result) => resolve(result))
                    .catch((error) => reject(error));
            });
        },

        LOGOUT_REQUEST: ({ commit }) => {
            return new Promise((resolve) => {
                logoutRequest()
                    .catch(() => {})
                    .finally(() => {
                        commit("AUTH_ERROR");
                        localStorage.removeItem("myAppToken");
                        resolve();
                    });
            });
        }
    },

    mutations: {
        AUTH_SUCCESS: (state, token) => {
            state.token = token;
        },
        AUTH_ERROR: (state) => {
            state.token = "";
        },
        SET_PRODUCTS: (state, products) => {
            state.products = products;
        },
        SET_CART: (state, cart) => {
            state.cart = cart;
        }
    },

    modules: {},
});