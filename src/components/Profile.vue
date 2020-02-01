<template>
  <div>
    <p class="h5 float-left">
      Profile
    </p>
    <br><hr>

    <div class="shadow-lg" style="padding: 5px;">
      <table class="table-sm table-bordered">
        <tr>
          <th>First Name</th>
          <td><input class="form-control input-sm" type="text" v-model="user_profile.first_name"></td>
        </tr>
        <tr>
          <th>Last Name</th>
          <td><input class="form-control input-sm" type="text" v-model="user_profile.last_name"></td>
        </tr>
        <tr>
          <th>Date of Birth</th>
          <td><input class="form-control input-sm" type="date" v-model="user_profile.dob"></td>
        </tr>
        <tr>
          <th>Gender</th>
          <td>
            <select class="form-control input-sm" v-model="user_profile.gender">
              <option v-for="gender in genders" :key="gender" :value="gender">{{ gender }}</option>
            </select>
          </td>
        </tr>
        <tr>
          <th>Monthly Income</th>
          <td><input class="form-control input-sm" type="text" v-model="user_profile.monthly_income"></td>
        </tr>
        <tr>
          <td></td>
          <td><button class="btn btn-info form-control" @click="saveProfile">Save</button></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data: function() {
    return {
      user_profile: {},
      genders: ["Male", "Female", "Androgyny"]
    }
  },
  methods: {
    loadUserProfile: function() {
      this.$http.get('users/' + localStorage.getItem('user') + '/user_profile')
        .then(response => {
          if(response.data != null) { this.user_profile = response.data; }
        })
        .catch(function (error) {
          console.error(error.response);
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
          console.error(error.response);
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
