<template>
  <div>
    <div class="container">
      <div class="row">
        <div style="min-width: 250px; max-height: 110px">
          <Adsense
            :data-ad-client="ad_client"
            :data-ad-slot="ad_slot"
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          >
          </Adsense>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 col-lg-3"></div>
        <div class="col-sm-12 col-md-6 col-lg-6 bg-light shadow-lg">
          <br>
          <div v-if="quizStage == 'collectInfo'">
            <p>
              Hi! Welcome to <b><span class="logo">finsey<span class="text-primary">.</span></span></b>
            </p>

            <q><b><span class="logo">finsey<span class="text-primary">.</span></span></b> <span style="font-style: italic;">is the budget planner project designed during quarantine period. Planning your budget will make sure to pass any critical stages and have a peaceful future.</span></q><br><br>

            <p style="text-align: left !important">Enter your name to continue.</p>
            <input class="form-control input-sm" type="text" v-model="quiz.name">
            <br>
            <button class="btn btn-primary" @click="moveToIntro">Continue</button>
          </div>

          <div v-if="quizStage == 'intro'">
            <div>
              <p>Hi {{ quiz.name }}! Do you plan the budget on your personal life?</p>

              <b-form-group :disabled="showMessageOnPlanBudget != ''">
                <b-form-radio v-model="quiz.planned_before" name="currentQuestion" id="trueAnswer" value="t" inline>Yes</b-form-radio>
                <b-form-radio v-model="quiz.planned_before" name="currentQuestion" id="falseAnswer" value="f" inline>No</b-form-radio>
              </b-form-group>
            </div>

            <button v-if="showMessageOnPlanBudget == ''" class="btn btn-primary" @click="showQuizOption">Submit!</button>
            <br><br>

            <div v-if="showMessageOnPlanBudget == 't'">
              <p>Well! Here you can take up the quiz to understand how well you know about budgeting.</p>
              <button class="btn btn-primary" @click="startQuiz">Start Quiz!</button>
            </div>
            <div v-if="showMessageOnPlanBudget == 'f'">
              <p>Well! Here you can take up the quiz to understand how well you know about budgeting.</p>
              <button class="btn btn-primary" @click="startQuiz">Start Quiz!</button>
            </div>
          </div>

          <div v-if="quizStage == 'question'">
            <Question
              :question="questions[currentQuestion]"
              v-on:answer="handleAnswer"
              :question-number="currentQuestion+1"
            ></Question>
          </div>

          <div v-if="quizStage == 'result'">
            <p>Thanks for taking up the quiz.</p>
            <p>You have scored {{ quiz.score * 10 }}%.</p>

            <p>Share your score on Whatsapp / Facebook and help your friends to know their score.</p>
            <a :href="whatsappScoreText" data-action="share/whatsapp/share" class="btn btn-success whatsapp-font"><b><font-awesome-icon :icon="['fab', 'whatsapp']" />&nbsp; Share your score on Whatsapp</b></a><br><br>
            <a :href="fbScoreText" data-action="share/whatsapp/share" class="btn btn-primary whatsapp-font"><b><font-awesome-icon :icon="['fab', 'facebook']" />&nbsp; Share your score on Facebook</b></a>
          </div>

          <br>
        </div>
        <div class="col-md-3 col-lg-3"></div>
      </div>
      <br>
      <div class="row">
        <div class="col-md-3 col-lg-3"></div>
        <div class="col-sm-12 col-md-6 col-lg-6 bg-light shadow-lg">
          <p>Do support us by sharing <b><span class="logo">finsey<span class="text-primary">.</span></span></b> to your friends</p>

          <div class="row">
            <div class="col-lg-3"></div>
            <div class="col-lg-3 col-sm-6" style="padding-top: 10px">
              <div class="fb-share-button" data-href="https://www.facebook.com/Finsey-101336774850608/?__tn__=kC-R&amp;eid=ARC8ahdrFsmhIqNZ97cAmX6mS6m5AC2-RcbN8j5uzRgFp2CvZhwQWV9IvfSHZJ3CgZAMc-m3qtWnpv_1&amp;hc_ref=ARSK7c5a8gvX5S-JVOnmW8VT_KQIOWkLaPB93oNas3icWO2bm5NvTWaFTBefg6Gat5g&amp;ref=nf_target&amp;__xts__%5B0%5D=68.ARCdpSkXjpY84i-iXjly-RJOP7jwB_t6ywEIzYGVrOocLdU-3lB8CPXnZaE_2l02Bx9uKNz0cVkTEupXQcj383eARucVSeRLmZQZuKJER19oeyyaWWxMu-0qcqq96qM89_QeEeUC_ymz-dqfEjyDNDpyM--fhjOBn8D18-dkSzvPD5FHPcx5xjySI3SxqoAEMKbF1VIbMAO3oFEF8EztVEqCi9G7F_K200VsNPeZOxyZAsnezLM8F2y_FYTzlrLOhUC5MivvYX-e5Gn8enNSz7CBW1SEFMe3jHyYBZfjm0ZczfwQeBbIkxV3Rfw" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.facebook.com%2FFinsey-101336774850608%2F%3F__tn__%3DkC-R%26eid%3DARC8ahdrFsmhIqNZ97cAmX6mS6m5AC2-RcbN8j5uzRgFp2CvZhwQWV9IvfSHZJ3CgZAMc-m3qtWnpv_1%26hc_ref%3DARSK7c5a8gvX5S-JVOnmW8VT_KQIOWkLaPB93oNas3icWO2bm5NvTWaFTBefg6Gat5g%26ref%3Dnf_target%26__xts__%255B0%255D%3D68.ARCdpSkXjpY84i-iXjly-RJOP7jwB_t6ywEIzYGVrOocLdU-3lB8CPXnZaE_2l02Bx9uKNz0cVkTEupXQcj383eARucVSeRLmZQZuKJER19oeyyaWWxMu-0qcqq96qM89_QeEeUC_ymz-dqfEjyDNDpyM--fhjOBn8D18-dkSzvPD5FHPcx5xjySI3SxqoAEMKbF1VIbMAO3oFEF8EztVEqCi9G7F_K200VsNPeZOxyZAsnezLM8F2y_FYTzlrLOhUC5MivvYX-e5Gn8enNSz7CBW1SEFMe3jHyYBZfjm0ZczfwQeBbIkxV3Rfw&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share on Facebook</a></div>
            </div>
            <div class="col-lg-3 col-sm-6" style="padding-top: 10px">
              <a :href="whatsappText" data-action="share/whatsapp/share" class="btn btn-success whatsapp-font"><b><font-awesome-icon :icon="['fab', 'whatsapp']" />&nbsp; Share on Whatsapp</b></a>
            </div>
            <div class="col-lg-3"></div>
          </div>
          <hr>
        </div>
        <div class="col-md-3 col-lg-3"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Question from './quiz/Question.vue'

export default {
  name: 'Quiz',
  data: function() {
    return {
      quiz: {
        id: null,
        name: null,
        planned_before: null,
        score: 0
      },
      quizStage: '',
      showMessageOnPlanBudget: '',
      questions: [
        {
          "text": "Which is the right age to start budget planning?",
          "type": "mc",
          "answers": [
            "Lesser than 30",
            "30 to 45",
            "Greater than 45",
            "Any age"
          ],
          "answer": "Any age"
        },
        {
          "text": "How can a personal budget benefits an individual?",
          "type": "mc",
          "answers": [
            "A budget identifies current income available and ways that money is spent.",
            "A budget creates a path to achieve your goal.",
            "A budget identifies current expenses and personal savings plan.",
            "All of the above."
          ],
          "answer": "All of the above."
        },
        {
          "text": "Based on the 50/30/20 rule for allocating resources, which of the following percentages of after salary income should be devoted to savings?",
          "type": "mc",
          "answers": [
            "50",
            "0",
            "20",
            "30"
          ],
          "answer": "20"
        },
        {
          "text": "I feel like my monthly after tax income is too low. I have too many loans to pay. What am I doing wrong?",
          "type": "mc",
          "answers": [
            "I should start earning more",
            "I should do a better budget planning",
            "Continue spending all the income on loans"
          ],
          "answer": "I should do a better budget planning"
        },
        {
          "text": "Which of the following is NOT classified as a spending need?",
          "type": "mc",
          "answers": [
            "Electricity bill",
            "Rent for home",
            "Movie tickets",
            "Grocery bill"
          ],
          "answer": "Movie tickets"
        },
        {
          "text": "Which of the following is considered to be a long-term financial goal?",
          "type": "mc",
          "answers": [
            "Buying a new car",
            "Saving for a retirement fund",
            "Paying a specific amount on a credit card bill",
            "Saving for a family vacation"
          ],
          "answer": "Saving for a retirement fund"
        },
        {
          "text": "Which of the following is considered to be a short-term goal?",
          "type": "mc",
          "answers": [
            "Saving for a college education",
            "Saving for a retirement fund",
            "Starting a new career",
            "Saving for a family vacation"
          ],
          "answer": "Saving for a family vacation"
        },
        {
          "text": "Which of the following are goals which can be achieved in less than a year of time?",
          "type": "mc",
          "answers": [
            "Short-term goals",
            "Lifetime goals",
            "Intermediate-term goals",
            "Long-term goals"
          ],
          "answer": "Short-term goals"
        },
        {
          "text": "Should my assets be greater than my liabilities?",
          "type": "mc",
          "answers": [
            "Yes",
            "No"
          ],
          "answer": "Yes"
        },
        {
          "text": "How much should you have as an emergency corpus?",
          "type": "mc",
          "answers": [
            "One month of your salary",
            "Three to six month of your salary",
            "It is not suggested to have an emergency corpus"
          ],
          "answer": "Three to six month of your salary"
        }
      ],
      currentQuestion: 0,
      answers: [],
      ad_client: process.env.VUE_APP_ADSENSE_PUB,
      ad_slot: process.env.VUE_APP_ADSENSE_HORIZONTAL_SLOT
    }
  },
  created: function() {
    if(localStorage.getItem('quizStage') == null || localStorage.getItem('quizName') == null || localStorage.getItem('quizID') == null) {
      localStorage.setItem('quizStage', 'collectInfo');
      localStorage.removeItem('quizResult');
    }
    else if(localStorage.getItem('quizStage') == 'result' && localStorage.getItem('quizResult') == null) {
      localStorage.setItem('quizStage', 'collectInfo');
    }
    else if(localStorage.getItem('quizStage') == 'result') {
      this.quiz.score = localStorage.getItem('quizResult');
    }

    this.quiz.id = localStorage.getItem('quizID');
    this.quiz.name = localStorage.getItem('quizName');
    this.quizStage = localStorage.getItem('quizStage');
  },
  methods: {
    moveToIntro() {
      if(this.quiz.name.toString().trim() == '') { return; }

      this.$http.post('quizs', { quiz: this.quiz })
        .then(response => {
          this.quiz.id = response.data._id.$oid;
          localStorage.setItem('quizStage', 'intro');
          localStorage.setItem('quizName', this.quiz.name);
          localStorage.setItem('quizID', this.quiz.id);
          this.quizStage = 'intro';
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.$parent.toast(error);
          return;
        });
    },
    startQuiz() {
      this.$http.put('quizs/' + this.quiz.id, { quiz: { planned_before: this.quiz.planned_before } })
        .then(response => {
          localStorage.setItem('quizStage', 'question');
          this.quizStage = 'question';
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.$parent.toast(error);
          return;
        });
    },
    handleAnswer(e) {
      this.answers[this.currentQuestion] = e.answer;

      if((this.currentQuestion + 1) === this.questions.length) {
        this.handleResults();
      } else {
        this.currentQuestion++;
      }
    },
    handleResults() {
      this.questions.forEach((a, index) => {
        if(this.answers[index] === a.answer) this.quiz.score++;        
      });

      this.$http.put('quizs/' + this.quiz.id, { quiz: { score: this.quiz.score } })
        .then(response => {
          localStorage.setItem('quizStage', 'result');
          localStorage.setItem('quizResult', this.quiz.score);
          this.quizStage = 'result';
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.$parent.toast(error);
          return;
        });
    },
    showQuizOption() {
      this.showMessageOnPlanBudget = this.quiz.planned_before;
    }
  },
  computed: {
    whatsappScoreText() {
      return "https://wa.me/?text=I+have+scored+" + (this.quiz.score * 10) + "%25+in+finsey+quiz.+Do+you+want+to+know+yours%3F+Click+http%3A%2F%2Ffinsey.in%2F%23%2Fquiz%0D%0A%0D%0Afinsey.+is+the+budget+planner+project+designed+during+the+quarantine+period.+Planning+your+budget+will+make+sure+to+pass+any+critical+stages+and+have+a+peaceful+future.";
    },
    whatsappText() {
      return "https://wa.me/?text=finsey+is+the+budget+planner+project+designed+during+the+quarantine+period.+Planning+your+budget+will+make+sure+to+pass+any+critical+stages+and+have+a+peaceful+future.%0D%0A%0D%0AStart+planning+your+budget+%F0%9F%92%B0by+clicking+below+link%0D%0Ahttp%3A%2F%2Ffinsey.in%2F%0D%0A%0D%0A%0D%0AKindly+support+us+by+sharing+it+with+your+friends.";
    },
    fbScoreText() {
      return "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffb.me%2Fteam.finsey%2F&quote=I+have+scored+" + (this.quiz.score * 10) + "+in+finsey+quiz.+Do+you+want+to+know+yours%3F+Click+http%3A%2F%2Ffinsey.in%2F%23%2Fquiz%0D%0A%0D%0Afinsey.+is+the+budget+planner+project+designed+during+the+quarantine+period.+Planning+your+budget+will+make+sure+to+pass+any+critical+stages+and+have+a+peaceful+future.";
    }
  },
  components: {
    Question
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.whatsapp-font {
  font-family: Helvetica, Arial, sans-serif;
  font-weight: bold;
  font-size: 13px;
  padding: 4px 11px 4px 11px;
}
</style>
