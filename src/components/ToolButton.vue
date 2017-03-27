<!-- epheat
CS 498 Group 3
Paint.js -->

<template>
  <div class="tool-button-container">
    <a href="javascript:void(0)" class="tool-button" :style="styleObject" @mousedown="mouseDown" @mouseup="mouseUp" @mouseout="mouseOut">
      {{buttonName}}
    </a>
  </div>
</template>

<script>
export default {
  // props are local variables that receive changes from the parent element
  props: ['buttonName', 'selected'],

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
      if (this.pressed || this.selected) {
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
}
</script>

<style>

</style>
