<template>
  <a v-if="showGoogleSignIn" id="signinButton" @click="googleSignIn" class="btn btn-social btn-google btn-block" href="#">
    <span class="icon-holder"><i class="fab fa-google fa-fw" ></i></span>
    <span class="btn-text">Sign In with Google</span>
  </a>
</template>

<script>
var auth2;

export default {
  name: 'GoogleSignIn',
  data () {
    return {
      showGoogleSignIn: true
    }
  },
  methods: {
    googleSignIn: function() {
      auth2.grantOfflineAccess().then(authResult => {
        this.signInCallback(authResult);
      });
    },
    signInCallback: function(authResult) {
      if (authResult['code']) {
        // Hide the sign-in button now that the user is authorized, for example:
        this.showGoogleSignIn = false;

        this.$http.post('login', { code: authResult['code'] })
          .then(response => {
            localStorage.setItem('user', response.data._id.$oid)
            localStorage.setItem('jwt', response.headers.authorization)

            if (localStorage.getItem('jwt') != null) {
              if (this.$route.params.nextUrl != null) {
                this.$router.push(this.$route.params.nextUrl)
              } else {
                location.reload();
              }
            }
          })
          .catch(error => {
            this.$parent.$parent.toast(error);
          });
      } else {
        this.$parent.$parent.toast("Login failed!");
      }
    },
  },
  mounted: function () {
    this.$loadScript("https://apis.google.com/js/client:platform.js")
      .then(() => {
        gapi.load('auth2', function() {
          auth2 = gapi.auth2.init({
            client_id: process.env.VUE_APP_GOOGLE_SIGN_IN_KEY,
          });
        });
      });
  }
}
</script>

