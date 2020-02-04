<template>
  <div class="parent">
    <div class="container-fluid">
      <div class="row justify-content-center">

          <div class="col-md-3 col-sm-6 col-12 bg-light shadow-lg">
            <form class="form-container">
              <div class="form-group">
                <input class="form-control input-lg" type="text" v-model="email" placeholder="email"/>          
              </div>
              <div class="form-group">
                <input class="form-control input-lg" type="password" v-model="password" placeholder="password"/>     
              </div>
              <div class="form-group">
                <input class="form-control input-lg" type="password" v-model="password_confirmation" placeholder="confirm password"/>
              </div>
              <div class="checkbox">
                <label>
                  <input type="checkbox"> I agree to the <a href="#">Terms and Conditions</a>
                </label>
              </div>
              <div class="form-group">
                <button type="button" @click="handleSubmit" class="btn btn-info btn-block">Register</button>
              </div>
              <div class="form-group text-center">
                Already a User: <a href="#" @click="goToSignInPage">Sign In</a>
              </div>
              <div class="form-group text-center">
                <a href="#">Support</a>
              </div>
            </form>
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
          });
        } else {
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
