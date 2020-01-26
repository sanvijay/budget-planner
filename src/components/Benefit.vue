<template>
  <div>
    <p>
      This is Benefit page.
    </p>

    <div>
      <table border="1">
        <thead>
          <th>title</th>
          <th>value</th>
          <th>score_weightage_out_of_100</th>
        </thead>

        <tbody>
          <tr v-for="benefit in benefits" :key="benefit._id.$oid">
            <td @dblclick="toggleEditingBenefit(benefit, 'title')">
              <div v-if="!showInput(benefit, 'title')">
                {{ benefit.title }}
              </div>
              <div v-if="showInput(benefit, 'title')">
                <input v-focus type="text" v-model="benefit.title" @blur="updateBenefit(benefit)" @keyup.enter="updateBenefit(benefit)" @keyup.esc="cancelEdit(benefit, 'title')">
              </div>
            </td>
            <td @dblclick="toggleEditingBenefit(benefit, 'value')">
              <div v-if="!showInput(benefit, 'value')">
                {{ benefit.value }}
              </div>
              <div v-if="showInput(benefit, 'value')">
                <input v-focus type="text" v-model="benefit.value" @blur="updateBenefit(benefit)" @keyup.enter="updateBenefit(benefit)" @keyup.esc="cancelEdit(benefit, 'value')">
              </div>
            </td>
            <td @dblclick="toggleEditingBenefit(benefit, 'score_weightage_out_of_100')">
              <div v-if="!showInput(benefit, 'score_weightage_out_of_100')">
                {{ benefit.score_weightage_out_of_100 }}
              </div>
              <div v-if="showInput(benefit, 'score_weightage_out_of_100')">
                <input v-focus type="text" v-model="benefit.score_weightage_out_of_100" @blur="updateBenefit(benefit)" @keyup.enter="updateBenefit(benefit)" @keyup.esc="cancelEdit(benefit, 'score_weightage_out_of_100')">
              </div>
            </td>
          </tr>
          <tr>
            <td><input type="text" v-model="newBenefit.title"></td>
            <td><input type="text" v-model="newBenefit.value"></td>
            <td><input type="text" v-model="newBenefit.score_weightage_out_of_100"></td>
            <td colspan="3"><button @click="saveNewBenefit">Save</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Benefit',
  data: function() {
    return {
      benefits: [],
      previousValue: null,
      newBenefit: {
        title: null,
        value: null,
        score_weightage_out_of_100: null
      }
    }
  },
  directives: {
    focus: {
      // directive definition
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    cancelEdit: function(benefit, field) {
      benefit[field] = this.previousValue;
      benefit.editing = null;
    },
    loadBenefits: function() {
      this.$http.get(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/benefits', {
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          this.benefits = response.data;
        })
        .catch(function (error) {
          console.error(error.response);
        });
    },
    toggleEditingBenefit: function(benefit, field) {
      this.previousValue = benefit[field];
      this.$set(benefit, 'editing', field)
    },
    showInput: function(benefit, field) {
      return (benefit.editing == field);
    },
    updateBenefit: function(benefit) {
      this.$http.put(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/benefits/' + benefit._id.$oid, {
          benefit: benefit,
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          benefit.editing = null;
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.loadBenefits();
          console.error(error.response);
        });
    },
    saveNewBenefit: function() {
      this.$http.post(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/benefits', {
          benefit: this.newBenefit,
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          this.benefits.push(response.data);
          this.newBenefit.title = null;
          this.newBenefit.value = null;
          this.newBenefit.score_weightage_out_of_100 = null;
        })
        .catch(function (error) {
          console.error(error.response);
        });
    }
  },
  mounted: function () {
    this.loadBenefits();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
