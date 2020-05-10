<template>
  <div class="parent">
    <div class="container-fluid">
      <div class="row justify-content-center">

        <div class="col-md-3 col-sm-6 col-12 bg-light shadow-lg">
          <div class="alert alert-primary" role="alert" v-if="showSuccessMessage"> Check your email for reset instructions. </div>
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
            Try <router-link :to="{ name: 'login' }">Sign In</router-link>
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
        email : "",
        showSuccessMessage: false
      }
    },
    methods : {
      handleSubmit: function(e) {
        e.preventDefault();

        this.$http.post("/password", {
          user: { email: this.email }
        })
        .then(response => {
          this.email = "";
          this.showSuccessMessage = true;

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
