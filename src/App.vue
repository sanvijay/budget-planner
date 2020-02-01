<template>
  <div id="app">

    <b-navbar toggleable="lg" fixed="top" type="light" variant="light" class="shadow-lg">
      <b-navbar-brand href="#">
        <img src="./assets/logo.png" width="30" height="30" class="d-inline-block align-top" alt="">
        Budget Planner
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="loggedIn">
          <b-nav-item :to="{ name: 'home' }">Home</b-nav-item>
          <b-nav-item :to="{ name: 'dashboard' }">Dashboard</b-nav-item>
          <b-nav-item :to="{ name: 'summary' }">Summary</b-nav-item>
          <b-nav-item :to="{ name: 'setting' }">Setting</b-nav-item>
          <b-nav-item href="#" @click="logout">Logout</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav v-if="!loggedIn">
          <b-nav-item :to="{ name: 'home' }">Home</b-nav-item>
          <b-nav-item :to="{ name: 'register' }">Sign Up</b-nav-item>
          <b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#" v-if="user_profile.first_name">Hi {{ user_profile.first_name }}!</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

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
