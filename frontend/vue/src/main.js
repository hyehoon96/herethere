import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './index.css'
import mixin from './mixin'
import CustomDialog from '@/components/CustomDialog'

Vue.config.productionTip = false
Vue.mixin(mixin)
Vue.component('custom-dialog',CustomDialog);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
