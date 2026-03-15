<template>
  <div class="cart">
    <header class="cart-header">
      <h1>Корзина</h1>
      <router-link to="/" class="btn-back">← Назад</router-link>
    </header>

    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>Ваша корзина пуста...</p>
      <router-link to="/" class="btn-continue">Перейти в каталог</router-link>
    </div>

    <div v-else>
      <div class="cart-items">
        <div v-for="group in groupedCart" :key="group.product_id" class="cart-item">
          <div class="item-image-wrapper">
            <img
                v-if="group.image"
                :src="`http://lifestealer86.ru/${group.image}`"
                :alt="group.name"
                class="item-image"
                @error="onImageError"
            />
            <div v-else class="item-image-placeholder">
              <div class="product-initial">{{ getInitial(group.name) }}</div>
            </div>
          </div>

          <div class="item-info">
            <h3>{{ group.name }}</h3>
            <p class="item-description">{{ group.description }}</p>
            <p class="item-price">{{ group.price }} ₽ × {{ group.quantity }} = <strong>{{ group.total }} ₽</strong></p>
          </div>

          <div class="item-controls">
            <div class="quantity-control">
              <button @click="decreaseQuantity(group.product_id)" class="btn-qty">−</button>
              <div class="quantity">{{ group.quantity }}</div>
              <button @click="increaseQuantity(group.product_id)" class="btn-qty">+</button>
            </div>
            <button @click="removeAllItems(group.product_id)" class="btn-remove">Удалить</button>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <div class="total">
          <p>Итого:</p>
          <p class="total-price">{{ cartTotal }} ₽</p>
        </div>
        <button @click="checkout" :disabled="processing" class="btn-checkout">
          {{ processing ? 'Оформляем...' : 'Оформить заказ' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  data() {
    return {
      cartItems: [],
      processing: false
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    groupedCart() {
      const grouped = {}
      this.cartItems.forEach(item => {
        if (!grouped[item.product_id]) {
          grouped[item.product_id] = {
            product_id: item.product_id,
            cart_item_id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            quantity: 0,
            total: 0
          }
        }
        grouped[item.product_id].quantity++
        grouped[item.product_id].total = grouped[item.product_id].quantity * item.price
      })
      return Object.values(grouped)
    },
    cartTotal() {
      return this.groupedCart.reduce((sum, item) => sum + item.total, 0)
    }
  },
  created() {
    if (!this.isAuthenticated) {
      this.$router.push('/login');
      return;
    }
    this.loadCart()
  },
  methods: {
    getInitial(name) {
      return name ? name.charAt(0).toUpperCase() : 'P';
    },
    onImageError(event) {
      event.target.style.display = 'none';
    },
    async loadCart() {
      try {
        const API = "http://lifestealer86.ru/api-shop";
        const token = localStorage.getItem("myAppToken");

        const response = await fetch(`${API}/cart`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();

        if (response.ok) {
          this.cartItems = result.data || [];
        }
      } catch (e) {
        console.error('Ошибка загрузки корзины:', e)
      }
    },
    async increaseQuantity(productId) {
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

        if (response.ok) {
          await this.loadCart();
        }
      } catch (e) {
        console.error('Ошибка изменения количества:', e)
      }
    },
    async decreaseQuantity(productId) {
      const item = this.cartItems.find(i => i.product_id === productId);
      if (item) {
        const quantity = this.cartItems.filter(i => i.product_id === productId).length;

        if (quantity <= 1) {
          await this.removeAllItems(productId);
          return;
        }

        try {
          const API = "http://lifestealer86.ru/api-shop";
          const token = localStorage.getItem("myAppToken");

          const response = await fetch(`${API}/cart/${item.id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });

          if (response.ok) {
            await this.loadCart();
          }
        } catch (e) {
          console.error('Ошибка изменения количества:', e)
        }
      }
    },
    async removeAllItems(productId) {
      try {
        const API = "http://lifestealer86.ru/api-shop";
        const token = localStorage.getItem("myAppToken");

        const itemsToRemove = this.cartItems.filter(item => item.product_id === productId);

        const deletePromises = itemsToRemove.map(item =>
            fetch(`${API}/cart/${item.id}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${token}` }
            })
        );

        await Promise.all(deletePromises);
        await this.loadCart();
      } catch (e) {
        console.error('Ошибка удаления товара:', e)
      }
    },
    async checkout() {
      if (this.processing) return;

      this.processing = true;
      try {
        const API = "http://lifestealer86.ru/api-shop";
        const token = localStorage.getItem("myAppToken");

        const response = await fetch(`${API}/order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await response.json();

        if (response.ok) {
          this.$router.push("/");
        }
      } catch (e) {
        console.error('Ошибка оформления заказа:', e)
      } finally {
        this.processing = false;
      }
    }
  }
}
</script>

<style scoped>
.cart {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
}

.cart-header h1 {
  color: #415111;
  margin: 0;
  font-size: 32px;
}

.btn-back {
  color: #415111;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border: 2px solid #415111;
  border-radius: 8px;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-cart p {
  margin-bottom: 20px;
  font-size: 18px;
}

.btn-continue {
  display: inline-block;
  color: #415111;
  text-decoration: none;
  font-weight: 600;
  padding: 10px 24px;
  border: 2px solid #415111;
  border-radius: 8px;
}

.cart-items {
  margin-bottom: 30px;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: #FEFEFE;
  border: 2px solid #D2E186;
  border-radius: 16px;
  margin-bottom: 15px;
}

.item-image-wrapper {
  width: 100px;
  height: 100px;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.item-image-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: #FB8159;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-initial {
  font-size: 40px;
  font-weight: 700;
  color: #FEFEFE;
}

.item-info h3 {
  color: #415111;
  margin: 0 0 8px 0;
  font-size: 20px;
}

.item-description {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px 0;
}

.item-price {
  color: #FB8159;
  font-size: 18px;
  margin: 0;
}

.item-price p {
  font-size: 22px;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #F2E8DF;
  padding: 6px 12px;
  border-radius: 8px;
}

.btn-qty {
  background: none;
  border: none;
  color: #415111;
  font-size: 20px;
  font-weight: 700;
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.quantity {
  font-weight: 600;
  color: #415111;
  min-width: 30px;
  text-align: center;
  font-size: 18px;
}

.btn-remove {
  background: #FB8159;
  color: #FEFEFE;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  min-width: 80px;
}

.cart-summary {
  background: #FEFEFE;
  padding: 24px;
  border-radius: 16px;
  border: 2px solid #D2E186;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.total div {
  color: #415111;
}

.total-price {
  color: #FB8159;
  font-size: 32px;
}

.btn-checkout {
  width: 100%;
  background: #FCBF93;
  color: #FEFEFE;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
}
</style>