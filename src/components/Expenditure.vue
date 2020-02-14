<template>
  <div class="container">
    <div class="row shadow-lg bg-light"><div class="col">
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

            <td class="" v-if="monthlyBudget[category] != null && monthlyBudget[category][subCategory.id][selectedYear] != null" v-for="month in 12" :key="month">

              <div v-if="monthlyBudget[category][subCategory.id][selectedYear][month].logs.length > 0">
                <b-link class="link-as-text" :id="monthlyBudget[category][subCategory.id][selectedYear][month].id">
                  &#8377; {{ monthlyBudget[category][subCategory.id][selectedYear][month].actual }}
                </b-link>

                <b-popover variant="dark" triggers="focus" :target="monthlyBudget[category][subCategory.id][selectedYear][month].id" title="Expenses">
                  <table border="2">
                    <tr>
                      <th>Description</th>
                      <th>Value</th>
                    </tr>
                    <tr v-for="log in monthlyBudget[category][subCategory.id][selectedYear][month].logs" :key="log._id.$oid">
                      <td>{{ log.description }}</td>
                      <td>{{ log.value }}</td>
                    </tr>
                  </table>
                </b-popover>
              </div>
              <div v-else>&#8377; {{ monthlyBudget[category][subCategory.id][selectedYear][month].actual }}</div>

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
    </div></div>
    <div class="right-bottom-fixed">
      <b-button class="add-expense" @click="showAddExpenseModal = !showAddExpenseModal">+</b-button>
      <b-modal v-model="showAddExpenseModal" centered hide-footer hide-header>

        <p class="h5 float-left">
          Add Expense
        </p>
        <br><hr>
          <b-form @submit="submitExpenseModal" @reset="resetExpenseModal()">
            <b-form-group id="input-group-1" label="Spent On:" label-for="input-1" inline>
              <datetime required input-class="form-control input-sm" v-model="addExpenseForm.spent_on" type="datetime"></datetime>
            </b-form-group>

            <b-form-group id="input-group-2" label="Description:" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="addExpenseForm.description"
                required
                placeholder="Enter description"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Category:" label-for="input-3">
              <b-form-select
                id="input-3"
                v-model="addExpenseForm.category_id"
                :options="allCategoriesDropdown"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-group id="input-group-4" label="Amount:" label-for="input-4">
              <b-form-input
                id="input-4"
                v-model="addExpenseForm.value"
                required
                placeholder="Enter Amount"
              ></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary" style="margin-right: 5px;">Submit</b-button> 
            <b-button type="reset" variant="light">Cancel</b-button>
          </b-form>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Expenditure',
  directives: {
    focus: {
      // directive definition
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    resetExpenseModal: function() {
      this.addExpenseForm = {};
      this.showAddExpenseModal = !this.showAddExpenseModal;
    },
    submitExpenseModal: function(e) {
      e.preventDefault();
      var d = new Date(this.addExpenseForm.spent_on);
      var month = d.getMonth() + 1;
      var year = d.getFullYear();
      var formattedMonth = ("0" + month).slice(-2);

      this.$http.post('users/' + localStorage.getItem('user') + '/monthly_budgets/' + formattedMonth + year + '/actual_cash_flow_logs', {
          "actual_cash_flow_log": this.addExpenseForm
        })
        .then(response => {
          this.monthlyBudget["Income"][this.addExpenseForm.category_id][year][month].actual += parseFloat(this.addExpenseForm.value);
          var temp = this.addExpenseForm;
          temp._id = {};
          temp._id.$oid = Math.random().toString(36);
          this.monthlyBudget["Income"][this.addExpenseForm.category_id][year][month].logs.push(this.addExpenseForm);
          this.addExpenseForm = {};
          this.showAddExpenseModal = !this.showAddExpenseModal;
        })
        .catch(error => {
          this.$parent.toast(error);
        });
    },
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

      for(var subCategory in this.monthlyBudget[category]) {
        if(this.monthlyBudget[category][subCategory][year] != null) {
          total += parseFloat(this.monthlyBudget[category][subCategory][year][month].actual);
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
        .catch(error => {
          this.$parent.toast(error);
        });
    },
    updatePlannedMonthlyBudget: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/monthly_budgets', {
          params: { "year": this.selectedYear }
        })
        .then(response => {
          var monthlyBudget = response.data;
          var selectedYear = this.selectedYear;

          for (var category in this.categories) {
            if(this.monthlyBudget[category] == null) { this.$set(this.monthlyBudget, category, {}) }
            if(monthlyBudget[category] == null) { monthlyBudget[category] = {} }

            for (var subCategory of this.categories[category]) {
              if(this.monthlyBudget[category][subCategory.id] == null) { this.$set(this.monthlyBudget[category], subCategory.id, {}) }
              if(monthlyBudget[category][subCategory.id] == null) { monthlyBudget[category][subCategory.id] = {} }

              if(this.monthlyBudget[category][subCategory.id][selectedYear] == null) { this.$set(this.monthlyBudget[category][subCategory.id], selectedYear, {}) }
              if(monthlyBudget[category][subCategory.id][selectedYear] == null) { monthlyBudget[category][subCategory.id][selectedYear] = {} }
              for (var month = 1; month <= 12; month++) {
                if(monthlyBudget[category][subCategory.id][selectedYear][month] == null) {
                  this.$set(this.monthlyBudget[category][subCategory.id][selectedYear], month, { "planned": 0, "actual": 0, "id": Math.random().toString(36), "logs": [] })
                } else {
                  this.$set(this.monthlyBudget[category][subCategory.id][selectedYear], month, monthlyBudget[category][subCategory.id][selectedYear][month])
                }
              }
            }
          }

          this.populatedYears.push(selectedYear);
        })
        .catch(error => {
          this.$parent.toast(error);
        });
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
              temp[year.toString()][month.toString()] = { "planned": 0, "actual": 0, "logs": [], "id": Math.random().toString(36) }
            }
          }
          this.$set(this.monthlyBudget[category], response.data.id, temp);

          this.categories[category].push(response.data);
          this.newCategory[category] = '';
        })
        .catch(error => {
          this.$parent.toast(error);
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
  computed: {
    allCategoriesDropdown: function() {
      var dropdownList = [{ text: " - Select One - ", value: null }];
      for (var category in this.categories) {
        for (var subCategory of this.categories[category]) {
          dropdownList.push({ text: subCategory.title, value: subCategory.id })
        }
      }
      return dropdownList;
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
      monthlyBudget: {},
      showAddExpenseModal: false,
      addExpenseForm: {}
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

.add-expense {
  background-color : #007bff;
  color: white;
  font-size: 25px;
  padding: 5px 15px;
  border-radius: 5px 20px 5px;
  border-color: #46b8da;
}

.right-bottom-fixed {
  position: fixed;
  bottom: 50px;
  right: 10px;
}

.link-as-text {
  color: black;
  text-decoration: none !important
}
</style>
