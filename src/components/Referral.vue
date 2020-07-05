<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <p class="h5 float-left">
          Referral
        </p>
        <br><hr>
        <div class="bg-light shadow-lg" style="padding: 5px;">
          <table class="table-sm table-bordered">
            <tr>
              <th>Current Plan:</th>
              <td>{{ user_access.plan }}</td>
            </tr>
            <tr v-if="user_access.plan_updated_at != null">
              <th>Plan updated at:</th>
              <td>{{ user_access.plan_updated_at }}</td>
            </tr>
            <tr>
              <th>Referral Code:</th>
              <td>{{ user_access.referring_token }}</td>
            </tr>
            <tr>
              <th>Referred By:</th>
              <td>{{ user_access.referred_by || "None" }}</td>
            </tr>
            <tr>
              <th>Referred Count:</th>
              <td>
                {{ user_access.completed_referred_users }} <b-link id="tooltip-show-referral-msg" style="text-decoration: none;">&#128161;</b-link>
                <b-tooltip target="tooltip-show-referral-msg" triggers="hover">
                  Out of {{ user_access.referred_users }} user(s), {{ user_access.completed_referred_users }} successfully completed referral process.
                  Claim PLUS Access button will be enabled after 3 such successful referrals.
                </b-tooltip>
              </td>
            </tr>
            <tr>
              <th></th>
              <td><button class="btn btn-primary form-control" @click="claimPlusAccess" :disabled="user_access.referred_users < 3">Claim PLUS Access</button></td>
            </tr>
          </table>
        </div>
        <div class="bg-light shadow-lg" style="padding: 5px;">
          <p>Invite your friends to finsey.</p>
          <a target="_blank" :href="whatsappInviteText" data-action="share/whatsapp/share" class="btn btn-success whatsapp-font"><b><font-awesome-icon :icon="['fab', 'whatsapp']" />&nbsp; Invite friends on Whatsapp</b></a><br><br>
        </div>

        <div class="bg-light shadow-lg" style="padding: 5px;" v-if="user_access.referred_by == null">
          <p>Do you have an referral code?</p>
          <table class="table-sm table-bordered">
            <tr>
              <th>Enter Token:</th>
              <td>
                <input class="form-control input-sm" type="text" v-model="refer_token" required>
                <button class="btn btn-primary form-control" @click="enterReferringToken">Enter</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Referral',
  data: function() {
    return {
      user_access: {},
      refer_token: null
    }
  },
  computed: {
    whatsappInviteText() {
      return "https://wa.me/?text=I+have+a+referral+code+for+finsey+plus+account.+Enter+this+code+after+registering+to+finsey.%0D%0A%0D%0AReferral+code%3A+" + this.user_access.referring_token + "%0D%0A%0D%0Afinsey.+is+the+budget+planner+project+designed+during+the+quarantine+period.+Planning+your+budget+will+make+sure+to+pass+any+critical+stages+and+have+a+peaceful+future.";
    },
  },
  methods: {
    loadUserAccess: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/user_access')
        .then(response => {
          if(response.data != null) {
            this.user_access = response.data;
          }
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });
    },
    enterReferringToken: function() {
      this.$http.post('users/' + localStorage.getItem('user') + '/refer', { referral_id: this.refer_token })
        .then(response => {
          if(response.data != null) {
            // Please do a better way
            this.loadUserAccess();
          }
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });
    },
    claimPlusAccess: function() {
      this.$http.post('users/' + localStorage.getItem('user') + '/claim_plus_access')
        .then(response => {
          if(response.data != null) {
            // Please do a better way
            this.loadUserAccess();
          }
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });
    }
  },
  mounted: function () {
    this.loadUserAccess();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
