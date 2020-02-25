<template>
  <div>
    <div class="LeadImage">
      <div class="image" style="background-image: url('img/common-backgroud.svg'), url('img/common-backgroud.svg');"></div>
      <div class="ie-hack-vertical"></div>
      <div class="ie-hack-horizontal"></div>
      <div class="triangle">
        <svg fill="white" preserveAspectRatio="none" viewBox="0 0 25 100" class="jsx-4194311832 Triangle">
          <polygon points="0,100 25,0 25,100" class="jsx-4194311832"></polygon>
        </svg>
      </div>
    </div>
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
