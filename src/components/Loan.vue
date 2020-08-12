<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8">
        <p class="h5 float-left">
          Your Debts <b-link id="tooltip-target-loan" style="text-decoration: none;">&#128161;</b-link>
          <b-tooltip target="tooltip-target-loan" triggers="hover">
            Track all your loan here. You can understand the loans better from here.
          </b-tooltip>
        </p>
        <br><hr>
        <small style="color: white" class="float-left">(Coming Soon: Better tool to close your loans efficiently.)</small><br>

        <div class="shadow-lg bg-light" style="padding: 5px;">
          <table class="table-sm table-bordered table-responsive">
            <thead>
              <th>Description</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Loan Amount</th>
              <th>EMI</th>
              <th>Planned</th>
              <th>Overall Saved</th>
            </thead>

            <tbody>
              <tr v-for="loan in loans" :key="loan._id.$oid">
                <td @click="toggleEditingLoan(loan, 'description')">
                  <div v-if="!showInput(loan, 'description')">
                    {{ loan.description }}
                  </div>
                  <div v-if="showInput(loan, 'description')">
                    <input class="form-control input-sm" v-focus type="text" v-model="loan.description" @blur="updateLoan(loan)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(loan, 'description')">
                  </div>
                </td>
                <td @click="toggleEditingLoan(loan, 'start_date')">
                  <div v-if="!showInput(loan, 'start_date')">
                    {{ loan.start_date }}
                  </div>
                  <div v-if="showInput(loan, 'start_date')">
                    <input class="form-control input-sm" v-focus type="date" v-model="loan.start_date" @blur="updateLoan(loan)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(loan, 'start_date')">
                  </div>
                </td>
                <td @click="toggleEditingLoan(loan, 'end_date')">
                  <div v-if="!showInput(loan, 'end_date')">
                    {{ loan.end_date }}
                  </div>
                  <div v-if="showInput(loan, 'end_date')">
                    <input class="form-control input-sm" v-focus type="date" v-model="loan.end_date" @blur="updateLoan(loan)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(loan, 'end_date')">
                  </div>
                </td>
                <td @click="toggleEditingLoan(loan, 'value')">
                  <div v-if="!showInput(loan, 'value')">
                    $ {{ loan.value }}
                  </div>
                  <div v-if="showInput(loan, 'value')">
                    <input class="form-control input-sm" v-focus type="text" v-model="loan.value" @blur="updateLoan(loan)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(loan, 'value')">
                  </div>
                </td>

                <td @click="toggleEditingLoan(loan, 'emi')">
                  <div v-if="!showInput(loan, 'emi')">
                    $ {{ loan.emi }}
                  </div>
                  <div v-if="showInput(loan, 'emi')">
                    <input class="form-control input-sm" v-focus type="text" v-model="loan.emi" @blur="updateLoan(loan)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(loan, 'emi')">
                  </div>
                </td>

                <td>$ {{ loan.planned.toFixed(2) }}</td>
                <td>$ {{ loan.actual.toFixed(2) }}</td>
              </tr>
              <tr>
                <td><input class="form-control input-sm" type="text" v-model="newLoan.description"></td>
                <td><input class="form-control input-sm" type="date" v-model="newLoan.start_date"></td>
                <td><input class="form-control input-sm" type="date" v-model="newLoan.end_date"></td>
                <td><input class="form-control input-sm" type="text" v-model="newLoan.value"></td>
                <td><input class="form-control input-sm" type="text" v-model="newLoan.emi"></td>
                <td colspan="2"><button class="btn btn-primary" @click="saveNewLoan">Save</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="col-md-4">
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
  name: 'Loan',
  data: function() {
    return {
      loans: [],
      previousValue: null,
      newLoan: {
        description: null,
        start_date: null,
        end_date: null,
        value: null,
        emi: null
      },
      ad_client: process.env.VUE_APP_ADSENSE_PUB,
      ad_slot: process.env.VUE_APP_ADSENSE_SQUARE_SLOT
    }
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
    cancelEdit: function(loan, field) {
      loan[field] = this.previousValue;
      loan.editing = null;
    },
    loadLoans: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/loans')
        .then(response => {
          this.loans = response.data;
        })
        .catch(function (error) {
          console.error(error.response);
        });
    },
    toggleEditingLoan: function(loan, field) {
      this.previousValue = loan[field];
      this.$set(loan, 'editing', field)
    },
    showInput: function(loan, field) {
      return (loan.editing == field);
    },
    updateLoan: function(loan) {
      this.$http.put('users/' + localStorage.getItem('user') + '/loans/' + loan._id.$oid, {
          loan: loan
        })
        .then(response => {
          loan.editing = null;
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.loadLoans();
          this.$parent.$parent.toast(error);
        });
    },
    saveNewLoan: function() {
      this.$http.post('users/' + localStorage.getItem('user') + '/loans', {
          loan: this.newLoan
        })
        .then(response => {
          var data = response.data;
          data.actual = 0;
          data.planned = 0;
          this.loans.push(data);
          this.newLoan.description = null;
          this.newLoan.start_date = null;
          this.newLoan.end_date = null;
          this.newLoan.value = null;
          this.newLoan.emi = null;
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });
    }
  },
  mounted: function () {
    this.loadLoans();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
td {
  max-width: 120px;
  min-width: 120px;
}
input, button {
  max-height: 24px;
  width: 100%;
}
button {
  padding: 0px;
}
</style>
