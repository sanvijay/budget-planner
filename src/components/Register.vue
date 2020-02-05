<template>
  <div class="parent">
    <div class="container-fluid">
      <div class="row justify-content-center">

        <div class="col-md-3 col-sm-6 col-12 bg-light shadow-lg">
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

            <b-form-group id="input-group-4">
              <b-form-checkbox-group id="checkboxes-4">
                <b-form-checkbox>I agree to the <a href="#">Terms and Conditions</a></b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>

            <b-button type="submit" variant="info" class="btn-block">Register</b-button>
          </b-form>

          <div class="form-group text-center">
            Already a User: <a href="#" @click="goToSignInPage">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        email : "",
        password : "",
        password_confirmation : ""
      }
    },
    methods : {
      goToSignInPage: function() {
        this.$router.push({path: 'login', name: 'login'})
      },
      handleSubmit: function(e) {
        e.preventDefault()

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
          this.$parent.toast('Password and confirm password does not match');
          this.password = ""
          this.password_confirmation = ""
        }
      }
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
</style>
