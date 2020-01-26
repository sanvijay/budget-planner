<template>
  <div>
    <p>
      This is CustomRule page.
    </p>

    <div>
      <table border="1">
        <tr>
          <th>emergency_corpus</th>
          <td colspan="2"><input type="text" v-model="custom_rule.emergency_corpus"></td>
        </tr>
        <tr>
          <th rowspan="4">outflow_split_percentage</th>
          <td>emi</td>
          <td><input type="text" v-model="custom_rule.outflow_split_percentage.emi"></td>
        </tr>
        <tr>
          <td>expense</td>
          <td><input type="text" v-model="custom_rule.outflow_split_percentage.expense"></td>
        </tr>
        <tr>
          <td>equity_investment</td>
          <td><input type="text" v-model="custom_rule.outflow_split_percentage.equity_investment"></td>
        </tr>
        <tr>
          <td>debt_investment</td>
          <td><input type="text" v-model="custom_rule.outflow_split_percentage.debt_investment"></td>
        </tr>
        <tr>
          <th>emergency_corpus_score_weightage_out_of_100</th>
          <td colspan="2"><input type="text" v-model="custom_rule.emergency_corpus_score_weightage_out_of_100">%</td>
        </tr>
        <tr>
          <th>outflow_split_score_weightage_out_of_100</th>
          <td colspan="2"><input type="text" v-model="custom_rule.outflow_split_score_weightage_out_of_100">%</td>
        </tr>
        <tr><button @click="saveNewCustomRule">Save</button></tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomRule',
  data: function() {
    return {
      custom_rule: {
        outflow_split_percentage: {}
      }
    }
  },
  methods: {
    loadCustomRule: function() {
      this.$http.get(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/custom_rule', {
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .then(response => {
          if(response.data != null) { this.custom_rule = response.data; }
        })
        .catch(function (error) {
          console.error(error.response);
        });
    },
    saveNewCustomRule: function() {
      this.$http.put(process.env.VUE_APP_API_URL + 'users/' + localStorage.getItem('user') + '/custom_rule/', {
          custom_rule: this.custom_rule,
          headers: {
            // https://github.com/axios/axios/issues/475
            'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin': process.env.VUE_APP_API_URL
          }
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.loadCustomRule();
          console.error(error.response);
        });
      }
  },
  mounted: function () {
    this.loadCustomRule();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
