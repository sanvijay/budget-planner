<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8">
        <p class="h5 float-left">
          Benefits
        </p>
        <br><hr>

        <div class="shadow-lg" style="padding: 5px;">
          <table class="table-sm table-bordered table-responsive">

            <thead>
              <th>title</th>
              <th>value</th>
              <th>score_weightage_out_of_100</th>
              <th></th>
            </thead>

            <tbody>
              <tr v-for="benefit in benefits" :key="benefit._id.$oid">
                <td @dblclick="toggleEditingBenefit(benefit, 'title')">
                  <div v-if="!showInput(benefit, 'title')">
                    {{ benefit.title }}
                  </div>
                  <div v-if="showInput(benefit, 'title')">
                    <input class="form-control input-sm" v-focus type="text" v-model="benefit.title" @blur="updateBenefit(benefit)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(benefit, 'title')">
                  </div>
                </td>
                <td @dblclick="toggleEditingBenefit(benefit, 'value')">
                  <div v-if="!showInput(benefit, 'value')">
                    &#8377; {{ benefit.value }}
                  </div>
                  <div v-if="showInput(benefit, 'value')">
                    <input class="form-control input-sm" v-focus type="text" v-model="benefit.value" @blur="updateBenefit(benefit)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(benefit, 'value')">
                  </div>
                </td>
                <td @dblclick="toggleEditingBenefit(benefit, 'score_weightage_out_of_100')">
                  <div v-if="!showInput(benefit, 'score_weightage_out_of_100')">
                    {{ benefit.score_weightage_out_of_100 }}
                  </div>
                  <div v-if="showInput(benefit, 'score_weightage_out_of_100')">
                    <input class="form-control input-sm" v-focus type="text" v-model="benefit.score_weightage_out_of_100" @blur="updateBenefit(benefit)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(benefit, 'score_weightage_out_of_100')">
                  </div>
                </td>
                <td></td>
              </tr>
              <tr>
                <td><input class="form-control input-sm" type="text" v-model="newBenefit.title"></td>
                <td><input class="form-control input-sm" type="text" v-model="newBenefit.value"></td>
                <td><input class="form-control input-sm" type="text" v-model="newBenefit.score_weightage_out_of_100"></td>
                <td colspan="3" style="min-width: 70px"><button class="btn btn-primary" @click="saveNewBenefit">Save</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
      this.$http.get('users/' + localStorage.getItem('user') + '/benefits')
        .then(response => {
          this.benefits = response.data;
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
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
      this.$http.put('users/' + localStorage.getItem('user') + '/benefits/' + benefit._id.$oid, { benefit: benefit })
        .then(response => {
          benefit.editing = null;
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.loadBenefits();
          this.$parent.$parent.toast(error);
        });
    },
    saveNewBenefit: function() {
      this.$http.post('users/' + localStorage.getItem('user') + '/benefits', { benefit: this.newBenefit })
        .then(response => {
          this.benefits.push(response.data);
          this.newBenefit.title = null;
          this.newBenefit.value = null;
          this.newBenefit.score_weightage_out_of_100 = null;
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
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
input, button {
  max-height: 24px;
  width: 100%;
}
button {
  padding: 0px;
}
</style>
