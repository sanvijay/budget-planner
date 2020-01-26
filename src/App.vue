<template>
  <div id="app">

    <nav class="navbar navbar-expand-lg navbar-light bg-light navbar-fixed-top shadow-lg fixed-top">
      <a class="navbar-brand" href="#">
        <img src="./assets/logo.png" width="30" height="30" class="d-inline-block align-top" alt="">
        Budget Planner
      </a>

      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto" v-if="loggedIn">
          <li class="nav-item" :class="{ 'active': ($route.path == '/') }">
            <router-link :to="{ name: 'home' }" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item" :class="{ 'active': ($route.path == '/dashboard') }">
            <router-link :to="{ name: 'dashboard' }" class="nav-link">Dashboard</router-link>
          </li>
          <li class="nav-item" :class="{ 'active': ($route.path == '/summary') }">
            <router-link :to="{ name: 'summary' }" class="nav-link">Summary</router-link>
          </li>
          <li class="nav-item" :class="{ 'active': ($route.path == '/setting') }">
            <router-link :to="{ name: 'setting' }" class="nav-link">Setting</router-link>
          </li>
          <li class="nav-item">
            <a href="#" @click="logout" class="nav-link">Logout</a>
          </li>
        </ul>
        <ul class="navbar-nav mr-auto" v-if="!loggedIn">
          <li class="nav-item" :class="{ 'active': ($route.path == '/') }">
            <router-link :to="{ name: 'home' }" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item" :class="{ 'active': ($route.path == '/login') }">
            <router-link :to="{ name: 'login' }" class="nav-link">Login</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <div style="padding-top: 70px; margin-bottom: 1000">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    loggedIn: function() {
      return (localStorage.getItem('jwt') != null && localStorage.getItem('user') != null);
    }
  },
  methods: {
    logout: function() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        window.location.href = "/";
    },
    setUserProfile: function() {
      this.$http.get(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/user_profile', {
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          this.user_profile = response.data;
        })
        .catch(function (error) {
          console.error(error.response);
        });
    }
  },
  data: function() {
    return {
      user_profile: {}
    }
  },
  mounted: function () {
    this.setUserProfile();
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
