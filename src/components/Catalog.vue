<template>
  <div class="catalog">
    <header class="catalog-header">
      <h2>App-shop</h2>
      <div v-if="!isAuthenticated" class="auth-links">
        <router-link to="/login" class="btn-link">Войти</router-link>
        <router-link to="/register" class="btn-link">Регистрация</router-link>
      </div>

      <div v-else class="user-links">
        <router-link to="/cart" class="cart-link">
          <p>Корзина</p>
          <p v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</p>
        </router-link>
        <button @click="logout" class="btn-link">Выйти</button>
      </div>
    </header>
    <h1>Каталог товаров</h1>
    <div v-if="loading" class="loading">Загрузка товаров...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img
            v-if="product.image"
            :src="`http://lifestealer86.ru/${product.image}`"
            :alt="product.name"
            class="product-image"
            @error="onImageError"
        />

        <h3>{{ product.name }}</h3>
        <p class="description">{{ product.description }}</p>
        <p class="price">{{ product.price }} ₽</p>

        <button
            v-if="isAuthenticated"
            @click="addToCart(product.id)"
            :disabled="addingToCart === product.id"
            class="btn-add"
        >
          {{ addingToCart === product.id ? 'Добавляем...' : 'В корзину' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Catalog",

  data() {
    return {
      products: [],
      loading: false,
      error: "",
      addingToCart: null,
      cartCount: 0
    };
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  },

  created() {
    this.fetchProducts();
    this.fetchCartCount();
  },

  methods: {
    getInitial(name) {
      return name ? name.charAt(0).toUpperCase() : 'P';
    },

    onImageError(event) {
      event.target.style.display = 'none';
    },

    async fetchCartCount() {
      if (!this.isAuthenticated) {
        this.cartCount = 0;
        return;
      }

      try {
        const API = "http://lifestealer86.ru/api-shop";
        const token = localStorage.getItem("myAppToken");

        const response = await fetch(`${API}/cart`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (response.ok) {
          this.cartCount = result.data ? result.data.length : 0;
        }
      } catch (err) {
        console.error("Fetch cart count error:", err);
      }
    },

    async fetchProducts() {
      this.loading = true;
      this.error = "";

      try {
        const API = "http://lifestealer86.ru/api-shop";
        const response = await fetch(`${API}/products`);
        const result = await response.json();

        if (response.ok) {
          this.products = result.data || [];
        } else {
          this.error = result.error?.message || "Ошибка загрузки товаров";
        }
      } catch (err) {
        this.error = "Не удалось подключиться к серверу";
        console.error("Fetch error:", err);
      } finally {
        this.loading = false;
      }
    },

    async addToCart(productId) {
      this.addingToCart = productId;

      try {
        const API = "http://lifestealer86.ru/api-shop";
        const token = localStorage.getItem("myAppToken");

        const response = await fetch(`${API}/cart/${productId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (response.ok) {
          this.cartCount++;
        } else {
          console.error("Add to cart error:", result.error);
        }
      } catch (err) {
        console.error("Add to cart error:", err);
      } finally {
        this.addingToCart = null;
      }
    },

    async logout() {
      try {
        const API = "http://lifestealer86.ru/api-shop";
        await fetch(`${API}/logout`);
      } finally {
        localStorage.removeItem("myAppToken");
        this.$store.commit("AUTH_ERROR");
        this.cartCount = 0;
        this.$router.push("/");
      }
    }
  }
};
</script>

<style scoped>
.catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px 30px;
  background: #FEFEFE;
  border-radius: 16px;
}

.catalog-header h2 {
  color: #415111;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.catalog-header h1 {
  color: #415111;
  margin: 30px 0;
  font-size: 36px;
  font-weight: 700;
  text-align: center;
}

.auth-links,
.user-links {
  display: flex;
  gap: 15px;
  align-items: center;
}

.btn-link {
  border: 2px solid #415111;
  color: #415111;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.cart-link {
  position: relative;
  background: none;
  border: 2px solid #415111;
  color: #415111;
  padding: 8px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cart-badge {
  background: #FB8159;
  color: #FEFEFE;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  display: inline-block;
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #FB8159;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.product-card {
  background: #FEFEFE;
  border: 2px solid #D2E186;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 20px;
}

.product-card h3 {
  color: #415111;
  margin: 0 0 12px 0;
  font-size: 22px;
  font-weight: 600;
  min-height: 56px;
}

.description {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  flex-grow: 1;
  min-height: 80px;
}

.price {
  color: #FB8159;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
}

.btn-add {
  width: 100%;
  padding: 14px;
  background: #FCBF93;
  color: #FEFEFE;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  margin-top: auto;
}
</style>