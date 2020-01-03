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
            <td v-for="i in range(1, 12)" :key="i">{{ i }} / {{ selectedYear }}</td>
          </tr>
        </thead>
        <tbody v-for="category in Object.keys(categories)" :key="category">
          <tr v-for="(subCategory, idx) in categories[category]" :key="subCategory">
            <td :rowspan="categories[category].length" v-if="idx == 0">
              {{ category }}
            </td>
            <td>
              {{ subCategory }}
            </td>
            <td v-for="i in range(1, 3)" :key="i" @dblclick="toggleEditing(cell(i, category, subCategory))">
              <div v-if="!cell(i, category, subCategory).editing">
                Rs. {{ cell(i, category, subCategory).value }}
              </div>
              <div v-if="cell(i, category, subCategory).editing">
                <input @keyup.esc="cancelEditing(cell(i, category, subCategory))" @keyup.enter="doneEditing(cell(i, category, subCategory))" @blur="doneEditing(cell(i, category, subCategory))" v-focus type="text" v-model="cell(i, category, subCategory).value" />
              </div>
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
    range: function(start, end) {
      return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
    },
    toggleEditing: function(element) {
      this.beforeEditingCache = element.value;
      element.editing = true;
    },
    cell: function(month, category, subCategory) {
      return this.expectedMonthlyBudget[this.selectedYear.toString()][month.toString()][category][subCategory];
    },
    doneEditing: function(element) {
      if(element.value.toString().trim() == '') { element.value = 0; }
      element.editing = false;
    },
    cancelEditing: function(element) {
      element.value = this.beforeEditingCache;
      element.editing = false;
    },
  },
  data: function() {
    return {
      years: [2019, 2020, 2021],
      selectedYear: 2020,
      cachedMoney: 0,
      categories: {
        "Income": ["Salary", "Illegal"],
        "Expense": ["Rent", "Car", "Bike"],
        "EMI": ["Fridge", "Washing Machine", "TV", "Phone", "Laptop"],
        "EquityInvestment": ["MF", "Stocks"],
        "DebtInvestment": ["FD", "RD"]
      },
      beforeEditingCache: 0,
      expectedMonthlyBudget: {
        "2019": {
          "10": {
            "Income": { "Salary": 1030, "Illegal": 2030 },
            "Expense": { "Rent": 1200, "Car": 2600, "Bike": 2601, },
            "EMI": { "Phone": 1070, "TV": 2300, "Fridge": 0, "Washing Machine": 0, "Laptop": 0 },
            "EquityInvestment": { "MF": 1040, "Stocks": 2600 },
            "DebtInvestment": { "FD": 1080, "RD": 2900 }
          },
          "11": {
            "Income": { "Salary": 1090, "Illegal": 2900 },
            "Expense": { "Rent": 1000, "Car": 2500, "Bike": 23500 },
            "EMI": { "Phone": 1030, "TV": 2500, "Washing Machine": 0, "Fridge": 0, "Laptop": 0},
            "EquityInvestment": { "MF": 1070, "Stocks": 2900 },
            "DebtInvestment": { "FD": 1060, "RD": 2300 }
          },
          "12": {
            "Income": { "Salary": 1040, "Illegal": 2300 },
            "Expense": { "Rent": 1020, "Car": 2300 },
            "EMI": { "Phone": 1070, "Fridge": 2500, "TV": 2550, "Washing Machine": 25500 },
            "EquityInvestment": { "MF": 1001, "Stocks": 2020 },
            "DebtInvestment": { "FD": 1007, "RD": 2008 }
          }
        },
        "2020": {
          "1": {
            "Income": { "Salary": { "value": 1090, "editing": false }, "Illegal": { "value": 2900, "editing": false } },
            "Expense": { "Rent": { "value": 1000, "editing": false }, "Car": { "value": 2500, "editing": false }, "Bike": { "value": 0, "editing": false } },
            "EMI": { "Phone": { "value": 1030, "editing": false }, "TV": { "value": 2500, "editing": false }, "Fridge": { "value": 2500, "editing": false }, "Washing Machine": { "value": 2300, "editing": false }, "Laptop": { "value": 2300, "editing": false } },
            "EquityInvestment": { "MF": { "value": 1070, "editing": false }, "Stocks": { "value": 2900, "editing": false } },
            "DebtInvestment": { "FD": { "value": 1060, "editing": false }, "RD": { "value": 2300, "editing": false } }
          },
          "2": {
            "Income": { "Salary": { "value": 1040, "editing": false }, "Illegal": { "value": 2300, "editing": false } },
            "Expense": { "Rent": { "value": 1020, "editing": false }, "Bike": { "value": 2300, "editing": false }, "Car": { "value": 0, "editing": false } },
            "EMI": { "TV": { "value": 1070, "editing": false }, "Fridge": { "value": 2500, "editing": false }, "Washing Machine": { "value": 2300, "editing": false }, "Laptop": { "value": 2300, "editing": false }, "Phone": { "value": 2300, "editing": false } },
            "EquityInvestment": { "MF": { "value": 1001, "editing": false }, "Stocks": { "value": 2020, "editing": false } },
            "DebtInvestment": { "FD": { "value": 1007, "editing": false }, "RD": { "value": 2008, "editing": false } }
          },
          "3": {
            "Income": { "Salary": { "value": 1030, "editing": false }, "Illegal": { "value": 2030, "editing": false } },
            "Expense": { "Car": { "value": 1200, "editing": false }, "Bike": { "value": 2600, "editing": false }, "Rent": { "value": 0, "editing": false } },
            "EMI": { "Fridge": { "value": 1070, "editing": false }, "Washing Machine": { "value": 2300, "editing": false }, "TV": { "value": 2300, "editing": false }, "Phone": { "value": 2300, "editing": false }, "Laptop": { "value": 2300, "editing": false } },
            "EquityInvestment": { "MF": { "value": 1040, "editing": false }, "Stocks": { "value": 2600, "editing": false } },
            "DebtInvestment": { "FD": { "value": 1080, "editing": false }, "RD": { "value": 2900, "editing": false } }
          }
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
</style>
