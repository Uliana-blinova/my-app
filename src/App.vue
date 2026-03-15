<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #F2E8DF;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  min-height: 100vh;
  background: #f8e0c8;
  padding: 20px;
}

a {
  color: #415111;
  text-decoration: none;
}

a:hover {
  color: #FB8159;
}
.btn-primary {
  background: #FB8159;
  color: #FEFEFE;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
}

.card {
  background: #FEFEFE;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(65, 81, 17, 0.1);
  border: 2px solid #D2E186;
}
</style>
