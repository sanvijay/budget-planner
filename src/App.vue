<template>
  <div id="app">
    Hi
    <div>
      <router-link :to="{ name: 'dashboard' }" v-if="!loggedIn">Login</router-link>
      <button type="submit" @click="logout" v-if="loggedIn">Logout</button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: function() {
    return {
      loggedIn: (localStorage.getItem('jwt') != null && localStorage.getItem('user') != null)
    }
  },
  computed: {

  },
  methods: {
    logout: function() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        window.location.href = "/";
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
