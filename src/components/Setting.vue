<template>
  <div>
    <Benefit />
    <br>
    <Category />
  </div>
</template>

<script>
import Benefit from './Benefit.vue'
import Category from './Category.vue'

export default {
  name: 'Setting',
  components: {
    Benefit,
    Category
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
