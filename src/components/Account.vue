<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <p class="h5 float-left">
          Accounts <b-link id="tooltip-target-account" style="text-decoration: none;">&#128161;</b-link>
          <b-tooltip target="tooltip-target-account" triggers="hover">
            Add multiple accounts. Accounts like bank account, credit cards, etc. This helps you to add expenses based on accounts.
          </b-tooltip>
        </p>
        <br><hr>

        <div class="shadow-lg bg-light" style="padding: 5px;">
          <table class="table-sm table-bordered table-responsive">

            <thead>
              <th>Name</th>
              <th></th>
            </thead>

            <tbody>
              <tr v-for="account in accounts" :key="account._id.$oid">
                <td @click="toggleEditingAccount(account, 'name')">
                  <div v-if="!showInput(account, 'name')">
                    {{ account.name }}
                  </div>
                  <div v-if="showInput(account, 'name')">
                    <input class="form-control input-sm" v-focus type="text" v-model="account.name" @blur="updateAccount(account)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(account, 'name')">
                  </div>
                </td>
                <td></td>
              </tr>
              <tr>
                <td><input class="form-control input-sm" type="text" v-model="newAccount.name"></td>
                <td colspan="1" style="min-width: 70px"><button class="btn btn-primary" @click="saveNewAccount">Save</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data: function() {
    return {
      accounts: [],
      previousValue: null,
      newAccount: {
        name: null
      }
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
    cancelEdit: function(account, field) {
      account[field] = this.previousValue;
      account.editing = null;
    },
    loadAccounts: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/accounts')
        .then(response => {
          this.accounts = response.data;
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });
    },
    toggleEditingAccount: function(account, field) {
      this.previousValue = account[field];
      this.$set(account, 'editing', field)
    },
    showInput: function(account, field) {
      return (account.editing == field);
    },
    updateAccount: function(account) {
      this.$http.put('users/' + localStorage.getItem('user') + '/accounts/' + account._id.$oid, { account: account })
        .then(response => {
          account.editing = null;
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.loadAccounts();
          this.$parent.$parent.toast(error);
        });
    },
    saveNewAccount: function() {
      this.$http.post('users/' + localStorage.getItem('user') + '/accounts', { account: this.newAccount })
        .then(response => {
          var data = response.data;

          this.accounts.push(data);
          this.newAccount.name = null;
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });
    }
  },
  mounted: function () {
    this.loadAccounts();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input, button {
  max-height: 24px;
  width: 100%;
}
button {
  padding: 0px;
}
</style>
