<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8">
        <p class="h5 float-left">
          Your Goals <b-link id="tooltip-target-goal" style="text-decoration: none;">&#128161;</b-link>
          <b-tooltip target="tooltip-target-goal" triggers="hover">
            Set your goals. Goals can be anything from your child's MBA to buying an aeroplane. You want to close your loan, track it here. By adding a goal, it changes your plans accordingly.
          </b-tooltip>
        </p>
        <br><hr>

        <div class="shadow-lg bg-light" style="padding: 5px;">
          <table class="table-sm table-bordered table-responsive">
            <thead>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Target</th>
              <th>Planned</th>
              <th>Overall Saved</th>
            </thead>

            <tbody>
              <tr v-for="goal in goals" :key="goal._id.$oid">
                <td @click="toggleEditingGoal(goal, 'description')">
                  <div v-if="!showInput(goal, 'description')">
                    {{ goal.description }}
                  </div>
                  <div v-if="showInput(goal, 'description')">
                    <input class="form-control input-sm" v-focus type="text" v-model="goal.description" @blur="updateGoal(goal)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(goal, 'description')">
                  </div>
                </td>
                <td @click="toggleEditingGoal(goal, 'start_date')">
                  <div v-if="!showInput(goal, 'start_date')">
                    {{ goal.start_date }}
                  </div>
                  <div v-if="showInput(goal, 'start_date')">
                    <input class="form-control input-sm" v-focus type="date" v-model="goal.start_date" @blur="updateGoal(goal)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(goal, 'start_date')">
                  </div>
                </td>
                <td @click="toggleEditingGoal(goal, 'end_date')">
                  <div v-if="!showInput(goal, 'end_date')">
                    {{ goal.end_date }}
                  </div>
                  <div v-if="showInput(goal, 'end_date')">
                    <input class="form-control input-sm" v-focus type="date" v-model="goal.end_date" @blur="updateGoal(goal)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(goal, 'end_date')">
                  </div>
                </td>
                <td @click="toggleEditingGoal(goal, 'target')">
                  <div v-if="!showInput(goal, 'target')">
                    $ {{ goal.target }}
                  </div>
                  <div v-if="showInput(goal, 'target')">
                    <input class="form-control input-sm" v-focus type="text" v-model="goal.target" @blur="updateGoal(goal)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(goal, 'target')">
                  </div>
                </td>
                <td>$ {{ goal.planned.toFixed(2) }}</td>
                <td>$ {{ goal.actual.toFixed(2) }}</td>
              </tr>
              <tr>
                <td><input class="form-control input-sm" type="text" v-model="newGoal.description"></td>
                <td><input class="form-control input-sm" type="date" v-model="newGoal.start_date"></td>
                <td><input class="form-control input-sm" type="date" v-model="newGoal.end_date"></td>
                <td><input class="form-control input-sm" type="text" v-model="newGoal.target"></td>
                <td colspan="2"><button class="btn btn-primary" @click="saveNewGoal">Save</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-md-4">
        <div style="min-width: 250px">
          <Adsense
            :data-ad-client="ad_client"
            :data-ad-slot="ad_slot"
            data-ad-format="rectangle"
            :data-full-width-responsive="true"
          >
          </Adsense>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Goal',
  data: function() {
    return {
      goals: [],
      previousValue: null,
      newGoal: {
        description: null,
        start_date: null,
        end_date: null,
        target: null
      },
      ad_client: process.env.VUE_APP_ADSENSE_PUB,
      ad_slot: process.env.VUE_APP_ADSENSE_SQUARE_SLOT
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
    cancelEdit: function(goal, field) {
      goal[field] = this.previousValue;
      goal.editing = null;
    },
    loadGoals: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/goals')
        .then(response => {
          this.goals = response.data;
        })
        .catch(function (error) {
          console.error(error.response);
        });
    },
    toggleEditingGoal: function(goal, field) {
      this.previousValue = goal[field];
      this.$set(goal, 'editing', field)
    },
    showInput: function(goal, field) {
      return (goal.editing == field);
    },
    updateGoal: function(goal) {
      this.$http.put('users/' + localStorage.getItem('user') + '/goals/' + goal._id.$oid, {
          goal: goal
        })
        .then(response => {
          goal.editing = null;
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.loadGoals();
          this.$parent.$parent.toast(error);
        });
    },
    saveNewGoal: function() {
      this.$http.post('users/' + localStorage.getItem('user') + '/goals', {
          goal: this.newGoal
        })
        .then(response => {
          var data = response.data;
          data.actual = 0;
          data.planned = 0;
          this.goals.push(data);
          this.newGoal.description = null;
          this.newGoal.start_date = null;
          this.newGoal.end_date = null;
          this.newGoal.target = null;
          this.newGoal.score_weightage_out_of_100 = null;
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });
    }
  },
  mounted: function () {
    this.loadGoals();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
td {
  max-width: 120px;
  min-width: 120px;
}
input, button {
  max-height: 24px;
  width: 100%;
}
button {
  padding: 0px;
}
</style>
