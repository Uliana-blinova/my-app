<template>
  <form class="login" @submit.prevent="login">
    <h1>Авторизация</h1>
    <label>Логин</label>
    <input type="text" required v-model="username" />
    <label>Пароль</label>
    <input type="password" required v-model="password" />
    <hr />
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

</style>