<template>
  <div class="container">
    <div class="row">
      <div style="min-width: 250px; max-height: 110px">
        <Adsense
          :data-ad-client="ad_client"
          :data-ad-slot="ad_slot"
          data-ad-format="horizontal"
          :data-full-width-responsive="true"
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
        <p class="h5 float-left" v-if="view == 'monthly'">
          Monthly Summary <b-link id="tooltip-target-monthly" style="text-decoration: none;">&#128161;</b-link>
          <b-tooltip target="tooltip-target-monthly" triggers="hover">
            Compare your planned and actual cashflows.
          </b-tooltip>
        </p>
        <p class="h5 float-left" v-if="view == 'graph'">
          Graph View
        </p>
      </div>
      <div class="col-lg-3 col-md-2"></div>

      <div class="col-lg-3 col-md-4 col-sm-12 float-right">
        <b-form-select v-model="view" :options="viewOptions"></b-form-select>
      </div>
    </div>
    <hr>

    <div class="row shadow-lg "><div class="col">
      <div v-if="view == 'monthly'">
        <div class="row">
          <div v-for="month in monthYear" :key="month[0]" class="col-lg-8 col-md-12">
            <b>{{ monthFromInt(month[0] - 1) }} / {{ month[1] }}</b>
            <table class="table-sm table-striped table-hover table-responsive sectioned">
              <thead class="">
                <tr>
                  <th class=""></th>
                  <th>Category</th>
                  <th style="min-width: 120px">Planned</th>
                  <th style="min-width: 120px">Actual</th>
                  <th style="min-width: 120px">Difference</th>
                </tr>
              </thead>
              <tbody v-for="(subCategories, category) in categories" :key="category" class="tbody-striped" :class="category.toLowerCase()">
                <tr v-if="subCategories.length == 0">
                  <td rowspan="2" style="border: 2px solid Gray;" class="">
                    <b>{{ category }}</b>
                  </td>
                  <td class=""> - </td>
                  <td> - </td>
                  <td> - </td>
                  <td> - </td>
                </tr>
                <tr
                  v-for="(subCategory, idx) in subCategories"
                  :key="subCategory.id"
                  v-if="monthlyBudget[selectedYear + 1] != null && monthlyBudget[selectedYear + 1][3] != null && monthlyBudget[selectedYear + 1][3][category] != null && monthlyBudget[selectedYear + 1][3][category][subCategory.id] != null"
                >
                  <td :rowspan="subCategories.length + 2" v-if="idx == 0" style="border: 2px solid Gray;" class="">
                    <b>{{ category }}</b>
                  </td>
                  <td class="truncate ">
                    {{ subCategory.title }}
                  </td>

                  <td>$ {{ monthlyBudget[month[1]][month[0]][category][subCategory.id].planned }}</td>
                  <td>$ {{ monthlyBudget[month[1]][month[0]][category][subCategory.id].actual }}</td>
                  <td>$ {{ (monthlyBudget[month[1]][month[0]][category][subCategory.id].planned - monthlyBudget[month[1]][month[0]][category][subCategory.id].actual).toFixed(2) }}</td>
                </tr>
                <tr>
                  <td class=" truncate"> <b>Sub-Total</b> </td>
                  <td>
                    <div v-if="category != 'Income'">
                      <span v-if="!incomePercentWithinLimit(category, 'planned', month[0], month[1])">&#10071;</span>
                      <b-link :id="'planned' + category + month[0].toString()" class="link-as-text">$ {{ subTotalByType(category, 'planned', month[0], month[1]) }}</b-link>
                      <b-tooltip :target="'planned' + category + month[0].toString()" triggers="hover">
                        Expected ({{ percentOfCategory(category) }}% of Income): $ {{ percentValueFromIncome(category, 'planned', month[0], month[1]) }}<br>
                      </b-tooltip>
                    </div>
                    <div v-else>$ {{ subTotalByType(category, 'planned', month[0], month[1]) }}</div>
                  </td>
                  <td>
                    <div v-if="category != 'Income'">
                      <span v-if="!incomePercentWithinLimit(category, 'actual', month[0], month[1])">&#10071;</span>
                      <b-link :id="'actual' + category + month[0].toString()" class="link-as-text">$ {{ subTotalByType(category, 'actual', month[0], month[1]) }}</b-link>
                      <b-tooltip :target="'actual' + category + month[0].toString()" triggers="hover">
                        Expected ({{ percentOfCategory(category) }}% of Income): $ {{ percentValueFromIncome(category, 'actual', month[0], month[1]) }}<br>
                      </b-tooltip>
                    </div>
                    <div v-else>$ {{ subTotalByType(category, 'actual', month[0], month[1]) }}</div>
                  </td>
                  <td>$ {{ (subTotalByType(category, 'planned', month[0], month[1]) - subTotalByType(category, 'actual', month[0], month[1])).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
            <hr>
          </div>
        </div>
      </div>
      <div v-if="view == 'graph'">
        <br>
        <div class="row">
          <div class="col-lg-3 col-md-4 col-sm-12">
            <b-form-select v-model="graphView" :options="graphOptions"></b-form-select>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-12" v-if="graphView == 'plannedVsActual'">
            <b-form-select class="input-3" v-model="graphYearlyCategory" required>
              <b-form-select-option-group v-for="(subCategories, category) in categories" :key="category" :label="category">
                <b-form-select-option v-for="(subCategory, idx) in subCategories" :key="subCategory.id" :value="{ subCategory: subCategory.id, category: category }">{{ subCategory.title }}</b-form-select-option>
              </b-form-select-option-group>
            </b-form-select>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-12" v-if="graphView == 'percentageSplit'">
            <b-form-select v-model="percentageSplitMonth" class="input-3">
              <b-form-select-option v-for="month in monthYear" :key="month[0]" :value="month">{{ monthFromInt(month[0] - 1) }} / {{ month[1] }}</b-form-select-option>
            </b-form-select>
          </div>
          <div class="col-lg-3 col-md-4 col-sm-12" v-if="graphView == 'percentageSplit'">
            <b-form-select v-model="percentageSplitCategory" :options="percentageSplitCategoryOptions"></b-form-select>
          </div>
        </div>
        <hr>
        <div v-if="graphView == 'percentageSplit'">
          <div class="row">
            <div class="col-lg-6 col-md-12 col-sm-12">
              <h4>Planned</h4>
              <Doughnut :chartData="doughnutPlannedValues"></Doughnut><hr>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12">
              <h4>Actual</h4>
              <Doughnut :chartData="doughnutActualValues"></Doughnut><hr>
            </div>
          </div>
        </div>
        <div v-if="graphView == 'plannedVsActual'">
          <LineChart :chartData="linechartValues"></LineChart><hr>
        </div>
        <br>
      </div>

      <div v-if="view == 'planned' || view == 'actual'">
        <table class="table-sm table-striped table-hover table-responsive sectioned" style="height: 75vh; overflow: auto;">
          <thead class="">
            <tr>
              <th class="bg-light top-sticky" style="z-index: 1"></th>
              <th class="bg-light top-sticky left-sticky" style="z-index: 1"></th>
              <th v-for="month in monthYear" :key="month[0]" class="bg-light top-sticky"><b>{{ monthFromInt(month[0] - 1) }} / {{ month[1] }}</b></th>
            </tr>
          </thead>

          <tbody v-for="(subCategories, category) in categories" :key="category" class="tbody-striped" :class="category.toLowerCase()">
            <tr v-if="subCategories.length == 0">
              <td rowspan="3" style="border: 2px solid Gray;" class="">
                <b>{{ category }}</b>
              </td>
              <td class="left-sticky bg-light"> - </td>
              <td v-for="empty in monthYear" :key="empty[0]">
                $ 0
              </td>
            </tr>
            <tr v-for="(subCategory, idx) in subCategories" :key="subCategory.id">
              <td :rowspan="subCategories.length + 2" v-if="idx == 0" style="border: 2px solid Gray;" class="">
                <b>{{ category }}</b>
              </td>
              <td class="truncate bg-light left-sticky">
                {{ subCategory.title }}
              </td>

              <td
                class="truncate"
                v-if="view == 'planned' && monthlyBudget[selectedYear + 1] != null && monthlyBudget[selectedYear + 1][3] != null && monthlyBudget[selectedYear + 1][3][category] != null && monthlyBudget[selectedYear + 1][3][category][subCategory.id] != null"
                v-for="month in monthYear"
                :key="month[0]"
                @click="toggleEditingMoney(monthlyBudget[month[1]][month[0]][category][subCategory.id])"
                :class="{ 'error-cell': erroredCell(monthlyBudget[month[1]][month[0]][category][subCategory.id]) }"
              >
                <div v-if="!editingCell(monthlyBudget[month[1]][month[0]][category][subCategory.id])">
                  <div v-if="monthlyBudget[month[1]][month[0]][category][subCategory.id]">$ {{ monthlyBudget[month[1]][month[0]][category][subCategory.id].planned }}</div>
                </div>
                <div v-if="editingCell(monthlyBudget[month[1]][month[0]][category][subCategory.id])">
                  <input v-if="monthlyBudget[month[1]][month[0]][category][subCategory.id]" class="form-control input-sm" @keyup.esc="cancelEditingMoney(monthlyBudget[month[1]][month[0]][category][subCategory.id])" @keyup.enter="$event.target.blur()" @blur="doneEditingMoney(monthlyBudget[month[1]][month[0]][category][subCategory.id], month[0], month[1], subCategory.id)" v-focus type="text" v-model="monthlyBudget[month[1]][month[0]][category][subCategory.id].planned" />
                </div>
              </td>

              <td
                v-if="view == 'actual' && monthlyBudget[selectedYear + 1] != null && monthlyBudget[selectedYear + 1][3] != null && monthlyBudget[selectedYear + 1][3][category] != null && monthlyBudget[selectedYear + 1][3][category][subCategory.id] != null"
                v-for="month in monthYear"
                :key="month[0]"
              >

                <div>
                  <b-link class="link-as-text" :id="monthlyBudget[month[1]][month[0]][category][subCategory.id].id">
                    $ {{ monthlyBudget[month[1]][month[0]][category][subCategory.id].actual }}
                  </b-link>

                  <b-popover variant="dark" triggers="focus" :target="monthlyBudget[month[1]][month[0]][category][subCategory.id].id" :title="plannedTitle(monthlyBudget[month[1]][month[0]][category][subCategory.id].planned)">
                    <table border="2" v-if="monthlyBudget[month[1]][month[0]][category][subCategory.id].logs.length > 0">
                      <tr>
                        <th>Description</th>
                        <th>Value</th>
                      </tr>
                      <tr v-for="log in monthlyBudget[month[1]][month[0]][category][subCategory.id].logs" :key="log._id.$oid">
                        <td>{{ log.description }}</td>
                        <td>{{ log.value }}</td>
                      </tr>
                    </table>
                    <div v-else>None.</div>
                  </b-popover>
                </div>
              </td>
            </tr>

            <tr>
              <td class="truncate left-sticky ">
                <form class="add-category-form">
                  <input class="form-control input-sm add-category-input" type="text" placeholder="Add category" @focus="showAddCategoryButton(category)" @blur="hideAddCategoryButton(category)" @keyup.enter.prevent="showAddCategoryButton(category)" @keyup.esc="cancelAddingSubCategory(category)" v-model="newCategory[category]" />
                  <button class="add-category-button btn btn-primary" @click.prevent="addSubCategory(category)" v-if="newCategoryShowButton[category]">+</button>
                </form>
              </td>
              <td v-for="empty in monthYear" :key="empty[0]"></td>
            </tr>

            <tr>
              <td class="left-sticky bg-light"> <b>Sub-Total</b> </td>
              <td v-for="month in monthYear" :key="month[0]" class="truncate">
                <div v-if="category == 'Income'">
                  $ {{ subTotal(category, month[0], month[1]) }}
                </div>
                <div v-else>
                  <b-link :id="category + month[0].toString()" class="link-as-text">$ {{ subTotal(category, month[0], month[1]) }}</b-link>
                  <b-tooltip :target="category + month[0].toString()" triggers="hover">
                    Sub-Total: $ {{ subTotal(category, month[0], month[1]) }}<br>
                    Expected ({{ percentOfCategory(category) }}% of Income): $ {{ percentValueFromIncome(category, view, month[0], month[1]) }}<br>
                    Percentage Split of Outflow: {{ calculatePercentage(category, month[0], month[1]) }}%<br>
                  </b-tooltip>
                </div>
              </td>
            </tr>

          </tbody>
          <tbody>
            <tr>
              <td></td>
              <td class="truncate bg-light left-sticky" title="Prev. Month Bal."><b>Prev. Month Bal.</b></td>
              <td
                v-if="monthlyBudget[selectedYear + 1] != null && monthlyBudget[selectedYear + 1][3] != null"
                class="truncate"
                v-for="month in monthYear"
                :key="month[0]"
                @click="clickPrevBalUpdateModal(month[1], month[0])"
              >
                <div v-if="view == 'planned'">$ {{ prevMonthBal(month[0], month[1]) }}</div>
                <div v-if="view == 'actual'">$ {{ prevMonthBal(month[0], month[1]).toFixed(2) }}</div>
              </td>
            </tr>
            <tr>
              <td></td>
              <td class="bg-light left-sticky"><b>Total Inflow</b></td>
              <td v-for="month in monthYear" :key="month[0]" class="truncate">
                $ {{ totalInflow(month[0], month[1]) }}
              </td>
            </tr>
            <tr>
              <td></td>
              <td class="bg-light left-sticky"><b>Total Outflow</b></td>
              <td v-for="month in monthYear" :key="month[0]" class="truncate">
                $ {{ totalOutflow(month[0], month[1]) }}
              </td>
            </tr>
            <tr v-if="monthlyBudget[selectedYear + 1] != null && monthlyBudget[selectedYear + 1][3] != null">
              <td></td>
              <td class="bg-light left-sticky"><b>Total Balance</b></td>
              <td v-for="month in monthYear" :key="month[0]" class="truncate" :class="{red: totalBalance(month[0], month[1]) < 0, green: totalBalance(month[0], month[1]) >= 0}">
                <div>
                  $ {{ totalBalance(month[0], month[1]) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div></div>

    <b-modal v-model="showPrevBalUpdateModal" centered hide-footer hide-header>
      <p class="h6 float-left">
        Update Balance of Previous month of {{ monthFromInt(addPrevBalUpdateForm.month - 1) }} / {{ addPrevBalUpdateForm.year }}
      </p>
      <br><hr>

      <b-form @submit="submitPrevMonthBalModal" @reset="resetPrevMonthBalModal()">

        <b-form-group label="Amount:" label-for="input-prev-month-bal-planned" v-if="view == 'planned'">
          <b-form-input
            id="input-prev-month-bal-planned"
            v-model="addPrevBalUpdateForm.prev_month_bal_planned"
            required
            placeholder="Enter Amount"
          ></b-form-input>
        </b-form-group>

        <b-form-group v-if="view == 'actual'">
          <div class="row" v-for="option in accountOptions" :key="option.value">
            <div class="col-4">{{ option.text }}</div>
            <div class="col-8">
              <b-form-input
                v-model.number="addPrevBalUpdateForm.prev_month_bal_actuals[option.value]"
                placeholder="Enter Amount"
              ></b-form-input>
            </div>
          </div>
        </b-form-group>

        <b-button type="submit" variant="primary" style="margin-right: 5px;">Submit</b-button> 
        <b-button type="reset" variant="light">Cancel</b-button>
      </b-form>
    </b-modal>

    <div class="right-bottom-fixed" v-if="view == 'planned'">
      <b-button class="add-recurring-plan" @click="showRecurringPlanModal = !showRecurringPlanModal">+</b-button>
      <b-modal v-model="showRecurringPlanModal" centered hide-footer hide-header>

        <p class="h6 float-left">
          Plan your Income / Expense for a duration
        </p>
        <br><hr>
          <b-form @submit="submitRecurringPlanModal" @reset="resetRecurringPlanModal()">

            <label for="datepicker">Duration:</label>

            <input type="date" required v-model="addRecurringPlanForm.from" class="form-control sm-2" />
            <input type="date" required v-model="addRecurringPlanForm.to" class="form-control sm-2" /><br>

            <b-form-group id="input-group-cat" label="Category:" label-for="input-cat">
              <b-form-select class="input-cat" v-model="addRecurringPlanForm.category">
                <b-form-select-option-group v-for="(subCategories, category) in categories" :key="category" :label="category" required>
                  <b-form-select-option v-for="(subCategory, idx) in subCategories" :key="subCategory.id" :value="{ subCategory: subCategory.id, category: category }">{{ subCategory.title }}</b-form-select-option>
                </b-form-select-option-group>
              </b-form-select>
            </b-form-group>

            <b-form-group label="Amount:" label-for="input-recurring-plan-value">
              <b-form-input
                id="input-recurring-plan-value"
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

        <p class="h6 float-left">
          Add Income / Expense
        </p>
        <br><hr>
          <b-form @submit="submitExpenseModal" @reset="resetExpenseModal()">
            <label for="datepicker">Received / Spent On:</label>
            <input type="date" required v-model="addExpenseForm.spent_on" class="form-control sm-2" /><br>

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

            <b-form-group id="input-group-acc" label="Account:" label-for="input-acc">
              <b-form-select v-model="addExpenseForm.account_id" :options="accountOptions" required></b-form-select>
            </b-form-group>

            <b-form-group label="Amount:" label-for="input-expense-value">
              <b-form-input
                id="input-expense-value"
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
                <td class="small">{{ getDateFromTime(log.spent_on) }}: ${{ log.value }} for '{{ log.description }}' under {{ findCategoryById(log.category_id.$oid)[0] }} ({{ findCategoryById(log.category_id.$oid)[1] }}) in {{ accounts[log.account_id.$oid] }}</td>
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

    <div class="right-bottom-fixed-3" v-if="view == 'dontshownow'">
      <b-button class="view-logs" @click="viewAccountModal = !viewAccountModal">&#9737;</b-button>
      <b-modal v-model="viewAccountModal" centered hide-footer scrollable title="Accounts">
        <b-form-group label="Selecting accounts change the entire dashboard view.">
          <b-form-checkbox-group
            v-model="selectedAccount"
            :options="accountOptions"
            stacked
          ></b-form-checkbox-group>
        </b-form-group>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Doughnut from './graph/Doughnut.vue'
import LineChart from './graph/LineChart.vue'

export default {
  name: 'Dashboard',
  components: {
    Doughnut,
    LineChart
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
    setUserProfile: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/user_profile')
        .then(response => {
          this.userProfile = response.data;
        })
        .catch(error => {
          this.toast(error);
        });
    },
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

            if(this.monthlyBudget[year] == null) { this.$set(this.monthlyBudget, year, {}) }
            if(this.monthlyBudget[year][month] == null) { this.$set(this.monthlyBudget[year], month, {}) }
            if(this.monthlyBudget[year][month][category] == null) { this.$set(this.monthlyBudget[year][month], category, {}) }

            this.$set(this.monthlyBudget[year][month][category], this.addRecurringPlanForm.category_id, {});
            this.monthlyBudget[year][month][category][this.addRecurringPlanForm.category_id].planned = parseFloat(this.addRecurringPlanForm.value);
            this.monthlyBudget[year][month][category][this.addRecurringPlanForm.category_id].logs = [];
            this.monthlyBudget[year][month][category][this.addRecurringPlanForm.category_id].actual = 0;
          }

          this.resetRecurringPlanModal();
        })
        .catch(error => {
          this.$parent.toast(error);
        });
    },
    clickPrevBalUpdateModal: function(year, month) {
      this.addPrevBalUpdateForm = {"year": year, "month": month};
      if(this.view == 'planned') {
        this.addPrevBalUpdateForm.prev_month_bal_planned = this.monthlyBudget[year][month].prev_month_bal_planned;
      } else if (this.view == 'actual') {
        this.addPrevBalUpdateForm.prev_month_bal_actuals = this.monthlyBudget[year][month].prev_month_bal_actuals;
      }

      this.showPrevBalUpdateModal = !this.showPrevBalUpdateModal;
    },
    resetPrevMonthBalModal: function() {
      this.addPrevBalUpdateForm = { prev_month_bal_actuals: {} };
      this.showPrevBalUpdateModal = !this.showPrevBalUpdateModal;
    },
    submitPrevMonthBalModal: function(e) {
      e.preventDefault();
      if(this.addPrevBalUpdateForm.prev_month_bal_planned == null && this.addPrevBalUpdateForm.prev_month_bal_actuals == null) { return; }
      if(this.addPrevBalUpdateForm.prev_month_bal_planned != null && this.addPrevBalUpdateForm.prev_month_bal_actuals != null) { return; }

      var month = this.addPrevBalUpdateForm.month;
      var year = this.addPrevBalUpdateForm.year;
      var formattedMonth = ("0" + month).slice(-2);

      this.$http.put('users/' + localStorage.getItem('user') + '/monthly_budgets/' + formattedMonth + year, {
          "monthly_budget": this.addPrevBalUpdateForm
        })
        .then(response => {
          if(this.addPrevBalUpdateForm.prev_month_bal_planned != null) { this.monthlyBudget[year][month].prev_month_bal_planned = this.addPrevBalUpdateForm.prev_month_bal_planned; }
          if(this.addPrevBalUpdateForm.prev_month_bal_actuals != null) { this.monthlyBudget[year][month].prev_month_bal_actuals = this.addPrevBalUpdateForm.prev_month_bal_actuals; }
          this.resetPrevMonthBalModal();
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
          if(this.monthlyBudget[year] == null || this.monthlyBudget[year][month] == null || this.monthlyBudget[year][month][category] == null || this.monthlyBudget[year][month][category][this.addExpenseForm.category_id] == null) {
            this.showAddExpenseModal = !this.showAddExpenseModal;
            return;
          }
          this.monthlyBudget[year][month][category][this.addExpenseForm.category_id].actual += parseFloat(this.addExpenseForm.value);
          var temp = this.addExpenseForm;
          temp._id = {};
          temp._id.$oid = response.data._id.$oid;
          this.monthlyBudget[year][month][category][this.addExpenseForm.category_id].logs.push(this.addExpenseForm);

          var temp_cat_id = temp.category_id;
          temp.category_id = {};
          temp.category_id.$oid = temp_cat_id;

          if(this.monthlyLogs[year] == null) { this.$set(this.monthlyLogs, year, {}) }
          if(this.monthlyLogs[year][month] == null) { this.monthlyLogs[year][month] = [] }

          var idx = 0;

          for(var log_idx in this.monthlyLogs[year][month]) {
            var tmp_spent_on = this.monthlyLogs[year][month][log_idx].spent_on;
            var cmp_spent_on = this.addExpenseForm.spent_on;

            var d1 = new Date(tmp_spent_on);
            var d2 = new Date(cmp_spent_on);

            if (d2 >= d1) { idx = log_idx; break; }
          }
          this.monthlyLogs[year][month].splice(idx, 0, this.addExpenseForm);
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
    prevMonthBal: function(month, year) {
      if(this.view == 'planned') {
        return parseFloat(this.monthlyBudget[year][month].prev_month_bal_planned);
      } else {
        return Object.values(this.monthlyBudget[year][month].prev_month_bal_actuals || {}).reduce((t, n) => parseFloat(t) + parseFloat(n), 0);
      }
    },
    totalBalance: function(month, year) {
      var difference = this.totalInflow(month, year) - this.totalOutflow(month, year);
      var prevMonthBal = this.prevMonthBal(month, year);
      return (prevMonthBal + difference).toFixed(2);
    },
    subTotal: function(category, month, year) {
      var total = 0;

      if(this.monthlyBudget[year] != null && this.monthlyBudget[year][month] != null && this.monthlyBudget[year][month][category] != null) {
        for(var subCategory in this.monthlyBudget[year][month][category]) {
          if(this.view == 'planned') {
            total += parseFloat(this.monthlyBudget[year][month][category][subCategory].planned);
          } else {
            total += parseFloat(this.monthlyBudget[year][month][category][subCategory].actual);
          }
        }
      }

      if(isNaN(total)) { return 0; }
      else { return parseFloat(total.toFixed(2)); }
    },
    incomePercentWithinLimit: function(category, view, month, year) {
      var percentFromIncome = this.percentValueFromIncome(category, view, month, year);

      return (this.subTotalByType(category, view, month, year) <= percentFromIncome);
    },
    percentValueFromIncome: function(category, view, month, year) {
      var incomeSubTotal = this.subTotalByType('Income', view, month, year);
      if(incomeSubTotal == 0) { return 0; }

      var percentFromIncome = incomeSubTotal * (this.percentOfCategory(category) / 100);
      return percentFromIncome.toFixed(2);
    },
    percentOfCategory: function(category) {
      var snake_case_category = this.camelToSnake(category);

      if(category == "EMI") {
        return this.userProfile.expense_ratio['emi'];
      } else {
        return this.userProfile.expense_ratio[snake_case_category];
      }
    },
    camelToSnake: function(string) {
      return string.replace(/[\w]([A-Z])/g, function(m) { return m[0] + "_" + m[1]; }).toLowerCase();
    },
    subTotalByType: function(category, view, month, year) {
      var total = 0;

      if(this.monthlyBudget[year] != null && this.monthlyBudget[year][month] != null && this.monthlyBudget[year][month][category] != null) {
        for(var subCategory in this.monthlyBudget[year][month][category]) {
          if(view == 'planned') {
            total += parseFloat(this.monthlyBudget[year][month][category][subCategory].planned);
          } else {
            total += parseFloat(this.monthlyBudget[year][month][category][subCategory].actual);
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
    loadAccounts: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/accounts')
        .then(response => {
          for(var account of response.data) {
            this.accounts[account._id.$oid] = account.name;
          }
          this.accountOptions = response.data.map(function(acc) { return { text: acc.name, value: acc._id.$oid }; });
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

          var monthYear = this.monthYear;
          for (var i = 0; i < monthYear.length; i++) {
            var month = monthYear[i];

            if (this.monthlyBudget[month[1]] == null) { this.$set(this.monthlyBudget, month[1], {}) }
            if (monthlyBudget[month[1]] == null) { monthlyBudget[month[1]] = {} }

            if (this.monthlyBudget[month[1]][month[0]] == null) { this.$set(this.monthlyBudget[month[1]], month[0], {}) }
            if (monthlyBudget[month[1]][month[0]] == null) { monthlyBudget[month[1]][month[0]] = {} }

            this.monthlyBudget[month[1]][month[0]]["prev_month_bal_actuals"] = monthlyBudget[month[1]][month[0]].prev_month_bal_actuals || {};
            this.monthlyBudget[month[1]][month[0]]["prev_month_bal_planned"] = monthlyBudget[month[1]][month[0]].prev_month_bal_planned || 0;

            for (var category in this.categories) {
              if(this.monthlyBudget[month[1]][month[0]][category] == null) { this.$set(this.monthlyBudget[month[1]][month[0]], category, {}) }
              if(monthlyBudget[month[1]][month[0]][category] == null) { monthlyBudget[month[1]][month[0]][category] = {} }

              for (var subCategory of this.categories[category]) {
                if (monthlyBudget[month[1]][month[0]][category][subCategory.id] == null) {

                  this.$set(this.monthlyBudget[month[1]][month[0]][category], subCategory.id, { "planned": 0, "editing": false, "error": false, "actual": 0, "id": Math.random().toString(36), "logs": [] })

                } else {
                  monthlyBudget[month[1]][month[0]][category][subCategory.id]["editing"] = false;
                  monthlyBudget[month[1]][month[0]][category][subCategory.id]["error"] = false;
                  this.$set(this.monthlyBudget[month[1]][month[0]][category], subCategory.id, monthlyBudget[month[1]][month[0]][category][subCategory.id]);
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
      if(this.newCategory[category].trim() == '') { return; }

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

            if (this.monthlyBudget[month[1]] == null) { this.$set(this.monthlyBudget, month[1], {}) }
            if (this.monthlyBudget[month[1]][month[0]] == null) { this.$set(this.monthlyBudget[month[1]], month[0], {}) }
            if (this.monthlyBudget[month[1]][month[0]][category] == null) { this.$set(this.monthlyBudget[month[1]][month[0]], category, {}) }
            this.$set(this.monthlyBudget[month[1]][month[0]][category], response.data.id, { "planned": 0, "editing": false, "actual": 0, "logs": [], "id": Math.random().toString(36) });
          }

          this.categories[category].push(response.data);
          this.newCategory[category] = '';
          this.newCategoryShowButton[category] = false;
        })
        .catch(error => {
          this.$parent.toast(error);
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

          var deleteFromArray2 = this.monthlyBudget[year][month][temp_cat[1]][log.category_id.$oid].logs;
          this.monthlyBudget[year][month][temp_cat[1]][log.category_id.$oid].actual -= parseFloat(log.value);
          this.monthlyBudget[year][month][temp_cat[1]][log.category_id.$oid].logs = deleteFromArray2.filter(function(value, index, arr) { return value._id.$oid != log._id.$oid; });
        })
        .catch(error => {
          this.$parent.toast(error);
        });
    },
    updateDoughnutGraph: function() {
      var allLabels = [];
      var allPlannedData = [];
      var allActualData = [];

      var allBackgroundColor = [];
      var allBorderColor = [];

      var categories = [];

      if(this.monthlyBudget == null || this.percentageSplitMonth.length == 0) { return; }

      if(this.percentageSplitCategory == "All Expenses") {
        categories = ['Expense', 'EMI', 'EquityInvestment', 'DebtInvestment'];
      }
      else {
        categories = [this.percentageSplitCategory];
      }

      for(var category of categories) {
        if(this.categories[category] == null) { continue; }
        for(var subCategory of this.categories[category]) {
          if(
            this.monthlyBudget[this.percentageSplitMonth[1]] == null ||
            this.monthlyBudget[this.percentageSplitMonth[1]][this.percentageSplitMonth[0]] == null ||
            this.monthlyBudget[this.percentageSplitMonth[1]][this.percentageSplitMonth[0]][subCategory.type] == null ||
            this.monthlyBudget[this.percentageSplitMonth[1]][this.percentageSplitMonth[0]][subCategory.type][subCategory.id] == null) {
            continue;
          }

          allLabels.push(subCategory.title);
          allPlannedData.push(this.monthlyBudget[this.percentageSplitMonth[1]][this.percentageSplitMonth[0]][subCategory.type][subCategory.id].planned);
          allActualData.push(this.monthlyBudget[this.percentageSplitMonth[1]][this.percentageSplitMonth[0]][subCategory.type][subCategory.id].actual);

          var color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
          allBackgroundColor.push('rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', 0.2)');
          allBorderColor.push('rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', 1)');
        }
      }

      if(this.doughnutPlannedValues.datasets[0].backgroundColor.length >= allBackgroundColor.length) {
        allBackgroundColor = this.doughnutPlannedValues.datasets[0].backgroundColor;
        allBorderColor = this.doughnutPlannedValues.datasets[0].borderColor;
      }

      this.doughnutPlannedValues = {
        labels: allLabels,
        datasets: [
          {
            backgroundColor: allBackgroundColor,
            borderColor: allBorderColor,
            data: allPlannedData,
          }
        ]
      };
      this.doughnutActualValues = {
        labels: allLabels,
        datasets: [
          {
            backgroundColor: allBackgroundColor,
            borderColor: allBorderColor,
            data: allActualData,
          }
        ]
      };
    },
  },
  props: {
    selectedYear: Number
  },
  mounted: function () {
    this.initializeCategories();
    this.loadAccounts();
    if (this.selectedYear !== null) {
      this.updateMonthlyBudget();
      this.loadActualCashFlowLogs();
      this.percentageSplitMonth = [4, this.selectedYear];
      this.updateDoughnutGraph();
    }
    this.setUserProfile();
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
    },
    plannedYearlyValue: function() {
      if(this.graphYearlyCategory == null || this.monthlyBudget == null || this.monthlyBudget == {}) { return []; }
      var arr = [];
      for(var month of this.monthYear) {
        arr.push(this.monthlyBudget[month[1]][month[0]][this.graphYearlyCategory.category][this.graphYearlyCategory.subCategory].planned);
      }
      return arr;
    },
    actualYearlyValue: function() {
      if(this.graphYearlyCategory == null || this.monthlyBudget == null || this.monthlyBudget == {}) { return []; }
      var arr = [];
      for(var month of this.monthYear) {
        arr.push(this.monthlyBudget[month[1]][month[0]][this.graphYearlyCategory.category][this.graphYearlyCategory.subCategory].actual);
      }
      return arr;
    }
  },
  watch: {
    selectedYear: function() {
      if(this.populatedYears.indexOf(this.selectedYear) == -1) {
        this.updateMonthlyBudget();
        this.loadActualCashFlowLogs();
      }
    },
    graphYearlyCategory: function() {
      this.linechartValues = {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: "Planned",
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            data: this.plannedYearlyValue,
          },
          {
            label: "Actual",
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            data: this.actualYearlyValue,
          },
        ]
      }
    },
    percentageSplitCategory: function() { this.updateDoughnutGraph(); },
    percentageSplitMonth: function() { this.updateDoughnutGraph(); },
    view: function() { if( this.view == 'graph' ) { this.updateDoughnutGraph(); } }
  },
  data: function() {
    return {
      doughnutPlannedValues: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            borderColor: [],
            data: [],
          }
        ]
      },
      doughnutActualValues: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            borderColor: [],
            data: [],
          }
        ]
      },
      linechartValues: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: "Planned",
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            data: [],
          },
          {
            label: "Actual",
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            data: [],
          },
        ]
      },
      view: 'planned',
      viewOptions: [
        { value: 'planned', text: 'Budget planning' },
        { value: 'actual', text: 'Expense Tracker' },
        { value: 'monthly', text: 'Monthly Summary' },
        { value: 'graph', text: 'Graph View' },
      ],
      graphView: 'plannedVsActual',
      graphOptions: [
        { value: 'plannedVsActual', text: 'Planned Vs Actual' },
        { value: 'percentageSplit', text: 'Percentage Split' }
      ],
      graphYearlyCategory: null,
      percentageSplitMonth: [4, this.selectedYear],
      percentageSplitCategoryOptions: [
        'Income', 'All Expenses', 'Expense', 'EMI', 'EquityInvestment', 'DebtInvestment'
      ],
      percentageSplitCategory: "All Expenses",
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
      showPrevBalUpdateModal: false,
      addPrevBalUpdateForm: { prev_month_bal_actuals: {} },
      showRecurringPlanModal: false,
      addRecurringPlanForm: { "from": (new Date()).toISOString().slice(0,10) },
      viewLogsModal: false,
      monthlyLogsCollapse: {},
      monthlyLogs: {},
      viewAccountModal: false,
      accounts: {},
      accountOptions: [],
      selectedAccount: null,
      userProfile: {expense_ratio: {}},
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

.right-bottom-fixed-3 {
  position: fixed;
  bottom: 170px;
  right: 10px;
}

.link-as-text {
  color: black;
  text-decoration: none !important
}
</style>
