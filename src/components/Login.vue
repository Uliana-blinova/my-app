<template>
  <form class="login" @submit.prevent="login">
    <h1>Авторизация</h1>
    <label>Логин</label>
    <input type="text" required v-model="username" />
    <label>Пароль</label>
    <input type="password" required v-model="password" />
    <button type="submit">Войти</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      const userData = {
        username: this.username,
        password: this.password,
      };

      this.$store
          .dispatch("AUTH_REQUEST", userData)
          .then(() => this.$router.push("/"));
    },
  },
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 60px auto;
  padding: 40px;
  background: #FEFEFE;
  border-radius: 20px;
  border: 2px solid #F2E8DF;
}

.login h1 {
  text-align: center;
  margin-bottom: 32px;
  color: #415111;
  font-size: 28px;
  font-weight: 600;
}

.login label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #415111;
  font-size: 14px;
}

.login input {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 20px;
  border: 2px solid #D2E186;
  border-radius: 12px;
  font-size: 15px;
  background: #FEFEFE;
  box-sizing: border-box;
}

.login input::placeholder {
  color: #FCBF93;
}

.login button {
  width: 100%;
  padding: 16px;
  background: #FB8159;
  color: #FEFEFE;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
}
</style>