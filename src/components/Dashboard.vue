<template>
  <div class="container">
    <div class="LeadImage">
      <div class="image" style="background-image: url('img/common-backgroud.svg'), url('img/common-backgroud.svg');"></div>
      <div class="ie-hack-vertical"></div>
      <div class="ie-hack-horizontal"></div>
      <div class="triangle">
        <svg fill="white" preserveAspectRatio="none" viewBox="0 0 25 100" class="jsx-4194311832 Triangle">
          <polygon points="0,100 25,0 25,100" class="jsx-4194311832"></polygon>
        </svg>
      </div>
    </div>
    <div class="row">
      <div style="min-width: 250px; max-height: 110px">
        <Adsense
          :data-ad-client="ad_client"
          :data-ad-slot="ad_slot"
        >
        </Adsense>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-6 col-md-6 col-sm-12">
        <p class="h5 float-left" v-if="view == 'planned'">
          Plan your Savings & Expenses <b-link id="tooltip-target-plan" style="text-decoration: none;">&#128161;</b-link>
          <b-tooltip target="tooltip-target-plan" triggers="hover">
            Here you can plan and visualize your future expenses.
          </b-tooltip>
        </p>
        <p class="h5 float-left" v-if="view == 'actual'">
          Track your Expenses <b-link id="tooltip-target-expense" style="text-decoration: none;">&#128161;</b-link>
          <b-tooltip target="tooltip-target-expense" triggers="hover">
            You can add expenses by clicking <b>+</b>.
          </b-tooltip>
        </p>
      </div>
      <div class="col-lg-4 col-md-3"></div>

      <div class="col-lg-2 col-md-3 col-sm-4 float-right">
        <b-form-select v-model="view" :options="viewOptions"></b-form-select>
      </div>
    </div>
    <hr>

    <div class="row shadow-lg bg-light"><div class="col">
    <table class="table-sm table-bordered table-hover table-responsive sectioned">
      <thead class="bg-light">
        <tr>
          <th></th>
          <th class="left-sticky bg-light"></th>
          <th v-for="month in monthYear" :key="month[0]"><b>{{ monthFromInt(month[0] - 1) }} / {{ month[1] }}</b></th>
        </tr>
      </thead>
      <tbody v-for="(subCategories, category) in categories" :key="category" class="tbody-striped" :class="category.toLowerCase()">
        <tr v-if="subCategories.length == 0">
          <td rowspan="3" style="border: 2px solid Gray;" class="bg-light">
            <b>{{ category }}</b>
          </td>
          <td class="left-sticky bg-light"> - </td>
          <td v-for="empty in monthYear" :key="empty[0]">
            &#8377; 0
          </td>
        </tr>
        <tr v-for="(subCategory, idx) in subCategories" :key="subCategory.id">
          <td :rowspan="subCategories.length + 2" v-if="idx == 0" style="border: 2px solid Gray;" class="bg-light">
            <b>{{ category }}</b>
          </td>
          <td class="truncate bg-light left-sticky">
            {{ subCategory.title }}
          </td>

          <td class="truncate" v-if="view == 'planned' && monthlyBudget[category] != null && monthlyBudget[category][subCategory.id][selectedYear] != null && monthlyBudget[category][subCategory.id][selectedYear + 1] != null" v-for="month in monthYear" :key="month[0]" @click="toggleEditingMoney(monthlyBudget[category][subCategory.id][month[1]][month[0]])" :class="{ 'error-cell': erroredCell(monthlyBudget[category][subCategory.id][month[1]][month[0]]) }">
            <div v-if="!editingCell(monthlyBudget[category][subCategory.id][month[1]][month[0]])">
              <div v-if="monthlyBudget[category][subCategory.id][month[1]][month[0]]">&#8377; {{ monthlyBudget[category][subCategory.id][month[1]][month[0]].planned }}</div>
            </div>
            <div v-if="editingCell(monthlyBudget[category][subCategory.id][month[1]][month[0]])">
              <input v-if="monthlyBudget[category][subCategory.id][month[1]][month[0]]" class="form-control input-sm" @keyup.esc="cancelEditingMoney(monthlyBudget[category][subCategory.id][month[1]][month[0]])" @keyup.enter="$event.target.blur()" @blur="doneEditingMoney(monthlyBudget[category][subCategory.id][month[1]][month[0]], month[0], month[1], subCategory.id)" v-focus type="text" v-model="monthlyBudget[category][subCategory.id][month[1]][month[0]].planned" />
            </div>
          </td>

          <td v-if="view == 'actual' && monthlyBudget[category] != null && monthlyBudget[category][subCategory.id][selectedYear] != null && monthlyBudget[category][subCategory.id][selectedYear + 1] != null" v-for="month in monthYear" :key="month[0]">

            <div v-if="monthlyBudget[category][subCategory.id][month[1]][month[0]].logs.length > 0">
              <b-link class="link-as-text" :id="monthlyBudget[category][subCategory.id][month[1]][month[0]].id">
                &#8377; {{ monthlyBudget[category][subCategory.id][month[1]][month[0]].actual }}
              </b-link>

              <b-popover variant="dark" triggers="focus" :target="monthlyBudget[category][subCategory.id][month[1]][month[0]].id" :title="plannedTitle(monthlyBudget[category][subCategory.id][month[1]][month[0]].planned)">
                <table border="2">
                  <tr>
                    <th>Description</th>
                    <th>Value</th>
                  </tr>
                  <tr v-for="log in monthlyBudget[category][subCategory.id][month[1]][month[0]].logs" :key="log._id.$oid">
                    <td>{{ log.description }}</td>
                    <td>{{ log.value }}</td>
                  </tr>
                </table>
              </b-popover>
            </div>
            <div v-else>&#8377; {{ monthlyBudget[category][subCategory.id][month[1]][month[0]].actual }}</div>
          </td>
        </tr>

        <tr>
          <td class="truncate left-sticky bg-light">
            <form class="add-category-form">
              <input class="form-control input-sm add-category-input" type="text" placeholder="Add category" @focus="showAddCategoryButton(category)" @blur="hideAddCategoryButton(category)" @keyup.enter="addSubCategory(category)" @keyup.esc="cancelAddingSubCategory(category)" v-model="newCategory[category]" />
              <button class="add-category-button btn btn-primary" @click="addSubCategory(category)" v-if="newCategoryShowButton[category]">+</button>
            </form>
          </td>
          <td v-for="empty in monthYear" :key="empty[0]"></td>
        </tr>

        <tr>
          <td class="left-sticky bg-light"> <b>Sub-Total</b> </td>
          <td v-for="month in monthYear" :key="month[0]" class="truncate">
            &#8377; {{ subTotal(category, month[0], month[1]) }} ({{ calculatePercentage(category, month[0], month[1]) }}%)
          </td>
        </tr>

      </tbody>
      <tbody>
        <tr>
          <td></td>
          <td class="bg-light left-sticky"><b>Total Inflow</b></td>
          <td v-for="month in monthYear" :key="month[0]" class="truncate">
            &#8377; {{ totalInflow(month[0], month[1]) }}
          </td>
        </tr>
        <tr>
          <td></td>
          <td class="bg-light left-sticky"><b>Total Outflow</b></td>
          <td v-for="month in monthYear" :key="month[0]" class="truncate">
            &#8377; {{ totalOutflow(month[0], month[1]) }}
          </td>
        </tr>
        <tr>
          <td></td>
          <td class="bg-light left-sticky"><b>Total Balance</b></td>
          <td v-for="month in monthYear" :key="month[0]" class="truncate" :class="{red: totalBalance(month[0], month[1]) < 0, green: totalBalance(month[0], month[1]) >= 0}">
            <div>
              &#8377; {{ totalBalance(month[0], month[1]) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div></div>
    <div class="right-bottom-fixed">
      <b-button class="add-expense" @click="showAddExpenseModal = !showAddExpenseModal">+</b-button>
      <b-modal v-model="showAddExpenseModal" centered hide-footer hide-header>

        <p class="h5 float-left">
          Add Income / Expense
        </p>
        <br><hr>
          <b-form @submit="submitExpenseModal" @reset="resetExpenseModal()">
            <label for="datepicker">Spent On:</label>
            <b-form-datepicker required v-model="addExpenseForm.spent_on" class="form-control sm-2"></b-form-datepicker><br>
            <b-form-group id="input-group-2" label="Description:" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="addExpenseForm.description"
                required
                placeholder="Enter description"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Category:" label-for="input-3">
              <b-form-select class="input-3" v-model="addExpenseForm.category">
                <b-form-select-option-group v-for="(subCategories, category) in categories" :key="category" :label="category" required>
                  <b-form-select-option v-for="(subCategory, idx) in subCategories" :key="subCategory.id" :value="{ subCategory: subCategory.id, category: category }">{{ subCategory.title }}</b-form-select-option>
                </b-form-select-option-group>
              </b-form-select>
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
    plannedTitle: function(plannedValue) {
      return "Planned: " + plannedValue;
    },
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

      this.addExpenseForm.category_id = this.addExpenseForm.category.subCategory;
      var category = this.addExpenseForm.category.category;

      this.$http.post('users/' + localStorage.getItem('user') + '/monthly_budgets/' + formattedMonth + year + '/actual_cash_flow_logs', {
          "actual_cash_flow_log": this.addExpenseForm
        })
        .then(response => {
          if(this.monthlyBudget[category][this.addExpenseForm.category_id][year] == null || this.monthlyBudget[category][this.addExpenseForm.category_id][year][month] == null) {
            this.showAddExpenseModal = !this.showAddExpenseModal;
            return;
          }
          this.monthlyBudget[category][this.addExpenseForm.category_id][year][month].actual += parseFloat(this.addExpenseForm.value);
          var temp = this.addExpenseForm;
          temp._id = {};
          temp._id.$oid = Math.random().toString(36);
          this.monthlyBudget[category][this.addExpenseForm.category_id][year][month].logs.push(this.addExpenseForm);
          this.addExpenseForm = { "spent_on": (new Date()).toISOString().slice(0,10) };
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
    totalBalance: function(month, year){
      return (this.totalInflow(month, year) - this.totalOutflow(month, year)).toFixed(2);
    },
    subTotal: function(category, month, year) {
      var total = 0;

      for(var subCategory in this.monthlyBudget[category]) {
        if(this.monthlyBudget[category][subCategory][year] != null && this.monthlyBudget[category][subCategory][year][month] != null) {
          if(this.view == 'planned') {
            total += parseFloat(this.monthlyBudget[category][subCategory][year][month].planned);
          } else {
            total += parseFloat(this.monthlyBudget[category][subCategory][year][month].actual);
          }
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
    erroredCell: function(el) {
      if(el != null) { return el.error; }
    },
    editingCell: function(el) {
      if(el != null) { return el.editing; }
    },
    updateMonthlyBudget: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/monthly_budgets', {
          params: { "financial_year": this.selectedYear }
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

              var monthYear = this.monthYear;
              for(var i = 0; i < monthYear.length; i++) {
                var month = monthYear[i];

                if(this.monthlyBudget[category][subCategory.id][month[1]] == null) { this.$set(this.monthlyBudget[category][subCategory.id], month[1], {}) }
                if(monthlyBudget[category][subCategory.id][month[1]] == null) { monthlyBudget[category][subCategory.id][month[1]] = {} }

                if(monthlyBudget[category][subCategory.id][month[1]][month[0]] == null) {
                  this.$set(this.monthlyBudget[category][subCategory.id][month[1]], month[0], { "planned": 0, "editing": false, "error": false, "actual": 0, "id": Math.random().toString(36), "logs": [] })
                } else {
                  monthlyBudget[category][subCategory.id][month[1]][month[0]]["editing"] = false
                  monthlyBudget[category][subCategory.id][month[1]][month[0]]["error"] = false
                  this.$set(this.monthlyBudget[category][subCategory.id][month[1]], month[0], monthlyBudget[category][subCategory.id][month[1]][month[0]])
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
    toggleEditingMoney: function(element) {
      this.cachedMoney = element.planned;
      element.editing = true;
    },
    showAddCategoryButton: function(category) {
      this.newCategoryShowButton[category] = true;
    },
    hideAddCategoryButton: function(category) {
      setTimeout(() => { this.newCategoryShowButton[category] = false; }, 500);
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
            this.$parent.toast(error);
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
          var temp = {};

          var monthYear = this.monthYear;
          for(var i = 0; i < monthYear.length; i++) {
            var month = monthYear[i];
            if(temp[month[1].toString()] == null) { temp[month[1].toString()] = {} }
            temp[month[1].toString()][month[0].toString()] = { "planned": 0, "editing": false, "actual": 0, "logs": [], "id": Math.random().toString(36) }
          }

          this.$set(this.monthlyBudget[category], response.data.id, temp);

          this.categories[category].push(response.data);
          this.newCategory[category] = '';
          this.newCategoryShowButton[category] = false;
        })
        .catch(error => {
          this.$parent.toast(error);
          this.newCategoryShowButton[category] = false;
        });
    },
  },
  props: {
    selectedYear: Number
  },
  mounted: function () {
    this.initializeCategories();
    if (this.selectedYear !== null) { this.updateMonthlyBudget(); }
  },
  computed: {
    monthYear: function() {
      return [
        [4, this.selectedYear],
        [5, this.selectedYear],
        [6, this.selectedYear],
        [7, this.selectedYear],
        [8, this.selectedYear],
        [9, this.selectedYear],
        [10, this.selectedYear],
        [11, this.selectedYear],
        [12, this.selectedYear],
        [1, this.selectedYear + 1],
        [2, this.selectedYear + 1],
        [3, this.selectedYear + 1]
      ];
    }
  },
  watch: {
    selectedYear: function() {
      if(this.populatedYears.indexOf(this.selectedYear) == -1) {
        this.updateMonthlyBudget();
      }
    }
  },
  data: function() {
    return {
      view: 'planned',
      viewOptions: [
        { value: 'planned', text: 'Planning view' },
        { value: 'actual', text: 'Tracking view' },
        { value: 'monthly', text: 'Monthly view', disabled: true },
      ],
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
      newCategoryShowButton: {
        "Income": false,
        "Expense": false,
        "EMI": false,
        "EquityInvestment": false,
        "DebtInvestment": false
      },
      showAddExpenseModal: false,
      addExpenseForm: { "spent_on": (new Date()).toISOString().slice(0,10) },
      ad_client: process.env.VUE_APP_ADSENSE_PUB,
      ad_slot: process.env.VUE_APP_ADSENSE_HORIZONTAL_SLOT
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
.table-hover > tbody > tr > td:hover, .table-hover > tbody > tr > th:hover {
  background-color: #f5f5f5!important;
}

.table-hover > tbody > tr:hover > td, .table-hover > tbody > tr:hover > th {
  /*background-color: inherit;*/
}

.table-responsive {
  margin-bottom: 0;
}

.tbody-striped > tr {
  background-color: white;
}

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

.add-category-form {
  /* This bit sets up the horizontal layout */
  display:flex;
  flex-direction:row;
}

.add-category-input {
  /* Tell the input to use all the available space */
  flex-grow:2;
  /* And hide the input's outline, so the form looks like the outline */
  border:none;
}

.add-category-input:focus {
  /* removing the input focus blue box. Put this on the form if you like. */
  outline: none;
}

.add-category-button {
  /* Just a little styling to make it pretty */
  color:white;
  padding: 0px 2px;
  max-height: 24px;
}
.green {
  background-color: #25a69a;
  font-weight: bold;
}
.red {
  background-color: #f39e35;
  font-weight: bold;
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
