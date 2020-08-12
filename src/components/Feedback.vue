<template>
  <div class="parent">
    <div class="container">
      <div class="row" v-html="thanksMessage" style="text-align: center; display: inline-block"></div>
      <div class="row justify-content-center">

        <div class="col-md-6 col-sm-6 col-lg-6 bg-light shadow-lg">
          <b-form @submit="handleSubmit" class="form-container">
            <b-form-group
              id="input-group-1"
              :description="charactersLeft"
            >
              <b-form-textarea
                id="input-1"
                v-model="content"
                type="textarea"
                required
                placeholder="Write your feedback"
              ></b-form-textarea>
            </b-form-group>
            <small>Your responses will be anonymous.</small>

            <b-button type="submit" variant="primary" class="btn-block">Send Feedback</b-button>
          </b-form>
        </div>
      </div>
      <hr>
      <div class="row justify-content-center">
        <div class="col-md-6 col-sm-6 col-lg-6 bg-light shadow-lg">
          <p>Consider supporting us. Please email us to <a href="mailto:team.steven@gmail.com">team.steven@gmail.com</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Feedback',
    data: function() {
      return {
        content: "",
        thanksMessage: null
      }
    },
    computed: {
      charactersLeft: function() {
        var char = this.content.length,
            limit = 255;

        return (limit - char) + " / " + limit + " characters remaining";
      }
    },
    methods: {
      handleSubmit: function(e) {
        e.preventDefault();

        this.$http.post('/feedbacks', {
          feedback: { content: this.content }
        })
        .then(response => {
          this.thanksMessage = "Thanks for submitting your feedback";
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
