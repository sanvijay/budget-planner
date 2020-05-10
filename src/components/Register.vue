<template>
  <div class="parent">
    <div class="container-fluid">
      <div class="row justify-content-center">

        <div class="col-md-6 col-sm-6 col-lg-3 bg-light shadow-lg">
          <b-form @submit="handleSubmit" class="form-container">
            <b-form-group
              id="input-group-1"
              description="We'll never share your email with anyone else."
            >
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
              <b-form-input
                id="input-3"
                v-model="password_confirmation"
                required
                placeholder="Confirm Password"
                type="password"
              ></b-form-input>
            </b-form-group>

            <div><small>By clicking Register, you agree to our <router-link :to="{ name: 'terms' }">Terms and Conditions</router-link> and that you have read our <router-link :to="{ name: 'privacy-policy' }">Privacy Policy</router-link></small></div><br>

            <b-button type="submit" variant="primary" class="btn-block">Register</b-button>
          </b-form>

          <div class="or-text">
            <span>OR</span>
          </div>

          <GoogleSignIn></GoogleSignIn>

          <br><br>
          <hr>

          <div class="form-group text-center">
            Already a User: <router-link :to="{ name: 'login' }">Sign In</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoogleSignIn from './login/GoogleSignIn.vue'

export default {
  name: 'Register',
  data() {
    return {
      email : "",
      password : "",
      password_confirmation : ""
    }
  },
  methods: {
    handleSubmit: function(e) {
      e.preventDefault();

      if (this.password.length > 0 && this.password === this.password_confirmation) {
        this.$http.post("/signup", {
          user: { email: this.email, password: this.password }
        })
        .then(response => {
          this.$router.push('/registeration-complete')
        })
        .catch(error => {
          this.$parent.toast(error);
        });
      } else {
        this.$parent.toast("Password and confirm password does not match");
        this.password = ""
        this.password_confirmation = ""
      }
    }
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
