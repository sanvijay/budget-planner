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
          <tr v-for="(subCategory, idx) in subCategories" :key="subCategory.id">
            <td :rowspan="subCategories.length + 2" v-if="idx == 0">
              {{ category }}
            </td>
            <td>
              {{ subCategory.title }}
            </td>

            <td v-if="plannedMonthlyBudget[category] != null && plannedMonthlyBudget[category][subCategory.id][selectedYear] != null" v-for="month in 12" :key="month" @dblclick="toggleEditingMoney(plannedMonthlyBudget[category][subCategory.id][selectedYear][month])" :class="{ 'error-cell': plannedMonthlyBudget[category][subCategory.id][selectedYear][month].error }">
              <div v-if="!plannedMonthlyBudget[category][subCategory.id][selectedYear][month].editing">
                Rs. {{ plannedMonthlyBudget[category][subCategory.id][selectedYear][month].value }}
              </div>
              <div v-if="plannedMonthlyBudget[category][subCategory.id][selectedYear][month].editing">
                <input @keyup.esc="cancelEditingMoney(plannedMonthlyBudget[category][subCategory.id][selectedYear][month])" @keyup.enter="doneEditingMoney(plannedMonthlyBudget[category][subCategory.id][selectedYear][month], month, selectedYear, subCategory.id)" @blur="doneEditingMoney(plannedMonthlyBudget[category][subCategory.id][selectedYear][month], month, selectedYear, subCategory.id)" v-focus type="text" v-model="plannedMonthlyBudget[category][subCategory.id][selectedYear][month].value" />
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
              Rs. {{ subTotal(category, month, selectedYear) }} ({{ calculatePercentage(category, month, selectedYear) }})
            </td>
          </tr>

        </tbody>
        <tbody>
          <tr>
            <td colspan="2">Total Inflow</td>
            <td v-for="month in 12" :key="month">
              Rs. {{ totalInflow(month, selectedYear) }}
            </td>
          </tr>
          <tr>
            <td colspan="2">Total Outflow</td>
            <td v-for="month in 12" :key="month">
              Rs. {{ totalOutflow(month, selectedYear) }}
            </td>
          </tr>
          <tr>
            <td colspan="2">Total Balance</td>
            <td v-for="month in 12" :key="month">
              Rs. {{ totalInflow(month, selectedYear) - totalOutflow(month, selectedYear) }}
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
    totalInflow: function(month, year) {
      return this.subTotal("Income", month, year)
    },
    totalOutflow: function(month, year) {
      return (
        this.subTotal("Expense", month, year) +
        this.subTotal("EMI", month, year) +
        this.subTotal("DebtInvestment", month, year) +
        this.subTotal("EquityInvestment", month, year)
      )
    },
    subTotal: function(category, month, year) {
      var total = 0;

      for(var subCategory in this.plannedMonthlyBudget[category]) {
        if(this.plannedMonthlyBudget[category][subCategory][year] != null) {
          total += parseFloat(this.plannedMonthlyBudget[category][subCategory][year][month].value);
        }
      }

      if(isNaN(total)) { return 0; }
      else { return parseFloat(total.toFixed(2)); }
    },
    calculatePercentage: function(category, month, year) {
      var percentage = 0;
      if(category == "Income") {
        percentage = (this.subTotal(category, month, year) / this.totalInflow(month, year)) * 100
      } else {
        percentage = (this.subTotal(category, month, year) / this.totalOutflow(month, year)) * 100
      }

      if(isNaN(percentage)) { return 0; }
      else { return percentage.toFixed(2); }
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
    updatePlannedMonthlyBudget: function() {
      this.$http.get(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/monthly_budgets', {
        params: { "year": this.selectedYear },
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          var plannedMonthlyBudget = response.data;
          var selectedYear = this.selectedYear;

          for (var category in this.categories) {
            if(this.plannedMonthlyBudget[category] == null) { this.$set(this.plannedMonthlyBudget, category, {}) }
            if(plannedMonthlyBudget[category] == null) { plannedMonthlyBudget[category] = {} }

            for (var subCategory of this.categories[category]) {
              if(this.plannedMonthlyBudget[category][subCategory.id] == null) { this.$set(this.plannedMonthlyBudget[category], subCategory.id, {}) }
              if(plannedMonthlyBudget[category][subCategory.id] == null) { plannedMonthlyBudget[category][subCategory.id] = {} }

              if(this.plannedMonthlyBudget[category][subCategory.id][selectedYear] == null) { this.$set(this.plannedMonthlyBudget[category][subCategory.id], selectedYear, {}) }
              if(plannedMonthlyBudget[category][subCategory.id][selectedYear] == null) { plannedMonthlyBudget[category][subCategory.id][selectedYear] = {} }
              for (var month = 1; month <= 12; month++) {
                if(plannedMonthlyBudget[category][subCategory.id][selectedYear][month] == null) {
                  this.$set(this.plannedMonthlyBudget[category][subCategory.id][selectedYear], month, { "value": 0, "editing": false, "error": false })
                } else {
                  plannedMonthlyBudget[category][subCategory.id][selectedYear][month]["editing"] = false
                  plannedMonthlyBudget[category][subCategory.id][selectedYear][month]["error"] = false
                  this.$set(this.plannedMonthlyBudget[category][subCategory.id][selectedYear], month, plannedMonthlyBudget[category][subCategory.id][selectedYear][month])
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

        this.$http.post(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/monthly_budgets/' + formattedMonth + year + '/planned_cash_flows', {
            "cash_flow": {
              category_id: subCategory,
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
          this.$set(this.plannedMonthlyBudget[category], response.data.id, temp);

          this.categories[category].push(response.data);
          this.newCategory[category] = '';
        })
        .catch(function (error) {
          console.error(error.response);
        });
    },
  },
  mounted: function () {
    this.initializeCategories();
    this.updatePlannedMonthlyBudget();
  },
  watch: {
    selectedYear: function() {
      if(this.populatedYears.indexOf(this.selectedYear) == -1) {
        this.updatePlannedMonthlyBudget();
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
      plannedMonthlyBudget: {}
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
