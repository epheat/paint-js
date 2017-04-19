import Vue from 'vue'
import Electron from 'vue-electron'
import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css'

Vue.use(Electron)
Vue.config.debug = true

import PaintJs from './PaintJs'

new Vue({
  el: '#paint-js',
  render: h => h(PaintJs),
})
