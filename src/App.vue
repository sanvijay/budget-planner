<template>
  <div id="app">


    <b-navbar toggleable="lg" fixed="top" type="light" variant="light" class="shadow-lg" v-if="this.$route.path !== '/'">
      <b-navbar-brand href="#">
        <!-- <img src="./assets/logo.jpg" width="30" height="30" class="d-inline-block align-top" alt=""> -->
        <span class="logo">finsey<span class="text-primary">.</span></span>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="loggedIn">
          <b-nav-item :to="{ name: 'dashboard' }">Planning and Accounting</b-nav-item>
          <b-nav-item :to="{ name: 'summary' }">Profile</b-nav-item>
          <b-nav-item :to="{ name: 'setting' }">Settings</b-nav-item>
          <b-nav-item :to="{ name: 'need-help' }">Help</b-nav-item>
          <b-nav-item :to="{ name: 'feedback' }">Feedback</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav v-if="!loggedIn">
          <b-nav-item :to="{ name: 'home' }">Home</b-nav-item>
          <b-nav-item :to="{ name: 'register' }">Sign Up</b-nav-item>
          <b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
          <b-nav-item :to="{ name: 'quiz' }">Quiz<span class="badge badge-primary" style="overflow: auto;">check this</span></b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" v-if="loggedIn">
          <b-nav-item-dropdown :class="selectedBGColor" class="caret-off bgColorSelector">
            <b-dropdown-item v-for="color in backgroundColors" :key="color" @click="changeBGColor(color)">
              <span :class="color" class="bgColorSelector"></span>
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown :text="selectedFinancialYearText">
            <b-dropdown-item v-for="financialYear in allFinancialYear" :key="financialYear" @click="selectFinancialYear(financialYear)">{{ financialYear }} - {{ financialYear + 1 }}</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item href="#" v-if="userProfile.first_name">Hi {{ userProfile.first_name }}!</b-nav-item>
          <b-nav-item href="#" @click="logout">Logout</b-nav-item>
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
    },
    backgroundImage: function() {
      return "background-image: url('img/background-" + this.selectedBGColor + ".svg'), url('img/background-white.svg');"
    }
  },
  components: {
    Profile
  },
  methods: {
    changeBGColor: function(color) {
      localStorage.setItem('BGColor', color);
      this.selectedBGColor = color;
    },
    logout: function() {
      this.$http.delete('logout')
      .then(response => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        window.location.href = "/";
      })
      .catch(error => {
        this.toast(error);
      });
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
    },
    helpToast: function() {
      var completedTutorial = localStorage.getItem('completedTutorial');
      if(completedTutorial == "true") { return; }

      localStorage.setItem('completedTutorial', "true");

      // Use a shorter name for this.$createElement
      const h = this.$createElement;

      // Create the message
      const vNodesMsg = h(
        'p',
        { class: ['text-center', 'mb-0'] },
        [
          h('p', { }, [
            "Looks like you are new to the website. Click ",
            h('router-link', { props: { to: "need-help" } }, 'Learn More'),
            " to know how to use finsey. Or navigate to Help on top bar."
            ]
          )
        ]
      );

      // Pass the VNodes as an array for message and title
      this.$bvToast.toast([vNodesMsg], {
        title: "Tutorial",
        solid: true,
        variant: 'info',
        noAutoHide: true,
        toaster: 'b-toaster-top-right'
      });
    },
    loadCookiePolicy: function() {
      var cookieAccepted = localStorage.getItem('cookieAccepted');

      if(cookieAccepted == "true") { return; }

      // Use a shorter name for this.$createElement
      const h = this.$createElement;

      // Create the message
      const vNodesMsg = h(
        'p',
        { class: ['text-center', 'mb-0'] },
        [
          h('p', { }, [
            "This website uses cookies to ensure you get the best experience on our website.",
            h('router-link', { props: { to: "cookie-policy" } }, 'Learn More')
            ]
          ),
          h('button', { class: ['btn', 'btn-primary'], on: { click: function() { localStorage.setItem('cookieAccepted', "true"); } } }, 'Accept & Close')
        ]
      );

      // Pass the VNodes as an array for message and title
      this.$bvToast.toast([vNodesMsg], {
        title: "Cookie Policy",
        solid: true,
        variant: 'default',
        noAutoHide: true,
        toaster: 'b-toaster-bottom-left'
      });
    }
  },
  data: function() {
    return {
      userProfile: {expense_ratio: {}},
      selectedFinancialYear: null,
      allFinancialYear: [],
      // write class for each color
      backgroundColors: [
        'bright-red',
        'green',
        'pink',
        'purple',
        'red',
        'cyan'
      ],
      selectedBGColor: ""
    }
  },
  mounted: function () {
    var bgColor = localStorage.getItem('BGColor');
    if(bgColor == null || bgColor.toString().trim() == '') {
      this.selectedBGColor = "cyan";
    } else if(!this.backgroundColors.includes(bgColor)) {
      this.selectedBGColor = "bright-red";
    } else {
      this.selectedBGColor = bgColor;
    }

    this.loadCookiePolicy();

    if(this.loggedIn) {
      this.helpToast();
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
.caret-off > .dropdown-toggle::after {
  display: none;
}
.bgColorSelector {
  height: 25px;
  width: 25px;
  border-radius: 50%;
  display: inline-block;
  align-self: center;
}
.bright-red {
  background-color: #ba3612;
}
.green {
  background-color: #429f40;
}
.pink {
  background-color: #9f3072;
}
.purple {
  background-color: #7d50a1;
}
.red {
  background-color: #ba5f3a;
}
.cyan {
  background-color: #0da6a1;
}
</style>
