// epheat
// CS 498 Group 3
// Paint.js
// <tool-sliders>

// tool-sliders is an input component that can edit tool parameters using sliders.
Vue.component('tool-sliders', {

  // HTML template of the component
  template:
  `<div class="tool-controllers">
    <template v-for="(value, key, index) in toolProperties">
      <input class="brightness-slider" type="range" v-model="toolProperties[key]" min="0" max="99" > {{ key }} : {{ value }} <br>
    </template>
  </div>`,

  // props are local variables that receive changes from the parent element
  props: ['toolProperties'],

  // in components, data must be a function, to keep local variables separate
  data: function() {
    return {

    }
  },

})
