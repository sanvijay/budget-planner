<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <p class="h5 float-left">
          Two Factor Authentication
        </p>
        <br><hr>
        <small style="color: white" class="float-left">(Coming Soon)</small><br>
        <div class=" shadow-lg" style="padding: 5px;">
          <table class="table-sm table-striped">
            <tr>
              <th>Phone Number (+91):</th>
              <td v-if="!verified"><input class="form-control input-sm" type="text" v-model="phone_number" required></td>
              <td v-if="verified"><font-awesome-icon icon="check-square" :style="{ color: 'green' }" title="Verified" /> {{ phone_number }}</td>
            </tr>
            <tr v-if="SMSSent && !verified">
              <th>Enter PIN:</th>
              <td>
                <input class="form-control input-sm" type="text" v-model="pin">
                <small>Try after sometime if you haven't received the SMS</small>
              </td>
            </tr>
            <tr v-if="!verified">
              <td></td>
              <td v-if="!SMSSent"><button class="btn btn-primary form-control" @click="sendPIN">Send PIN</button></td>
              <td v-if="SMSSent"><button class="btn btn-primary form-control" @click="verifyPIN">Verify PIN</button></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TwoFactorAuth',
  data: function() {
    return {
      phone_number: null,
      pin: null,
      SMSSent: false,
      verified: false
    }
  },
  methods: {
    loadUserProfile: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/phone_numbers')
        .then(response => {
          if(response.data != null) {
            this.phone_number = response.data.phone_number;
            this.verified = response.data.verified;
          }
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });
    },
    sendPIN: function() {
      if (this.verified == true) { return; }
      this.$http.post('users/' + localStorage.getItem('user') + '/phone_numbers', {
          phone_number: this.phone_number
        })
        .then(response => {
          this.SMSSent = true;
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });
    },
    verifyPIN: function() {
      if (this.verified == true) { return; }
      this.$http.post('users/' + localStorage.getItem('user') + '/phone_numbers/verify', {
          phone_number: this.phone_number,
          pin: this.pin
        })
        .then(response => {
          this.verified = true;
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });
    }
  },
  mounted: function () {
    this.loadUserProfile();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
