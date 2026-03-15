import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/login");
};

const routes = [
  {
    path: "/",
    name: "Catalog",
    component: () => import("@/components/Catalog.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/components/Login.vue"),
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/components/Register.vue"),
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("@/components/Cart.vue"),
    beforeEnter: ifAuthenticated,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;