<template>
  <div class="container">
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
    <table class="table-sm table-bordered table-hover table-responsive sectioned" style="height: 75vh; overflow: auto;">
      <thead class="bg-light">
        <tr>
          <th class="bg-light"></th>
          <th class="bg-light top-sticky left-sticky" style="z-index: 1"></th>
          <th v-for="month in monthYear" :key="month[0]" class="bg-light top-sticky"><b>{{ monthFromInt(month[0] - 1) }} / {{ month[1] }}</b></th>
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
          <td v-for="month in monthYear" :key="month[0]" class="truncate" :title="subTotal(category, month[0], month[1]) + ' (' + calculatePercentage(category, month[0], month[1]) + '%)'">
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

    <div class="right-bottom-fixed" v-if="view == 'planned'">
      <b-button class="add-recurring-plan" @click="showRecurringPlanModal = !showRecurringPlanModal">+</b-button>
      <b-modal v-model="showRecurringPlanModal" centered hide-footer hide-header>

        <p class="h5 float-left">
          Plan your Income / Expense for a duration
        </p>
        <br><hr>
          <b-form @submit="submitRecurringPlanModal" @reset="resetRecurringPlanModal()">

            <label for="datepicker">Duration:</label>
            <b-form-datepicker required v-model="addRecurringPlanForm.from" class="form-control sm-2"></b-form-datepicker><br>
            <b-form-datepicker required v-model="addRecurringPlanForm.to" class="form-control sm-2"></b-form-datepicker><br>

            <b-form-group id="input-group-3" label="Category:" label-for="input-3">
              <b-form-select class="input-3" v-model="addRecurringPlanForm.category">
                <b-form-select-option-group v-for="(subCategories, category) in categories" :key="category" :label="category" required>
                  <b-form-select-option v-for="(subCategory, idx) in subCategories" :key="subCategory.id" :value="{ subCategory: subCategory.id, category: category }">{{ subCategory.title }}</b-form-select-option>
                </b-form-select-option-group>
              </b-form-select>
            </b-form-group>

            <b-form-group id="input-group-4" label="Amount:" label-for="input-4">
              <b-form-input
                id="input-4"
                v-model="addRecurringPlanForm.value"
                required
                placeholder="Enter Amount"
              ></b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary" style="margin-right: 5px;">Submit</b-button> 
            <b-button type="reset" variant="light">Cancel</b-button>
          </b-form>
      </b-modal>
    </div>

    <div class="right-bottom-fixed" v-if="view == 'actual'">
      <b-button class="add-expense" @click="showAddExpenseModal = !showAddExpenseModal">+</b-button>
      <b-modal v-model="showAddExpenseModal" centered hide-footer hide-header>

        <p class="h5 float-left">
          Add Income / Expense
        </p>
        <br><hr>
          <b-form @submit="submitExpenseModal" @reset="resetExpenseModal()">
            <label for="datepicker">Received / Spent On:</label>
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
              <b-form-select class="input-3" v-model="addExpenseForm.category" required>
                <b-form-select-option-group v-for="(subCategories, category) in categories" :key="category" :label="category">
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

    <div class="right-bottom-fixed-2" v-if="view == 'actual'">
      <b-button class="view-logs" @click="viewLogsModal = !viewLogsModal">&#9737;</b-button>
      <b-modal v-model="viewLogsModal" centered hide-footer scrollable title="Your Savings and Expenses logs">
        <div v-for="month in monthYear" :key="month[0]">
          <b-link
            :class="monthlyLogsCollapse[month[0]] ? null : 'collapsed'"
            :aria-expanded="monthlyLogsCollapse[month[0]] ? 'true' : 'false'"
            :aria-controls="'collapse-' + month[0]"
            @click="monthlyLogsCollapse[month[0]] = !monthlyLogsCollapse[month[0]]"
            style="padding-right: 10px"
            class="link-as-text font-weight-bold"
          >
            {{ monthFromInt(month[0] - 1) }} / {{ month[1] }}
            <span class="float-right">{{ monthlyLogsCollapse[month[0]] ? '-' : '+' }}</span>
          </b-link>

          <b-collapse v-if="monthlyLogs[month[1]] != null && monthlyLogs[month[1]][month[0]] != null" :id="'collapse-' + month[0]" v-model="monthlyLogsCollapse[month[0]]" class="mt-2">

            <table style="width: 100%">
              <tr v-for="log in monthlyLogs[month[1]][month[0]]" :key="log._id.$oid" style="border-bottom:1pt solid #dadada;">
                <td class="small">{{ getDateFromTime(log.spent_on) }}: &#8377;{{ log.value }} for '{{ log.description }}' under {{ findCategoryById(log.category_id.$oid)[0] }} ({{ findCategoryById(log.category_id.$oid)[1] }})</td>
                <td @click="deleteActualCashFlowLogs(log, month[1], month[0])" style="width: 25px; cursor: pointer;" title="delete">&#128465;</td>
              </tr>
            </table>

            <div v-if="!(monthlyLogs[month[1]] && monthlyLogs[month[1]][month[0]] && monthlyLogs[month[1]][month[0]].length != 0)" class="small">None.</div>
            <br v-if="!monthlyLogsCollapse[month[0]]">
          </b-collapse>
          <hr>
        </div>
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
    getDateFromTime: function(time) {
      var d = (new Date(time)).toString();
      var date = d.substring(4, 10);
      var day = d.substring(0, 3);

      return day + ", " + date;
    },
    resetRecurringPlanModal: function() {
      this.addRecurringPlanForm = { "from": (new Date()).toISOString().slice(0,10) };
      this.showRecurringPlanModal = !this.showRecurringPlanModal;
    },
    submitRecurringPlanModal: function(e) {
      e.preventDefault();

      this.addRecurringPlanForm.category_id = this.addRecurringPlanForm.category.subCategory;
      var category = this.addRecurringPlanForm.category.category;

      this.$http.post('users/' + localStorage.getItem('user') + '/monthly_budgets/create_planned_cash_flow_batch', {
          "cash_flow": this.addRecurringPlanForm
        })
        .then(response => {
          var allMonths = this.allMonthsBetweenRange(this.addRecurringPlanForm.from, this.addRecurringPlanForm.to);

          for (var index in allMonths) {
            var month = allMonths[index][1];
            var year = allMonths[index][0];

            if(this.monthlyBudget[category][this.addRecurringPlanForm.category_id][year] != null && this.monthlyBudget[category][this.addRecurringPlanForm.category_id][year][month] != null) {
              this.monthlyBudget[category][this.addRecurringPlanForm.category_id][year][month].planned = parseFloat(this.addRecurringPlanForm.value);
            }
          }


          this.resetRecurringPlanModal();
        })
        .catch(error => {
          this.$parent.toast(error);
        });
    },
    allMonthsBetweenRange: function(startDate, endDate) {
      var start      = startDate.split('-');
      var end        = endDate.split('-');
      var startYear  = parseInt(start[0]);
      var endYear    = parseInt(end[0]);
      var dates      = [];

      for(var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        var startMon = i === startYear ? parseInt(start[1])-1 : 0;
        for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
          var month = j+1;
          dates.push([i, month]);
        }
      }
      return dates;
    },
    resetExpenseModal: function() {
      this.addExpenseForm = { "spent_on": (new Date()).toISOString().slice(0,10) };
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
          temp._id.$oid = response.data._id.$oid;
          this.monthlyBudget[category][this.addExpenseForm.category_id][year][month].logs.push(this.addExpenseForm);

          var temp_cat_id = temp.category_id;
          temp.category_id = {};
          temp.category_id.$oid = temp_cat_id;

          if(this.monthlyLogs[year] == null) { this.$set(this.monthlyLogs, year, {}) }
          if(this.monthlyLogs[year][month] == null) { this.monthlyLogs[year][month] = [] }
          this.monthlyLogs[year][month].push(this.addExpenseForm)

          this.resetExpenseModal();
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
    loadActualCashFlowLogs: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/monthly_budgets/index_actual_cash_flow_logs_batch', {
          params: { "financial_year": this.selectedYear }
        })
        .then(response => {
          var monthYear = this.monthYear;
          for(var i = 0; i < monthYear.length; i++) {
            var month = monthYear[i];
            if(this.monthlyLogs[month[1]] == null) { this.$set(this.monthlyLogs, month[1], {}) }

            if(response.data[month[1]] == null || response.data[month[1]][month[0]] == null) { this.monthlyLogs[month[1]][month[0]] = [] }
            else if(this.monthlyLogs[month[1]][month[0]] == null) { this.$set(this.monthlyLogs[month[1]], month[0], response.data[month[1]][month[0]]) }
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
    findCategoryById: function(id) {
      for(var superCategory in this.categories) {
        for(var category in this.categories[superCategory]) {
          var tmp = this.categories[superCategory][category];
          if(tmp.id == id) { return [tmp.title, tmp.type]; }
        }
      }
    },
    deleteActualCashFlowLogs: function(log, year, month) {
      var temp_cat = this.findCategoryById(log.category_id.$oid);
      var formattedMonth = ("0" + month).slice(-2);

      // /users/:user_id/monthly_budgets/:monthly_budget_id/actual_cash_flow_logs/:id
      this.$http.delete('users/' + localStorage.getItem('user') + '/monthly_budgets/' + formattedMonth + year +'/actual_cash_flow_logs/' + log._id.$oid)
        .then(response => {
          var deleteFromArray = this.monthlyLogs[year][month];
          this.monthlyLogs[year][month] = deleteFromArray.filter(function(value, index, arr) { return value._id.$oid != log._id.$oid; });

          var deleteFromArray2 = this.monthlyBudget[temp_cat[1]][log.category_id.$oid][year][month].logs;
          this.monthlyBudget[temp_cat[1]][log.category_id.$oid][year][month].actual -= parseFloat(log.value);
          this.monthlyBudget[temp_cat[1]][log.category_id.$oid][year][month].logs = deleteFromArray2.filter(function(value, index, arr) { return value._id.$oid != log._id.$oid; });
        })
        .catch(error => {
          this.$parent.toast(error);
        });
    }
  },
  props: {
    selectedYear: Number
  },
  mounted: function () {
    this.initializeCategories();
    if (this.selectedYear !== null) {
      this.updateMonthlyBudget();
      this.loadActualCashFlowLogs();
    }
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
        this.loadActualCashFlowLogs();
      }
    }
  },
  data: function() {
    return {
      view: 'planned',
      viewOptions: [
        { value: 'planned', text: 'Budget planning' },
        { value: 'actual', text: 'Accounting worksheet' },
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
      showRecurringPlanModal: false,
      addRecurringPlanForm: { "from": (new Date()).toISOString().slice(0,10) },
      viewLogsModal: false,
      monthlyLogsCollapse: {},
      monthlyLogs: {},
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

.top-sticky {
  position: sticky;
  top: 0px;
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

.add-recurring-plan {
  background-color : #46b8da;
  color: white;
  font-size: 25px;
  padding: 5px 15px;
  border-radius: 5px 20px 5px;
  border-color: #46b8da;
}

.view-logs {
  background-color : #007bff;
  color: white;
  font-size: 25px;
  padding: 5px 11px;
  border-radius: 5px 20px 5px;
  border-color: #46b8da;
}

.right-bottom-fixed {
  position: fixed;
  bottom: 50px;
  right: 10px;
}

.right-bottom-fixed-2 {
  position: fixed;
  bottom: 110px;
  right: 10px;
}

.link-as-text {
  color: black;
  text-decoration: none !important
}
</style>
