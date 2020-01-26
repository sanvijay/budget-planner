<template>
  <div>
    <Profile />
    <br>
    <Goal />
  </div>
</template>

<script>
import Profile from './Profile.vue'
import Goal from './Goal.vue'

export default {
  name: 'Summary',
  components: {
    Profile,
    Goal,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
