<template>
  <div class="row">
    <div class="col-md-12">
      <div class="container">
        <div class="row">
          <div class="col-md-8">
            <Profile />
          </div>
        </div>
      </div>
      <br>
      <Goal />
      <br>
      <Asset />
    </div>
  </div>
</template>

<script>
import Profile from './Profile.vue'
import Goal from './Goal.vue'
import Asset from './Asset.vue'

export default {
  name: 'Summary',
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
