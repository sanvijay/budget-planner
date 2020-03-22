<template>
  <div id="app">
    <div class="LeadImage">
      <div class="image" style="background-image: url('img/backgroud.svg'), url('img/backgroud.svg');"></div>
      <div class="ie-hack-vertical"></div>
      <div class="ie-hack-horizontal"></div>
      <div class="triangle">
        <svg fill="white" preserveAspectRatio="none" viewBox="0 0 25 100" class="jsx-4194311832 Triangle">
          <polygon points="0,100 25,0 25,100" class="jsx-4194311832"></polygon>
        </svg>
      </div>
    </div>

    <b-navbar toggleable="lg" fixed="top" type="light" variant="light" class="shadow-lg" v-if="this.$route.path !== '/'">
      <b-navbar-brand href="#">
        <!-- <img src="./assets/logo.jpg" width="30" height="30" class="d-inline-block align-top" alt=""> -->
        finsey<span class="text-primary">.</span>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="loggedIn">
          <b-nav-item :to="{ name: 'dashboard' }">Planning and Accounting</b-nav-item>
          <b-nav-item :to="{ name: 'summary' }">Profile</b-nav-item>
          <b-nav-item :to="{ name: 'setting' }">Settings</b-nav-item>
          <b-nav-item :to="{ name: 'feedback' }">Feedback</b-nav-item>
          <b-nav-item :to="{ name: 'whatsnext' }">What's Next</b-nav-item>
          <b-nav-item href="#" @click="logout">Logout</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav v-if="!loggedIn">
          <b-nav-item :to="{ name: 'home' }">Home</b-nav-item>
          <b-nav-item :to="{ name: 'register' }">Sign Up</b-nav-item>
          <b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" v-if="loggedIn">
          <b-nav-item-dropdown :text="selectedFinancialYearText">
            <b-dropdown-item v-for="financialYear in allFinancialYear" :key="financialYear" @click="selectFinancialYear(financialYear)">{{ financialYear }} - {{ financialYear + 1 }}</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item href="#" v-if="userProfile.first_name">Hi {{ userProfile.first_name }}!</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal id="ask-for-user-profile" :no-close-on-esc="true" :no-close-on-backdrop="true" :hide-header-close="true" :hide-footer="true" :hide-header="true">
      <Profile />
    </b-modal>

    <div style="padding-top: 70px; margin-bottom: 1000">
      <router-view :selectedYear="selectedFinancialYear"></router-view>
    </div>
  </div>
</template>

<script>
import Profile from './components/Profile.vue'

export default {
  name: 'app',
  computed: {
    loggedIn: function() {
      return (localStorage.getItem('jwt') != null && localStorage.getItem('user') != null);
    },
    selectedFinancialYearText: function() {
      return this.selectedFinancialYear + " - " + (this.selectedFinancialYear + 1);
    }
  },
  components: {
    Profile
  },
  methods: {
    logout: function() {
      this.$http.delete('logout')
        .catch(error => {
          this.toast(error);
        });

      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      window.location.href = "/";
    },
    toast: function(error) {
      var finalContent = null;

      if (typeof error === 'string' || error instanceof String) {
        finalContent = error;
      } else if(error.response == null) {
        finalContent = error.message
      } else if (error.response.status == 400 || error.response.status == 422) {
        var content = [];
        var content_hash = error.response.data;

        const h = this.$createElement

        for(var content_key in content_hash) {
          for(var content_string_index in content_hash[content_key]){
            content.push(h('p', {}, content_key + " " + content_hash[content_key][content_string_index]));
          }
        }

        finalContent = [h('span', {}, content)];
      } else if (error.response.status == 401) {
        finalContent = error.response.data;
      } else if (error.response.status == 500) {
        finalContent = "Some error occured"
      }

      this.$bvToast.toast(finalContent, {
        title: "Error",
        toaster: "b-toaster-bottom-right",
        solid: true,
        appendToast: false
      });

      if(finalContent == "Invalid segment encoding" || finalContent == "Signature has expired") {
        setTimeout(() => { this.logout(); }, 500);
      }
    },
    setUserProfile: function() {
      if(this.loggedIn) {
        this.$http.get('users/' + localStorage.getItem('user') + '/user_profile')
          .then(response => {
            if(response.data.first_name == null) {
              // window.location.href = "/";
              this.$bvModal.show("ask-for-user-profile");
            } else {
              this.userProfile = response.data;
            }
          })
          .catch(error => {
            this.toast(error);
          });
      }
    },
    selectFinancialYear: function(financialYear){
      this.selectedFinancialYear = financialYear;
    },
    setAllFinancialYear: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/all_financial_years')
        .then(response => {
          var yearCreated = response.data;
          var defaultYears = [this.currentFinancialYear() - 1, this.currentFinancialYear()];

          this.allFinancialYear = yearCreated.concat(defaultYears).sort().filter(function(el,i,a) { return i === a.indexOf(el) });
        })
        .catch(error => {
          this.toast(error);
        });
    },
    currentFinancialYear: function() {
      var fiscalyear = "";
      var today = new Date();

      if ((today.getMonth() + 1) <= 3) {
        fiscalyear = (today.getFullYear() - 1);
      } else {
        fiscalyear = today.getFullYear();
      }
      return fiscalyear;
    },
    setCurrentFinancialYear: function() {
      this.selectedFinancialYear = this.currentFinancialYear();
    }
  },
  data: function() {
    return {
      userProfile: {},
      selectedFinancialYear: null,
      allFinancialYear: []
    }
  },
  mounted: function () {
    if(this.loggedIn) {
      this.setUserProfile();
      this.setCurrentFinancialYear();
      this.setAllFinancialYear();
    }
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
