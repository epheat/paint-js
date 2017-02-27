// epheat
// CS 498 Group 3
// Paint.js
// <utility-button>

// utility-button is a component that is essentially a button that may be pressed, and fires an event when it is pressed.
Vue.component('utility-button', {

  // HTML template of the component
  template:
  `
  <div class="button-container">
    <a href="javascript:void(0)" class="button" v-bind:style="styleObject" v-on:mousedown="mouseDown" v-on:mouseup="mouseUp" v-on:mouseout="mouseOut">
      {{buttonName}}
    </a>
  </div>
  `,

  // props are local variables that receive changes from the parent element
  props: ['buttonName'],

  // in components, data must be a function, to keep local variables separate
  data: function() {
    return {
      pressed: false,
    }
  },

  // Component methods
  methods: {
    mouseDown: function() {
      this.pressed = true;
    },
    mouseUp: function() {
      if (this.pressed) {
        this.clickButton();
      }
      this.pressed = false;
    },
    mouseOut: function() {
      this.pressed = false;
    },
    clickButton: function() {
      this.$emit('buttonpress');
    }
  },

  // computed variables are recalculated any time its dependencies are updated
  computed: {
    boxShadowStyle: function() {
      if (this.pressed) {
        return "1px 1px 2px 0px #444444 inset";
      } else {
        return "1px 1px 2px 0px #444444";
      }
    },

    styleObject: function() {
      return {
        boxShadow: this.boxShadowStyle,
      }
    }

  }
})
