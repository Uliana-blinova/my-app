<template>
  <form class="register" @submit.prevent="register">
    <h1>Регистрация</h1>
    <label>ФИО</label>
    <input type="text" required v-model="fio" />
    <label>Email</label>
    <input type="text" required v-model="email" />
    <label>Пароль</label>
    <input type="password" required v-model="password" />
    <button type="submit">Зарегистрироваться</button>
    <button type="button" @click="goBack">Назад</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      fio: "",
      email: "",
      password: "",
    };
  },
  methods: {
    register() {
      const userData = {
        fio: this.fio,
        email: this.email,
        password: this.password,
      };

      this.$store
          .dispatch("REGISTER_REQUEST", userData)
          .then(() => this.$router.push("/login"));
    },
    goBack() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 60px auto;
  padding: 40px;
  background: #FEFEFE;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(65, 81, 17, 0.15);
  border: 2px solid #F2E8DF;
}

.register h1 {
  text-align: center;
  margin-bottom: 32px;
  color: #415111;
  font-size: 28px;
  font-weight: 600;
}

.register label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #415111;
  font-size: 14px;
}

.register input {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 20px;
  border: 2px solid #D2E186;
  border-radius: 12px;
  font-size: 15px;
  background: #FEFEFE;
  box-sizing: border-box;
}

.register button {
  width: 100%;
  padding: 16px;
  margin-bottom: 12px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
}

.register button[type="submit"] {
  background:#FCBF93;
  color: #FEFEFE;
  box-shadow: 0 4px 16px rgba(251, 129, 89, 0.3);
}

.register button[type="button"] {
  background: #D2E186;
  color: #415111;
}

</style>