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
            data-ad-format="auto"
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
      user_profile: {},
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
  mounted: function () {
    this.loadUserProfile();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
