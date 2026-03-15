<template>
  <div class="auth-form">
    <h2>Регистрация</h2>
    <form @submit.prevent="register">
      <div :class="{ 'form-group': true, error: errors.fio }">
        <input
            v-model="form.fio"
            type="text"
            name="fio"
            id="fio"
            autocomplete="name"
            placeholder="Иванов Иван Иванович"
        />
        <div v-if="errors.fio" class="error-msg">{{ errors.fio }}</div>
      </div>

      <div :class="{ 'form-group': true, error: errors.email }">
        <input
            v-model="form.email"
            type="email"
            name="email"
            id="email"
            autocomplete="email"
            placeholder="admin@admin.ru"
        />
        <div v-if="errors.email" class="error-msg">{{ errors.email }}</div>
      </div>

      <div :class="{ 'form-group': true, error: errors.password }">
        <input
            v-model="form.password"
            type="password"
            name="password"
            id="password"
            autocomplete="new-password"
            placeholder="••••••••"
        />
        <div v-if="errors.password" class="error-msg">{{ errors.password }}</div>
      </div>

      <div v-if="generalError" class="general-error">
        {{ generalError }}
      </div>

      <button type="submit">Зарегистрироваться</button>
    </form>

    <p class="auth-links">
      Уже есть аккаунт? <router-link to="/login">Войти</router-link>
    </p>
    <p class="auth-links">
      <router-link to="/">← Назад</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: {
        fio: '',
        email: '',
        password: ''
      },
      errors: {},
      generalError: ''
    }
  },
  methods: {
    clearErrors() {
      this.errors = {}
      this.generalError = ''
    },

    validate() {
      this.clearErrors()

      if (!this.form.fio) {
        this.errors.fio = 'Введите ФИО'
      }

      if (!this.form.email) {
        this.errors.email = 'Введите email'
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        this.errors.email = 'Некорректный email'
      }

      if (!this.form.password) {
        this.errors.password = 'Введите пароль'
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Пароль должен быть не менее 6 символов'
      }

      return Object.keys(this.errors).length === 0
    },

    async register() {
      if (!this.validate()) {
        return
      }

      try {
        const API = "http://lifestealer86.ru/api-shop"

        const response = await fetch(`${API}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          },
          body: JSON.stringify(this.form)
        })

        const result = await response.json()

        if (response.ok) {
          this.$store.commit('AUTH_SUCCESS', result.data.user_token)
          localStorage.setItem('myAppToken', result.data.user_token)
          this.$router.push('/')
        } else {
          if (result.error && result.error.errors) {
            const serverErrors = result.error.errors
            if (serverErrors.email) {
              this.errors.email = Array.isArray(serverErrors.email) ? serverErrors.email[0] : serverErrors.email
            }
            if (serverErrors.fio) {
              this.errors.fio = Array.isArray(serverErrors.fio) ? serverErrors.fio[0] : serverErrors.fio
            }
            if (serverErrors.password) {
              this.errors.password = Array.isArray(serverErrors.password) ? serverErrors.password[0] : serverErrors.password
            }
          } else if (result.error && result.error.message) {
            this.generalError = result.error.message
          } else {
            this.generalError = 'Ошибка регистрации. Попробуйте позже.'
          }
        }
      } catch (e) {
        console.error('Registration error:', e)
        this.generalError = 'Ошибка подключения к серверу'
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

.error-msg {
  color: #FB8159;
  font-size: 13px;
  font-weight: 500;
  margin-top: 6px;
  display: block;
}

.general-error {
  background: #FFF5F5;
  border: 2px solid #FB8159;
  color: #FB8159;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
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