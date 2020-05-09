<template>
  <a v-if="showGoogleSignIn" id="signinButton" @click="googleSignIn" class="btn shadow-sm" href="#" role="button" style="text-transform:none; background-color: #ffffff">
    <img width="20px" style="margin-bottom:3px; margin-right:5px" alt="Google sign-in" src="img/google-logo.webp" />
    Sign in with Google
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
        // There was an error.
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

