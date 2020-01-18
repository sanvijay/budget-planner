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
            <td rowspan="3">
              {{ category }}
            </td>
            <td> - </td>
            <td v-for="empty in 12" :key="empty">
              Rs. 0
            </td>
          </tr>
          <tr v-for="(subCategory, idx) in subCategories" :key="subCategory">
            <td :rowspan="subCategories.length + 2" v-if="idx == 0">
              {{ category }}
            </td>
            <td>
              {{ subCategory }}
            </td>

            <td v-if="expectedMonthlyBudget[category] != null && expectedMonthlyBudget[category][subCategory][selectedYear] != null" v-for="month in 12" :key="month" @dblclick="toggleEditingMoney(expectedMonthlyBudget[category][subCategory][selectedYear][month])" :class="{ 'error-cell': expectedMonthlyBudget[category][subCategory][selectedYear][month].error }">
              <div v-if="!expectedMonthlyBudget[category][subCategory][selectedYear][month].editing">
                Rs. {{ expectedMonthlyBudget[category][subCategory][selectedYear][month].value }}
              </div>
              <div v-if="expectedMonthlyBudget[category][subCategory][selectedYear][month].editing">
                <input @keyup.esc="cancelEditingMoney(expectedMonthlyBudget[category][subCategory][selectedYear][month])" @keyup.enter="doneEditingMoney(expectedMonthlyBudget[category][subCategory][selectedYear][month], month, selectedYear, subCategory)" @blur="doneEditingMoney(expectedMonthlyBudget[category][subCategory][selectedYear][month], month, selectedYear, subCategory)" v-focus type="text" v-model="expectedMonthlyBudget[category][subCategory][selectedYear][month].value" />
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <input type="text" placeholder="Add a category..." @keyup.enter="addSubCategory(category)" @keyup.esc="cancelAddingSubCategory(category)" v-model="newCategory[category]" />
            </td>
            <td v-for="empty in 12" :key="empty"></td>
          </tr>

          <tr>
            <td> Sub-Total </td>
            <td v-for="month in 12" :key="month">
              Rs. {{ subTotal(category, month, selectedYear) }}
            </td>
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
    subTotal: function(category, month, year) {
      var total = 0;
      for (var subCategory in this.expectedMonthlyBudget[category]) {
        total += this.expectedMonthlyBudget[category][subCategory][year][month].value;
      }
      return total;
    },
    initializeCategories: function() {
      this.$http.get(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/categories', {
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          for (var category in response.data) {
            this.$set(this.categories, category, response.data[category])
          }
        })
        .catch(function (error) {
            console.error(error.response);
        });
    },
    updateExpectedMonthlyBudget: function() {
      this.$http.get(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/monthly_budgets', {
        params: { "year": this.selectedYear },
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
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

          this.populatedYears.push(selectedYear);
        })
        .catch(function (error) {
            console.error(error.response);
        });
    },
    toggleEditingMoney: function(element) {
      this.cachedMoney = element.value;
      element.editing = true;
    },
    doneEditingMoney: function(element, month, year, subCategory) {
      if(element.value.toString().trim() == '') { element.value = 0; }

      if(isNaN(element.value)) { element.error = true; }
      else if(element.value != this.cachedMoney) {
        element.error = false;
        var formattedMonth = ("0" + month).slice(-2);

        this.$http.post(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/monthly_budgets/' + formattedMonth + year + '/expected_cash_flows', {
            "cash_flow": {
              category: subCategory,
              value: element.value
            },
            headers: {
              // https://github.com/axios/axios/issues/475
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
            }
          })
          .then(response => {
            element.value = Number(element.value);
          })
          .catch(error => {
            this.cancelEditingMoney(element);
            console.error(error.response);
          });
      }

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
      this.$http.post(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/categories', {
          "category": {
            "title": this.newCategory[category],
            "type": category
          },
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          var temp = {}
          for(var year of this.years) {
            if(temp[year.toString()] == null) { temp[year.toString()] = {} }
            for (var month = 1; month <= 12; month++) {
              temp[year.toString()][month.toString()] = { "value": 0, "editing": false }
            }
          }
          this.$set(this.expectedMonthlyBudget[category], this.newCategory[category], temp);

          this.categories[category].push(this.newCategory[category]);
          this.newCategory[category] = '';
        })
        .catch(function (error) {
          console.error(error.response);
        });
    },
  },
  mounted: function () {
    this.initializeCategories();
    this.updateExpectedMonthlyBudget();
  },
  watch: {
    selectedYear: function() {
      if(this.populatedYears.indexOf(this.selectedYear) == -1) {
        this.updateExpectedMonthlyBudget();
      }
    }
  },
  data: function() {
    return {
      years: [2019, 2020, 2021],
      selectedYear: 2020,
      populatedYears: [],
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
