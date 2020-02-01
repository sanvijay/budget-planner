<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8">
        <p class="h5 float-left">
          Your Assets
        </p>
        <br><hr>

        <div class="shadow-lg" style="padding: 5px;">
          <table class="table-sm table-bordered">

            <thead>
              <th>Title</th>
              <th>Value</th>
              <th></th>
            </thead>

            <tbody>
              <tr v-for="asset in assets" :key="asset._id.$oid">
                <td @dblclick="toggleEditingAsset(asset, 'title')">
                  <div v-if="!showInput(asset, 'title')">
                    {{ asset.title }}
                  </div>
                  <div v-if="showInput(asset, 'title')">
                    <input class="form-control input-sm" v-focus type="text" v-model="asset.title" @blur="updateAsset(asset)" @keyup.enter="updateAsset(asset)" @keyup.esc="cancelEdit(asset, 'title')">
                  </div>
                </td>
                <td @dblclick="toggleEditingAsset(asset, 'value')">
                  <div v-if="!showInput(asset, 'value')">
                    &#8377; {{ asset.value }}
                  </div>
                  <div v-if="showInput(asset, 'value')">
                    <input class="form-control input-sm" v-focus type="text" v-model="asset.value" @blur="updateAsset(asset)" @keyup.enter="updateAsset(asset)" @keyup.esc="cancelEdit(asset, 'value')">
                  </div>
                </td>
                <td></td>
              </tr>
              <tr>
                <td><input class="form-control input-sm" type="text" v-model="newAsset.title"></td>
                <td><input class="form-control input-sm" type="text" v-model="newAsset.value"></td>
                <td colspan="3" style="min-width: 70px"><button class="btn btn-info" @click="saveNewAsset">Save</button></td>
              </tr>
            </tbody>
          </table>
          <!-- <div style="background-color: #f1f3f4">
            <select v-model="selectedYear">
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Asset',
  data: function() {
    return {
      assets: [],
      previousValue: null,
      selectedYear: 2019,
      years: [2019, 2020],
      newAsset: {
        title: null,
        value: null
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
    cancelEdit: function(asset, field) {
      asset[field] = this.previousValue;
      asset.editing = null;
    },
    loadAssets: function(year) {
      this.$http.get('users/' + localStorage.getItem('user') + '/assets')
        .then(response => {
          this.assets = response.data;
        })
        .catch(function (error) {
          console.error(error.response);
        });
    },
    toggleEditingAsset: function(asset, field) {
      this.previousValue = asset[field];
      this.$set(asset, 'editing', field)
    },
    showInput: function(asset, field) {
      return (asset.editing == field);
    },
    updateAsset: function(asset) {
      this.$http.put('users/' + localStorage.getItem('user') + '/assets/' + asset._id.$oid, { asset: asset })
        .then(response => {
          asset.editing = null;
        })
        .catch(error => {
          // TODO: Refactor this with a feature.
          this.loadAssets();
          console.error(error.response);
        });
    },
    saveNewAsset: function() {
      this.$http.post('users/' + localStorage.getItem('user') + '/assets', { asset: this.newAsset })
        .then(response => {
          this.assets.push(response.data);
          this.newAsset.title = null;
          this.newAsset.value = null;
        })
        .catch(function (error) {
          console.error(error.response);
        });
    }
  },
  mounted: function () {
    this.loadAssets(this.selectedYear);
  },
  watch: {
    selectedYear: function() {
      this.loadAssets(this.selectedYear);
    }
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
