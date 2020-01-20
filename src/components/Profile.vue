<template>
  <div>
    <p>
      This is Profile page.
    </p>

    <div>
      <table border="1">
        <tr>
          <th>First Name</th>
          <td><input type="text" v-model="user_profile.first_name"></td>
        </tr>
        <tr>
          <th>Last Name</th>
          <td><input type="text" v-model="user_profile.last_name"></td>
        </tr>
        <tr>
          <th>Date of Birth</th>
          <td><input type="date" v-model="user_profile.dob"></td>
        </tr>
        <tr>
          <th>Gender</th>
          <td>
            <select v-model="user_profile.gender">
              <option v-for="gender in genders" :key="gender" :value="gender">{{ user_profile.gender }}</option>
            </select>
          </td>
        </tr>
      </table>

      <button @click="saveNewProfile">Save</button>
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
      this.$http.get(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/user_profiles', {
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          this.user_profile = response.data;
        })
        .catch(function (error) {
          console.error(error.response);
        });
    },
    saveNewProfile: function() {
      this.$http.put(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/user_profiles/', {
          user_profile: this.user_profile,
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
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
