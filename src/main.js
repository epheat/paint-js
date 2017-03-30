// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Bootstrap from 'bootstrap/dist/css/bootstrap.css'
import PaintJs from './PaintJs.vue'

new Vue({
  el: '#paint-js',
  render: h => h(PaintJs),
})
