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
            <td v-for="month in 3" :key="month">{{ month }} / {{ selectedYear }}</td>
          </tr>
        </thead>
        <tbody v-for="(subCategories, category) in expectedMonthlyBudget" :key="category">
          <tr v-for="(yearExpenses, subCategory, idx) in subCategories" :key="subCategory">
            <td :rowspan="Object.keys(subCategories).length + 1" v-if="idx == 0">
              {{ category }}
            </td>

            <td>
              {{ subCategory }}
            </td>

            <td v-for="month in 3" :key="month" @dblclick="toggleEditingMoney(yearExpenses[selectedYear][month])">
              <div v-if="!yearExpenses[selectedYear][month].editing">
                Rs. {{ yearExpenses[selectedYear][month].value }}
              </div>
              <div v-if="yearExpenses[selectedYear][month].editing">
                <input @keyup.esc="cancelEditingMoney(yearExpenses[selectedYear][month])" @keyup.enter="doneEditingMoney(yearExpenses[selectedYear][month])" @blur="doneEditingMoney(yearExpenses[selectedYear][month])" v-focus type="text" v-model="yearExpenses[selectedYear][month].value" />
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <input type="text" placeholder="Add a category..." @keyup.enter="addSubCategory(category)" @keyup.esc="cancelAddingSubCategory(category)" v-model="newCategory[category]" />
            </td>
            <td v-for="month in 3" :key="month"></td>
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
      this.$set(this.expectedMonthlyBudget[category], [this.newCategory[category]], {
          "2020": {
            "1": {
              "value": 0,
              "editing": false
            },
            "2": {
              "value": 0,
              "editing": false
            },
            "3": {
              "value": 0,
              "editing": false
            }
          }
        });

      this.newCategory[category] = '';
    },
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
      expectedMonthlyBudget: {
        "Income": {
          "Salary":  { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } },
          "Illegal": { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } } },
        "Expense": {
          "Rent": { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } },
          "Car": { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } },
          "Bike": { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } } },
        "EMI": {
          "Fridge": { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } },
          "Washing Machine": { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } },
          "TV": { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } }
        },
        "EquityInvestment": {
          "MF": { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } },
          "Stocks": { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } }
        },
        "DebtInvestment": {
          "FD": { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } },
          "RD": { "2020": { "1": { "value": 1231312, "editing": false }, "2": { "value": 324, "editing": false }, "3": { "value": 324324, "editing": false } } }
        }
      }
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
