<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12">
        <Profile :showAd="true" />
        <br>
        <Goal />
        <br>
        <Asset :selectedYear="selectedYear" />
      </div>
    </div>
  </div>
</template>

<script>
import Profile from './Profile.vue'
import Goal from './Goal.vue'
import Asset from './Asset.vue'

export default {
  name: 'Summary',
  props: {
    selectedYear: Number
  },
  components: {
    Profile,
    Goal,
    Asset
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
