<template>
  <div class="container"><div class="row shadow-lg bg-light"><div class="col">
    <table class="table-sm table-bordered table-hover table-responsive sectioned">
      <thead class="bg-light">
        <tr>
          <th></th>
          <th class="left-sticky bg-light"></th>
          <th v-for="month in 12" :key="month"><b>{{ monthFromInt(month - 1) }}</b></th>
        </tr>
      </thead>
      <tbody v-for="(subCategories, category) in categories" :key="category" class="tbody-striped" :class="category.toLowerCase()">
        <tr v-if="subCategories.length == 0">
          <td rowspan="3" class="bg-light">
            <b>{{ category }}</b>
          </td>
          <td class="left-sticky bg-light"> - </td>
          <td v-for="empty in 12" :key="empty">
            &#8377; 0
          </td>
        </tr>
        <tr v-for="(subCategory, idx) in subCategories" :key="subCategory.id">
          <td :rowspan="subCategories.length + 2" v-if="idx == 0" class="bg-light">
            <b>{{ category }}</b>
          </td>
          <td class="truncate bg-light left-sticky">
            {{ subCategory.title }}
          </td>

          <td class="truncate" v-if="plannedMonthlyBudget[category] != null && plannedMonthlyBudget[category][subCategory.id][selectedYear] != null" v-for="month in 12" :key="month" @dblclick="toggleEditingMoney(plannedMonthlyBudget[category][subCategory.id][selectedYear][month])" :class="{ 'error-cell': plannedMonthlyBudget[category][subCategory.id][selectedYear][month].error }">
            <div v-if="!plannedMonthlyBudget[category][subCategory.id][selectedYear][month].editing">
              &#8377; {{ plannedMonthlyBudget[category][subCategory.id][selectedYear][month].planned }}
            </div>
            <div v-if="plannedMonthlyBudget[category][subCategory.id][selectedYear][month].editing">
              
              <input class="form-control input-sm" @keyup.esc="cancelEditingMoney(plannedMonthlyBudget[category][subCategory.id][selectedYear][month])" @keyup.enter="$event.target.blur()" @blur="doneEditingMoney(plannedMonthlyBudget[category][subCategory.id][selectedYear][month], month, selectedYear, subCategory.id)" v-focus type="text" v-model="plannedMonthlyBudget[category][subCategory.id][selectedYear][month].planned" />
            </div>
          </td>
        </tr>

        <tr>
          <td class="truncate left-sticky bg-light">
            <input class="form-control input-sm" type="text" placeholder="Add category" @keyup.enter="addSubCategory(category)" @keyup.esc="cancelAddingSubCategory(category)" v-model="newCategory[category]" />
          </td>
          <td v-for="empty in 12" :key="empty"></td>
        </tr>

        <tr>
          <td class="left-sticky bg-light"> <b>Sub-Total</b> </td>
          <td v-for="month in 12" :key="month" class="truncate">
            &#8377; {{ subTotal(category, month, selectedYear) }} ({{ calculatePercentage(category, month, selectedYear) }}%)
          </td>
        </tr>

      </tbody>
      <tbody>
        <tr>
          <td></td>
          <td class="bg-light left-sticky"><b>Total Inflow</b></td>
          <td v-for="month in 12" :key="month" class="truncate">
            &#8377; {{ totalInflow(month, selectedYear) }}
          </td>
        </tr>
        <tr>
          <td></td>
          <td class="bg-light left-sticky"><b>Total Outflow</b></td>
          <td v-for="month in 12" :key="month" class="truncate">
            &#8377; {{ totalOutflow(month, selectedYear) }}
          </td>
        </tr>
        <tr>
          <td></td>
          <td class="bg-light left-sticky"><b>Total Balance</b></td>
          <td v-for="month in 12" :key="month" class="truncate">
            &#8377; {{ totalInflow(month, selectedYear) - totalOutflow(month, selectedYear) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div style="background-color: #f1f3f4">
      <select v-model="selectedYear">
        <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>
  </div></div></div>
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
    monthFromInt: function(int) {
      var month = new Array();
      month[0] = "Jan";
      month[1] = "Feb";
      month[2] = "Mar";
      month[3] = "Apr";
      month[4] = "May";
      month[5] = "Jun";
      month[6] = "Jul";
      month[7] = "Aug";
      month[8] = "Sept";
      month[9] = "Oct";
      month[10] = "Nov";
      month[11] = "Dec";

      return month[int];
    },
    totalInflow: function(month, year) {
      return this.subTotal("Income", month, year).toFixed(2);
    },
    totalOutflow: function(month, year) {
      return (
        this.subTotal("Expense", month, year) +
        this.subTotal("EMI", month, year) +
        this.subTotal("DebtInvestment", month, year) +
        this.subTotal("EquityInvestment", month, year)
      ).toFixed(2);
    },
    subTotal: function(category, month, year) {
      var total = 0;

      for(var subCategory in this.plannedMonthlyBudget[category]) {
        if(this.plannedMonthlyBudget[category][subCategory][year] != null) {
          total += parseFloat(this.plannedMonthlyBudget[category][subCategory][year][month].planned);
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
      this.$http.get('users/' + localStorage.getItem('user') + '/categories')
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
      this.$http.get('users/' + localStorage.getItem('user') + '/monthly_budgets', {
          params: { "year": this.selectedYear }
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
                  this.$set(this.plannedMonthlyBudget[category][subCategory.id][selectedYear], month, { "planned": 0, "editing": false, "error": false })
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
      this.cachedMoney = element.planned;
      element.editing = true;
    },
    doneEditingMoney: function(element, month, year, subCategory) {
      if(element.planned.toString().trim() == '') { element.planned = 0; }

      if(isNaN(element.planned)) { element.error = true; }
      else if(element.planned != this.cachedMoney) {
        element.error = false;
        var formattedMonth = ("0" + month).slice(-2);

        this.$http.post('users/' + localStorage.getItem('user') + '/monthly_budgets/' + formattedMonth + year + '/cash_flows', {
            "cash_flow": {
              category_id: subCategory,
              planned: element.planned
            }
          })
          .then(response => {
            element.planned = Number(element.planned);
          })
          .catch(error => {
            this.cancelEditingMoney(element);
            console.error(error.response);
          });
      }

      element.editing = false;
    },
    cancelEditingMoney: function(element) {
      element.planned = this.cachedMoney;
      element.editing = false;
    },
    cancelAddingSubCategory: function(category) {
      this.newCategory[category] = '';
    },
    addSubCategory: function(category) {
      this.$http.post('users/' + localStorage.getItem('user') + '/categories', {
          "category": {
            "title": this.newCategory[category],
            "type": category
          }
        })
        .then(response => {
          var temp = {}
          for(var year of this.years) {
            if(temp[year.toString()] == null) { temp[year.toString()] = {} }
            for (var month = 1; month <= 12; month++) {
              temp[year.toString()][month.toString()] = { "planned": 0, "editing": false }
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
.error-cell {
  border-color: coral;
}
.truncate {
  max-width: 120px;
  min-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.input-sm {
  max-height: 24px;
  width: 100%;
}
.table-hover > tbody > tr > td:hover, .table-hover > tbody > tr > td:hover {
  background-color: #f5f5f5!important;
}

.table-hover > tbody > tr:hover > td, .table-hover > tbody > tr:hover > th {
  background-color: inherit;
}

.table-responsive {
  margin-bottom: 0;
}

.tbody-striped > tr {
  background-color: white;
}
/*
.tbody-striped.income > tr:nth-child(odd) {
  background-color: #e7f9f0;
}

.tbody-striped.expense > tr:nth-child(odd) {
  background-color: #ffe6dd;
}

.tbody-striped.emi > tr:nth-child(odd) {
  background-color: #fef8e3;
}

.tbody-striped.equityinvestment > tr:nth-child(odd) {
  background-color: #e0f7fa;
}

.tbody-striped.debtinvestment > tr:nth-child(odd) {
  background-color: #e9f0fe;
}
*/
table {
  border-collapse: collapse;
}

table.sectioned tbody {
  border: 2px solid #a9a9a9;
  border-collapse: separate;
  border-spacing: 4px;
}

table.sectioned thead {
  border-bottom: 3px solid #a9a9a9;
}

.left-sticky {
  position: sticky;
  left: 0px;
}
</style>
