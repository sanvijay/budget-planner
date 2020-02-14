<template>
  <div class="parent">
    <div class="container-fluid">
      <div class="row justify-content-center">

        <div class="col-md-3 col-sm-6 col-12 bg-light shadow-lg">
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

            <b-button type="submit" variant="primary" class="btn-block">Send Forgot Password Instructions</b-button>
          </b-form>

          <div class="form-group text-center">
            Try <a href="#" @click="goToSignInPage">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ForgotPassword',
    data() {
      return {
        email : ""
      }
    },
    methods : {
      goToSignInPage: function() {
        this.$router.push({path: 'login', name: 'login'})
      },
      handleSubmit: function(e) {
        e.preventDefault();

        this.$http.post("/password", {
          user: { email: this.email }
        })
        .then(response => {
          this.$bvToast.toast("Check your email for reset instructions.", {
            title: "primary",
            toaster: "b-toaster-bottom-right",
            solid: true,
            appendToast: false
          });
          this.$router.push({path: 'login', name: 'login'})

        })
        .catch(error => {
          this.$parent.toast(error);
        });
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
