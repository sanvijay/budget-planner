<template>
  <div class="container">
    <div class="row">
      <div class="col-md-8">
        <p class="h5 float-left">
          Your Assets / Liabilities <b-link id="tooltip-target-asset" style="text-decoration: none;">&#128161;</b-link>
          <b-tooltip target="tooltip-target-asset" triggers="hover">
            Add all your properties here (like car, home, etc.). We will track your expenses by the mapped categories to your properties. Such that you can know if it is your real asset or liability. Check category section to map your properties.
          </b-tooltip>
        </p>
        <br><hr>

        <div class="shadow-lg bg-light" style="padding: 5px;">
          <table class="table-sm table-bordered table-responsive">

            <thead>
              <th>Title</th>
              <th>Value</th>
              <th>Year's Expenses</th>
              <th>Overall Expenses</th>
            </thead>

            <tbody>
              <tr v-for="asset in assets" :key="asset._id.$oid">
                <td @click="toggleEditingAsset(asset, 'title')">
                  <div v-if="!showInput(asset, 'title')">
                    {{ asset.title }}
                  </div>
                  <div v-if="showInput(asset, 'title')">
                    <input class="form-control input-sm" v-focus type="text" v-model="asset.title" @blur="updateAsset(asset)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(asset, 'title')">
                  </div>
                </td>
                <td @click="toggleEditingAsset(asset, 'value')">
                  <div v-if="!showInput(asset, 'value')">
                    &#8377; {{ asset.value }}
                  </div>
                  <div v-if="showInput(asset, 'value')">
                    <input class="form-control input-sm" v-focus type="text" v-model="asset.value" @blur="updateAsset(asset)" @keyup.enter="$event.target.blur()" @keyup.esc="cancelEdit(asset, 'value')">
                  </div>
                </td>
                <td>
                  <div class="green">+ {{ asset.yearly_cost.inflow }}</div>
                  <div class="red">- {{ asset.yearly_cost.outflow }}</div>
                </td>
                <td>
                  <div class="green">+ {{ asset.total_cost.inflow }}</div>
                  <div class="red">- {{ asset.total_cost.outflow }}</div>
                </td>
              </tr>
              <tr>
                <td><input class="form-control input-sm" type="text" v-model="newAsset.title"></td>
                <td><input class="form-control input-sm" type="text" v-model="newAsset.value"></td>
                <td colspan="2" style="min-width: 70px"><button class="btn btn-primary" @click="saveNewAsset">Save</button></td>
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
            data-full-width-responsive="true"
          >
          </Adsense>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Asset',
  props: {
    selectedYear: Number
  },
  data: function() {
    return {
      assets: [],
      previousValue: null,
      newAsset: {
        title: null,
        value: null,
        valid_from: null
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
    cancelEdit: function(asset, field) {
      asset[field] = this.previousValue;
      asset.editing = null;
    },
    loadAssets: function() {
      if(this.selectedYear == null) { return; }

      this.$http.get('users/' + localStorage.getItem('user') + '/assets', {
          params: { "financial_year": this.selectedYear }
        })
        .then(response => {
          this.assets = response.data;
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });;
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
          this.$parent.$parent.toast(error);
        });
    },
    saveNewAsset: function() {
      this.$http.post('users/' + localStorage.getItem('user') + '/assets', { asset: this.newAsset })
        .then(response => {
          this.assets.push(response.data);
          this.newAsset.title = null;
          this.newAsset.value = null;
        })
        .catch(error => {
          this.$parent.$parent.toast(error);
        });;
    }
  },
  mounted: function () {
    this.loadAssets();
  },
  watch: {
    selectedYear: function() {
      this.loadAssets();
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
.green {
  color: green;
  font-weight: bold;
}
.red {
  color: red;
  font-weight: bold;
}
</style>
