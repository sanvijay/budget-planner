<template>
  <div id="app">
    {{ user_profile.first_name }}
    <div>
      <div v-if="!loggedIn">
        <router-link :to="{ name: 'login' }">Login</router-link>
      </div>
      <div v-if="loggedIn">
        <router-link :to="{ name: 'home' }">Home</router-link>
        <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
        <router-link :to="{ name: 'goal' }">Goal</router-link>
        <router-link :to="{ name: 'profile' }">Profile</router-link>
        <router-link :to="{ name: 'setting' }">Settings</router-link>
        <a href="#" @click="logout">Logout</a>
      </div>
    </div>
    <router-view></router-view>
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
      this.$http.get(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/user_profiles', {
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
  margin-top: 60px;
}
</style>
