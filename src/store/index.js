import { createStore } from 'vuex'
import { api } from '@/utils/api'

export default createStore({
  state: {
    token: localStorage.getItem('user_token') || null
  },

  getters: {
    isAuthenticated: state => !!state.token
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('user_token', token);
    },
    CLEAR_TOKEN(state) {
      state.token = null;
      localStorage.removeItem('user_token');
    }
  },

  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await api.login(email, password);
        commit('SET_TOKEN', response.data.user_token);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message || 'Ошибка входа' };
      }
    },

    async register({ commit }, { fio, email, password }) {
      try {
        const response = await api.register(fio, email, password);
        commit('SET_TOKEN', response.data.user_token);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message || 'Ошибка регистрации' };
      }
    },

    async logout({ commit }) {
      try {
        await api.logout();
      } finally {
        commit('CLEAR_TOKEN');
      }
    }
  },

  modules: {}
})