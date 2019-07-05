import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'
import store from './store'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)
Vue.use(ElementUI)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  // ...
  var token = localStorage.getItem('itcastpro_token')
  if (token || to.path === '/login') {
    next()
  } else {
    next({ name: 'Login' })
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
