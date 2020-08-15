<template>
  <div class="parent">
    <div class="container">
      <div class="row" v-html="thanksMessage" style="text-align: center; display: inline-block"></div>
      <div class="row justify-content-center">

        <section class="contact-form-section pb-5">
          <div class="container pb-5">
               <div class="form-wrapper shadow-lg single-col-max-width mx-auto p-5">
                  <form @submit="handleSubmit" id="contact-form" class="contact-form" method="post" action="">
                    <h3 class="text-center mb-4">Feedback</h3>
                    <div class="form-row">
                          <div class="form-group col-12">
                              <label class="sr-only" for="cmessage">Write your feedback</label>
                              <textarea v-model="content" class="form-control" id="cmessage" name="message" placeholder="Write your feedback" rows="10" required="" aria-required="true"></textarea>
                              <small>Your responses will be anonymous.</small>
                          </div>
                           <div class="form-group col-12">
                              <button type="submit" class="btn btn-block btn-primary py-2">Send Feedback</button>
                          </div>
                          <hr><p>Consider supporting us. Please email us to <a href="mailto:team.finsey@gmail.com">team.finsey@gmail.com</a></p>                   
                      </div><!--//form-row-->
                  </form>
               </div>
          </div><!--//container-->
        </section><!--//contact-form-section-->
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
