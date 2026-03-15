import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const requireAuth = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
  } else {
    next('/login');
  }
};

const requireGuest = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
  } else {
    next('/');
  }
};

const routes = [
  {
    path: '/',
    name: 'Catalog',
    component: () => import('@/views/CatalogView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    beforeEnter: requireGuest
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    beforeEnter: requireGuest
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/CartView.vue'),
    beforeEnter: requireAuth
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router