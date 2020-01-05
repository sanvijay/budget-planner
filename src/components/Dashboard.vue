<template>
  <div class="hello">
    <p>
      This is Dashboard page.
    </p>
    <select v-model="selectedYear">
      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
    </select>
    <div>
      <table border="1">
        <thead>
          <tr>
            <td></td>
            <td></td>
            <td v-for="month in 12" :key="month">{{ month }} / {{ selectedYear }}</td>
          </tr>
        </thead>
        <tbody v-for="(subCategories, category) in categories" :key="category">
          <tr v-if="subCategories.length == 0">
            <td rowspan="2">
              {{ category }}
            </td>
            <td v-for="empty in 13" :key="empty"></td>
          </tr>
          <tr v-for="(subCategory, idx) in subCategories" :key="subCategory">
            <td :rowspan="subCategories.length + 1" v-if="idx == 0">
              {{ category }}
            </td>
            <td>
              {{ subCategory }}
            </td>

            <td v-if="expectedMonthlyBudget[category] != null" v-for="month in 12" :key="month" @dblclick="toggleEditingMoney(expectedMonthlyBudget[category][subCategory][selectedYear][month])" :class="{ 'error-cell': expectedMonthlyBudget[category][subCategory][selectedYear][month].error }">
              <div v-if="!expectedMonthlyBudget[category][subCategory][selectedYear][month].editing">
                Rs. {{ expectedMonthlyBudget[category][subCategory][selectedYear][month].value }}
              </div>
              <div v-if="expectedMonthlyBudget[category][subCategory][selectedYear][month].editing">
                <input @keyup.esc="cancelEditingMoney(expectedMonthlyBudget[category][subCategory][selectedYear][month])" @keyup.enter="doneEditingMoney(expectedMonthlyBudget[category][subCategory][selectedYear][month])" @blur="doneEditingMoney(expectedMonthlyBudget[category][subCategory][selectedYear][month])" v-focus type="text" v-model="expectedMonthlyBudget[category][subCategory][selectedYear][month].value" />
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <input type="text" placeholder="Add a category..." @keyup.enter="addSubCategory(category)" @keyup.esc="cancelAddingSubCategory(category)" v-model="newCategory[category]" />
            </td>
            <td v-for="month in 12" :key="month"></td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  directives: {
    focus: {
      // directive definition
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    initializeCategories: function() {
      this.$http.get('http://localhost:3000/users/' + localStorage.getItem('user') + '/categories', {
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': 'http://localhost:3000'
          }
        })
        .then(response => {
          for (var category in response.data) {
            this.$set(this.categories, category, response.data[category])
          }
          // this.categories = response.data;
        })
        .catch(function (error) {
            console.error(error.response);
        });
    },
    updateExpectedMonthlyBudget: function() {
      this.$http.get('http://localhost:3000/users/' + localStorage.getItem('user') + '/monthly_budgets', {
        params: { "year": this.selectedYear },
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': 'http://localhost:3000'
          }
        })
        .then(response => {
          var expectedMonthlyBudget = response.data;
          var selectedYear = this.selectedYear;

          for (var category in this.categories) {
            if(this.expectedMonthlyBudget[category] == null) { this.$set(this.expectedMonthlyBudget, category, {}) }
            if(expectedMonthlyBudget[category] == null) { expectedMonthlyBudget[category] = {} }

            for (var subCategory of this.categories[category]) {
              if(this.expectedMonthlyBudget[category][subCategory] == null) { this.$set(this.expectedMonthlyBudget[category], subCategory, {}) }
              if(expectedMonthlyBudget[category][subCategory] == null) { expectedMonthlyBudget[category][subCategory] = {} }

              if(this.expectedMonthlyBudget[category][subCategory][selectedYear] == null) { this.$set(this.expectedMonthlyBudget[category][subCategory], selectedYear, {}) }
              if(expectedMonthlyBudget[category][subCategory][selectedYear] == null) { expectedMonthlyBudget[category][subCategory][selectedYear] = {} }
              for (var month = 1; month <= 12; month++) {
                if(expectedMonthlyBudget[category][subCategory][selectedYear][month] == null) {
                  this.$set(this.expectedMonthlyBudget[category][subCategory][selectedYear], month, { "value": 0, "editing": false, "error": false })
                } else {
                  expectedMonthlyBudget[category][subCategory][selectedYear][month]["editing"] = false
                  expectedMonthlyBudget[category][subCategory][selectedYear][month]["error"] = false
                  this.$set(this.expectedMonthlyBudget[category][subCategory][selectedYear], month, expectedMonthlyBudget[category][subCategory][selectedYear][month])
                }
              }
            }
          }
        })
        .catch(function (error) {
            console.error(error.response);
        });
    },
    toggleEditingMoney: function(element) {
      this.cachedMoney = element.value;
      element.editing = true;
    },
    doneEditingMoney: function(element) {
      if(element.value.toString().trim() == '') { element.value = 0; }
      if(isNaN(element.value)) { element.error = true; }
      else { element.error = false; }

      element.editing = false;
    },
    cancelEditingMoney: function(element) {
      element.value = this.cachedMoney;
      element.editing = false;
    },
    cancelAddingSubCategory: function(category) {
      this.newCategory[category] = '';
    },
    addSubCategory: function(category) {
      this.$set(this.expectedMonthlyBudget[category], this.newCategory[category], {
          "2020": {
            "1": { "value": 0, "editing": false },
            "2": { "value": 0, "editing": false },
            "3": { "value": 0, "editing": false },
            "4": { "value": 0, "editing": false },
            "5": { "value": 0, "editing": false },
            "6": { "value": 0, "editing": false },
            "7": { "value": 0, "editing": false },
            "8": { "value": 0, "editing": false },
            "9": { "value": 0, "editing": false },
            "10": { "value": 0, "editing": false },
            "11": { "value": 0, "editing": false },
            "12": { "value": 0, "editing": false },
          }
        });
      this.categories[category].push(this.newCategory[category]);

      this.newCategory[category] = '';
    },
  },
  mounted: function () {
    this.initializeCategories();
    this.updateExpectedMonthlyBudget();
  },
  data: function() {
    return {
      years: [2019, 2020, 2021],
      selectedYear: 2020,
      cachedMoney: 0,
      newCategory: {
        "Income": '',
        "Expense": '',
        "EMI": '',
        "EquityInvestment": '',
        "DebtInvestment": ''
      },
      categories: {},
      expectedMonthlyBudget: {}
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
.error-cell {
  border-color: coral;
}
</style>
