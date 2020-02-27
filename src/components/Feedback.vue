<template>
  <div class="parent">

    <div class="LeadImage">
      <div class="image" style="background-image: url('img/common-backgroud.svg'), url('img/common-backgroud.svg');"></div>
      <div class="ie-hack-vertical"></div>
      <div class="ie-hack-horizontal"></div>
      <div class="triangle">
        <svg fill="white" preserveAspectRatio="none" viewBox="0 0 25 100" class="jsx-4194311832 Triangle">
          <polygon points="0,100 25,0 25,100" class="jsx-4194311832"></polygon>
        </svg>
      </div>
    </div>

    <div class="container">
      <div class="row" v-html="thanksMessage" style="text-align: center; display: inline-block"></div>
      <div class="row justify-content-center">

        <div class="col-md-6 col-sm-6 col-lg-6 bg-light shadow-lg">
          <b-form @submit="handleSubmit" class="form-container">
            <b-form-group
              id="input-group-1"
              description="Your feedback is anonymous."
            >
              <b-form-textarea
                id="input-1"
                v-model="content"
                type="textarea"
                required
                placeholder="Write your feedback"
              ></b-form-textarea>
            </b-form-group>

            <b-button type="submit" variant="primary" class="btn-block">Send Feedback</b-button>
          </b-form>
        </div>
      </div>
      <hr>
      <div class="row justify-content-center">

        <div class="col-md-6 col-sm-6 col-lg-6 bg-light shadow-lg">
          <p>Consider supporting us. Please email us to <a href="mailto:team.finsey@gmail.com">team.finsey@gmail.com</a></p>
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
