<!-- epheat
CS 498 Group 3
Paint.js -->

<template>
  <div class="swatch">
    <a href="javascript:void(0)" class="swatch-button" :style="styleObject" @mousedown="click" oncontextmenu="return false;"></a>
  </div>
</template>

<script>
export default {
  // props are local variables that receive changes from the parent element
  // rgb should be an object with red, blue, and green properties
  props: ['rgb', 'index'],

  // in components, data must be a function, to keep local variables separate
  data: function() {
    return {

    }
  },

  // Component methods
  methods: {
    click: function(e) {
      if (e.which == 1) {
        this.$emit('swatch', {rgb: this.rgb});
      } else {
        this.$emit('deleteswatch', this.index);
      }
    }
  },

  // computed variables are recalculated any time its dependencies are updated
  computed: {
    styleObject: function() {
      return {
        backgroundColor: "rgba(" + this.rgb.red + ", " + this.rgb.green + ", " + this.rgb.blue + ", 1)"
      }
    }

  }
}
</script>

<style>

</style>
