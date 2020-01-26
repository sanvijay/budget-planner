<template>
  <div>
    <p>
      This is Goal page.
    </p>

    <div>
      <table border="1">
        <thead>
          <th>description</th>
          <th>start_date</th>
          <th>end_date</th>
          <th>target</th>
          <th>planned</th>
          <th>score_weightage_out_of_100</th>
          <th>deleted</th>
          <th>completed</th>
        </thead>

        <tbody>
          <tr v-for="goal in goals" :key="goal._id.$oid">
            <td @dblclick="toggleEditingGoal(goal, 'description')">
              <div v-if="!showInput(goal, 'description')">
                {{ goal.description }}
              </div>
              <div v-if="showInput(goal, 'description')">
                <input v-focus type="text" v-model="goal.description" @blur="updateGoal(goal)" @keyup.enter="updateGoal(goal)" @keyup.esc="cancelEdit(goal, 'description')">
              </div>
            </td>
            <td @dblclick="toggleEditingGoal(goal, 'start_date')">
              <div v-if="!showInput(goal, 'start_date')">
                {{ goal.start_date }}
              </div>
              <div v-if="showInput(goal, 'start_date')">
                <input v-focus type="date" v-model="goal.start_date" @blur="updateGoal(goal)" @keyup.enter="updateGoal(goal)" @keyup.esc="cancelEdit(goal, 'start_date')">
              </div>
            </td>
            <td @dblclick="toggleEditingGoal(goal, 'end_date')">
              <div v-if="!showInput(goal, 'end_date')">
                {{ goal.end_date }}
              </div>
              <div v-if="showInput(goal, 'end_date')">
                <input v-focus type="date" v-model="goal.end_date" @blur="updateGoal(goal)" @keyup.enter="updateGoal(goal)" @keyup.esc="cancelEdit(goal, 'end_date')">
              </div>
            </td>
            <td @dblclick="toggleEditingGoal(goal, 'target')">
              <div v-if="!showInput(goal, 'target')">
                {{ goal.target }}
              </div>
              <div v-if="showInput(goal, 'target')">
                <input v-focus type="text" v-model="goal.target" @blur="updateGoal(goal)" @keyup.enter="updateGoal(goal)" @keyup.esc="cancelEdit(goal, 'target')">
              </div>
            </td>
            <td>{{ goal.planned }}</td>
            <td @dblclick="toggleEditingGoal(goal, 'score_weightage_out_of_100')">
              <div v-if="!showInput(goal, 'score_weightage_out_of_100')">
                {{ goal.score_weightage_out_of_100 }}
              </div>
              <div v-if="showInput(goal, 'score_weightage_out_of_100')">
                <input v-focus type="text" v-model="goal.score_weightage_out_of_100" @blur="updateGoal(goal)" @keyup.enter="updateGoal(goal)" @keyup.esc="cancelEdit(goal, 'score_weightage_out_of_100')">
              </div>
            </td>
            <td>{{ goal.deleted }}</td>
            <td>{{ goal.completed }}</td>
          </tr>
          <tr>
            <td><input type="text" v-model="newGoal.description"></td>
            <td><input type="date" v-model="newGoal.start_date"></td>
            <td><input type="date" v-model="newGoal.end_date"></td>
            <td><input type="text" v-model="newGoal.target"></td>
            <td colspan="3"><button @click="saveNewGoal">Save</button></td>
          </tr>
        </tbody>
      </table>
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
        target: null,
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
    cancelEdit: function(goal, field) {
      goal[field] = this.previousValue;
      goal.editing = null;
    },
    loadGoals: function() {
      this.$http.get(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/goals', {
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
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
      this.$http.put(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/goals/' + goal._id.$oid, {
          goal: goal,
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          goal.editing = null;
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.loadGoals();
          console.error(error.response);
        });
    },
    saveNewGoal: function() {
      this.$http.post(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/goals', {
          goal: this.newGoal,
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          this.goals.push(response.data);
          this.newGoal.description = null;
          this.newGoal.start_date = null;
          this.newGoal.end_date = null;
          this.newGoal.target = null;
          this.newGoal.score_weightage_out_of_100 = null;
        })
        .catch(function (error) {
          console.error(error.response);
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

</style>
