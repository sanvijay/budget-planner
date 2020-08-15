<template>
  <div class="signup-section auth-section">
        
        <div class="row m-0" style="background-color: #EFF2F5;">
          <div class="auth-col-main bg-white col-12 col-lg-8 order-2 text-center p-5 h-100 align-self-stretch">
            <h1 class="site-logo mb-3"><a class="navbar-brand mr-0" href="index.html"><img class="svg-ie-fix logo-icon" src="assets/images/logo-icon.svg" alt="logo"> <span class="logo-text">finsey.</span></span></a></h1>

            <div class="auth-wrapper mx-auto">            
              <div class="social-auth text-center mx-auto">                        
                      <ul class="social-buttons list-unstyled">
                          <li class="mb-3">
                            <GoogleSignIn></GoogleSignIn>
                          </li>
                      </ul>
                  </div>
                  
                  <div class="divider my-5">
                      <span class="or-text">OR</span>
                  </div>
                  
                  <div class="auth-form-container text-left mx-auto">
                      <form  @submit="handleSubmit" class="auth-form signup-form">         
                          <div class="form-group email">
                              <label class="sr-only" for="signup-email">Your Email</label>
                              <input v-model="email" id="signup-email" name="signup-email" type="email" class="form-control signup-email" placeholder="Your email" required="required">
                          </div><!--//form-group-->
                          <div class="form-group password">
                              <label class="sr-only" for="signup-password">Password</label>
                              <input v-model="password" id="signup-password" name="signup-password" type="password" class="form-control signup-password" placeholder="Create a password" required="required">
                          </div><!--//form-group-->
                          <div class="text-center">
                              <button type="submit" class="btn btn-primary theme-btn mx-auto">Login</button>
                          </div>
                          
                      </form>
                  </div><!--//auth-form-container-->
                  
                  <div class="option-container my-4 pt-3">
                      New User: <a href="#" @click="goToRegisterPage">Sign Up</a>
                  </div><!--//option-container-->
                  <div class="option-container my-4 pt-3">
                    <a href="#" @click="goToForgotPasswordPage">Forgot Password</a>&nbsp;|&nbsp;<a href="/">Home</a>
                  </div>
            </div><!--//auth-wrapper-->
            
            
          </div><!--//col-auth-->
            
          <div class="auth-col-promo col-lg-4 d-none d-lg-block order-1 theme-bg-primary h-100 align-self-stretch">
            <div class="auth-col-promo-inner h-100 position-relative p-0">
              <div class="auth-quote-box mt-5 mb-3 px-3 py-4 rounded text-center shadow-lg bg-white mx-auto">
                    <h5 class="auth-quote-title">An absolute time-saver!</h5>
                  <div>You can use this area to add customer testimonial or reinforce your app's key benefits. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</div>
              </div>
              <div class="auth-user-figure-holder mt-5">
                
              </div>
            </div>
          
          </div><!--//col-promo-->
          
        </div><!--//row-->
   
    </div><!--//signup-section-->
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

</style>
