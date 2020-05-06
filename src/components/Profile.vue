<template>
  <div class="container">
    <div class="row">
      <div :class="{ 'col-md-8': showAd, 'col-md-12': !showAd }">
        <p class="h5 float-left">
          User Profile
        </p>
        <br><hr>
        <div class="bg-light shadow-lg" style="padding: 5px;">
          <table class="table-sm table-bordered">
            <tr>
              <th>First Name</th>
              <td><input class="form-control input-sm" type="text" v-model="user_profile.first_name" required></td>
            </tr>
            <tr>
              <th>Last Name</th>
              <td><input class="form-control input-sm" type="text" v-model="user_profile.last_name" required></td>
            </tr>
            <tr>
              <th>Date of Birth</th>
              <td><input class="form-control input-sm" type="date" v-model="user_profile.dob" required></td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>
                <select class="form-control input-sm" v-model="user_profile.gender" required>
                  <option v-for="gender in genders" :key="gender" :value="gender">{{ gender }}</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>Suggested Expense Ratio</th>
              <td>
                <div class="row">
                  <div class="col-3">{{ "30" }}</div>
                  <div class="col-3">{{ "40" }}</div>
                  <div class="col-3">{{ (30 * age) / 100 }}</div>
                  <div class="col-3">{{ (30 - ((30 * age) / 100)).toFixed(1) }}</div>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                Expense Ratio <b-link id="tooltip-expense-ratio" style="text-decoration: none;">&#128161;</b-link>
                <b-tooltip target="tooltip-expense-ratio" triggers="hover">
                  This is the ratio you planned to spend your income. Understand the budgeting thumb rule and set the ratio. The inputs are in the order Expense, EMI, EquityInvestment, DebtInvestment
                </b-tooltip>
              </th>
              <td>
                <div class="row">
                  <div class="col-3" style="padding-right: 0px"><input class="form-control input-sm" type="text" v-model="user_profile.expense_ratio.expense" required></div>
                  <div class="col-3" style="padding-left: 5px; padding-right: 3px"><input class="form-control input-sm" type="text" v-model="user_profile.expense_ratio.emi" required></div>
                  <div class="col-3" style="padding-left: 5px; padding-right: 3px"><input class="form-control input-sm" type="text" v-model="user_profile.expense_ratio.equity_investment" required></div>
                  <div class="col-3" style="padding-left: 0px"><input class="form-control input-sm" type="text" v-model="user_profile.expense_ratio.debt_investment" required></div>
                </div>
              </td>
            </tr>
<!--             <tr>
              <th>Country</th>
              <td>
                <select class="form-control input-sm" v-model="user_profile.country" required>
                  <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
                </select>
              </td>
            </tr> -->
            <tr>
              <th>Monthly Income (Optional)</th>
              <td><input class="form-control input-sm" type="text" v-model="user_profile.monthly_income"></td>
            </tr>
            <tr>
              <th>
                Emergency Corpus (Optional) <b-link id="tooltip-emergency-corpus" style="text-decoration: none;">&#128161;</b-link>
                <b-tooltip target="tooltip-emergency-corpus" triggers="hover">
                  Having an emergency corpus helps to financially manage a job loss, illness, accidents and so on. The corpus should help you survive the contingency. So the corpus size can be 3 months to 18 months of the monthly expenses, which one needs at minimum to survive.
                </b-tooltip>
              </th>
              <td><input class="form-control input-sm" type="text" v-model="user_profile.emergency_corpus"></td>
            </tr>
            <tr>
              <td></td>
              <td><button class="btn btn-primary form-control" @click="saveProfile">Save</button></td>
            </tr>
          </table>
        </div>
      </div>
      <div :class="{ 'col-md-4': showAd }">
        <div style="min-width: 250px">
          <Adsense
            :data-ad-client="ad_client"
            :data-ad-slot="ad_slot"
            data-ad-format="rectangle"
            :data-full-width-responsive="true"
          >
          </Adsense>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  props: {
    showAd: { type: Boolean, default: false }
  },
  data: function() {
    return {
      user_profile: {expense_ratio: {}},
      genders: ["Male", "Female", "Androgyny"],
      countries: ["India"],
      ad_client: process.env.VUE_APP_ADSENSE_PUB,
      ad_slot: process.env.VUE_APP_ADSENSE_SQUARE_SLOT
    }
  },
  methods: {
    loadUserProfile: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/user_profile')
        .then(response => {
          if(response.data != null) { this.user_profile = response.data; }
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });
    },
    saveProfile: function() {
      this.$http.put('users/' + localStorage.getItem('user') + '/user_profile', { user_profile: this.user_profile })
        .then(response => {
          location.reload();
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.loadUserProfile();
          this.$parent.$parent.toast(error);
        });
    },
    fetchCountriesList: function() {
      this.$http.get('https://restcountries.eu/rest/v2/all').then(function (res) {
          self.countries = res.body;
        }, function(err) {
          console.log('error');
        });
    }
  },
  computed: {
    age: function() {
      if(this.user_profile.dob == null) { return 0; }

      var dob = new Date(this.user_profile.dob);
      var ageDifMs = Date.now() - dob.getTime();
      var ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
  },
  mounted: function () {
    this.loadUserProfile();
  },
  watch: {
    user_profile: function() {
      this.user_profile.equity_investment = (30 * this.age) / 100;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
