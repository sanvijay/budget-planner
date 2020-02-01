import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Axios from 'axios'
import BootstrapVue from 'bootstrap-vue'

Vue.prototype.$http = Axios;
Axios.defaults.baseURL = process.env.VUE_APP_API_URL;
if(localStorage.getItem('jwt') != null) {
  Axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwt');
}
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Axios.defaults.headers.post['Access-Control-Allow-Origin'] = process.env.VUE_APP_API_URL;

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
