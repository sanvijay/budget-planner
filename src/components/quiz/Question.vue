<template>
  <div style="text-align: left;">
    <strong><u> Question {{ questionNumber }}</u>:</strong><br/>
      <strong>{{ question.text }} </strong>

      <div v-if="question.type === 'tf'">
        <b-form-group>
          <b-form-radio v-model="answer" name="currentQuestion" id="trueAnswer" value="t" required>True</b-form-radio>
          <b-form-radio v-model="answer" name="currentQuestion" id="falseAnswer" value="f" required>False</b-form-radio>
        </b-form-group>
      </div>

      <div v-if="question.type === 'mc'">
        <b-form-group>
          <div v-for="(mcanswer, index) in question.answers">
            <b-form-radio v-model="answer" name="currentQuestion" :id="'answer'+index" :value="mcanswer">{{ mcanswer }}</b-form-radio>
          </div>
        </b-form-group>
      </div>

      <button class="btn btn-primary" @click="submitAnswer">Answer</button>
  </div>
</template>

<script>
export default {
  name: 'Question',
  data: function() {
    return {
      answer: null
    }
  },
  props: ['question', 'question-number'],
  methods:{
    submitAnswer:function() {
      if(this.answer == null) { return; }
      this.$emit('answer', {answer:this.answer});
      this.answer = null;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
