<template>
  <div class="parent">
    <div class="container-fluid">
      <div class="row justify-content-center">

          <div class="col-md-3 col-sm-6 col-12 bg-light shadow-lg">
            <form class="form-container">
              <div class="form-group">
                <input class="form-control input-sm" type="text" v-model="email" placeholder="email"/>          
              </div>
              <div class="form-group">
                <input class="form-control input-sm" type="password" v-model="password" placeholder="password"/>     
              </div>
              <div class="checkbox">
                <label>
                  <input type="checkbox" v-model="remember_me"> Remember me
                </label>
              </div>
              <div class="form-group">
                <button type="button" @click="handleSubmit" class="btn btn-info btn-block">Login</button>
              </div>
              <div class="form-group text-center">
                New User: <a href="#" @click="goToRegisterPage">Sign Up</a>
              </div>
              <div class="form-group text-center">
                <a href="#">Forgot Password</a>&nbsp;|&nbsp;<a href="#">Support</a>
              </div>
            </form>        
          </div>  

      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      email : "",
      password : "",
      remember_me: false
    }
  },
  methods: {
    handleSubmit: function(e) {
      e.preventDefault()
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

          if (localStorage.getItem('jwt') != null){
            // this.$emit('loggedIn')
            if(this.$route.params.nextUrl != null){
              this.$router.push(this.$route.params.nextUrl)
            }
            else {
              window.location.href = "/";
            }
          }
        });
      }
    },
    goToRegisterPage: function() {
      this.$router.push({path: 'register', name: 'register'})
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
