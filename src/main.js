import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/assets/iconfont/iconfont.css' // icon css

import './icons' // icon
import './permission' // permission control
import i18n from './lang'

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

axios.setConfig = function (config) {
  axios.defaults.baseURL = config.BASE_URL
  axios.defaults.timeout = config.AJAX_TIMEOUT
}

Vue.config.productionTip = false
axios.get('/cloud-rbac/global-config.json').then((res) => { // cloud-rbac
  // console.log(res)
  Vue.prototype.g_Config = res.data
  axios.setConfig(Vue.prototype.g_Config)
  /* eslint-disable no-new */
  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')
})
