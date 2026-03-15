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
    name: 'home',
    component: function () {
      import('../views/HomeView.vue');
    },
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/login',
    name: 'Login',
    component: function(){
      import('../components/LoginView.vue')
    },
    beforeEnter: requireGuest
  },
  {
    path: '/register',
    name: 'Register',
    component: function (){
      import('../components/RegisterView.vue')
    },
    beforeEnter: requireGuest
  },
  {
    path: '/cart',
    name: 'Cart',
    component: function (){
      import('@/views/CartView.vue')
    },
    beforeEnter: requireAuth
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router