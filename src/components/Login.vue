<template>
  <div class="parent">
    <div class="container-fluid">
      <div class="row justify-content-center">
          <div class="col-lg-3 col-md-6 col-sm-6 bg-light shadow-lg">
            <b-form @submit="handleSubmit" class="form-container">
              <b-form-group id="input-group-1">
                <b-form-input
                  id="input-1"
                  v-model="email"
                  type="email"
                  required
                  placeholder="Enter email"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-2">
                <b-form-input
                  id="input-2"
                  v-model="password"
                  required
                  placeholder="Enter Password"
                  type="password"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-3">
                <b-form-checkbox-group id="checkboxes-3">
                  <b-form-checkbox>Remember me</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>

              <b-button type="submit" variant="primary" class="btn-block">Login</b-button>
            </b-form>

            <div class="or-text">
              <span>OR</span>
            </div>

            <GoogleSignIn></GoogleSignIn>
            <br><br>
            <hr>

            <div class="form-group text-center">
              New User: <a href="#" @click="goToRegisterPage">Sign Up</a>
            </div>
            <div class="form-group text-center">
              <a href="#" @click="goToForgotPasswordPage">Forgot Password</a>&nbsp;|&nbsp;<a href="#">Support</a>
            </div>

          </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoogleSignIn from './login/GoogleSignIn.vue'

export default {
  name: 'Login',
  data: function() {
    return {
      email : "",
      password : "",
      remember_me: false
    }
  },
  methods: {
    handleSubmit: function(e) {
      e.preventDefault();

      if (this.password.length > 0) {
        this.$http.post('login', {
          user: {
            email: this.email,
            password: this.password,
            remember_me: this.remember_me
          }
        })
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
          this.$parent.toast(error);
        });
      }
    },
    goToRegisterPage: function() {
      this.$router.push({path: 'register', name: 'register'})
    },
    goToForgotPasswordPage: function() {
      this.$router.push({path: 'forgot-password', name: 'forgot-password'})
    },
  },
  components: {
    GoogleSignIn
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.parent {
  padding-top: 5vh;
}
.form-container {
  padding: 30px;
}
.or-text {
   width: 100%; 
   text-align: center; 
   border-bottom: 1px solid #D3D3D3; 
   line-height: 0.05em;
   margin: 10px 0 20px; 
} 

.or-text span { 
    background:#f8f9fa; 
    padding:0 10px; 
}
</style>
