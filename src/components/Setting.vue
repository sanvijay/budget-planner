<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-8 col-sm-12">
          <Benefit :selectedYear="selectedYear" />
          <br>
          <Category />
        </div>
        <div style="min-width: 250px">
          <Adsense
            :data-ad-client="ad_client"
            :data-ad-slot="ad_slot"
            data-ad-format="vertical"
            :data-full-width-responsive="true"
          >
          </Adsense>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Benefit from './Benefit.vue'
import Category from './Category.vue'

export default {
  name: 'Setting',
  data: function() {
    return {
      ad_client: process.env.VUE_APP_ADSENSE_PUB,
      ad_slot: process.env.VUE_APP_ADSENSE_VERTICAL_SLOT
    }
  },
  props: {
    selectedYear: Number
  },
  components: {
    Benefit,
    Category
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
