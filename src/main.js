import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Axios from 'axios'
import BootstrapVue from 'bootstrap-vue'

Vue.prototype.$http = Axios;

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
