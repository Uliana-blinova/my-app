<template>
  <div class="auth-form">
    <h2>Вход в систему</h2>

    <form @submit.prevent="login">
      <div :class="{ 'form-group': true, error: errors.email }">
        <input
            v-model="form.email"
            type="email"
            name="email"
            id="email"
            autocomplete="email"
            placeholder="admin@admin.ru"
        />
        <div v-if="errors.email" class="error-mesg">{{ errors.email }}</div>
      </div>

      <div :class="{ 'form-group': true, error: errors.password }">
        <input
            v-model="form.password"
            type="password"
            name="password"
            id="password"
            autocomplete="current-password"
            placeholder="••••••••"
        />
        <div v-if="errors.password" class="error-mesg">{{ errors.password }}</div>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Входим...' : 'Войти' }}
      </button>
    </form>

    <p class="auth-links">
      Нет аккаунта? <router-link to="/register">Регистрация</router-link>
    </p>
    <p class="auth-links">
      <router-link to="/">← Назад</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      errors: {},
      loading: false
    }
  },
  methods: {
    clearErrors() {
      this.errors = {}
    },

    validate() {
      this.clearErrors()

      if (!this.form.email) {
        this.errors.email = 'Введите email'
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        this.errors.email = 'Некорректный email'
      }

      if (!this.form.password) {
        this.errors.password = 'Введите пароль'
      }

      return Object.keys(this.errors).length === 0
    },

    async login() {
      if (!this.validate()) {
        return
      }

      this.loading = true
      this.clearErrors()

      try {
        await this.$store.dispatch("AUTH_REQUEST", this.form)
        this.$router.push('/')
      } catch (error) {
        console.error("Login error:", error)
        if (error.status === 401 || (error.message && error.message.toLowerCase().includes('authentication'))) {
          this.errors.email = 'Неверный email или пароль'
          this.errors.password = 'Неверный email или пароль'
        }
        else if (error.errors) {
          if (error.errors.email) {
            this.errors.email = Array.isArray(error.errors.email)
                ? error.errors.email[0]
                : error.errors.email
          }
          if (error.errors.password) {
            this.errors.password = Array.isArray(error.errors.password)
                ? error.errors.password[0]
                : error.errors.password
          }
        }
        else if (error.message) {
          const message = error.message.toLowerCase()

          if (message.includes('email')) {
            this.errors.email = 'Неверный email'
          } else if (message.includes('парол') || message.includes('password')) {
            this.errors.password = 'Неверный пароль'
          } else {
            this.errors.email = 'Неверный email или пароль'
            this.errors.password = 'Неверный email или пароль'
          }
        }
        else {
          this.errors.email = 'Ошибка подключения к серверу'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 60px auto;
  padding: 40px;
  background: #FEFEFE;
  border-radius: 20px;
  border: 2px solid #F2E8DF;
}

.auth-form h2 {
  text-align: center;
  margin-bottom: 32px;
  color: #415111;
  font-size: 28px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  font-size: 15px;
  border: 2px solid #D2E186;
  border-radius: 12px;
  background: #FEFEFE;
  box-sizing: border-box;
}

.form-group input::placeholder {
  color: #FCBF93;
}

.form-group.error input {
  border-color: #FB8159;
  background-color: #FFF5F5;
}

.error-mesg {
  color: #FB8159;
  font-size: 13px;
  font-weight: 500;
  margin-top: 6px;
  display: block;
}

button {
  width: 100%;
  padding: 16px;
  background: #FCBF93;
  color: #FEFEFE;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
}

.auth-links {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.auth-links a {
  color: #415111;
  text-decoration: none;
  font-weight: 600;
}
</style>