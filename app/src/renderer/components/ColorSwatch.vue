<!-- epheat
CS 498 Group 3
Paint.js -->

<template>
  <div class="swatch">
    <div class="transparency-indicator">
      <div class="swatch-transparency-white"></div>
      <div class="swatch-transparency-grey"></div>
      <div class="swatch-transparency-grey"></div>
      <div class="swatch-transparency-white"></div>
    </div>
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
        backgroundColor: "rgba(" + this.rgb.red + ", " + this.rgb.green + ", " + this.rgb.blue + ", " + this.rgb.alpha/255 + ")"
      }
    }

  }
}
</script>

<style>
.swatch {
  position: relative;
  display: inline-block;
  box-shadow: 1px 1px 1px 0px #444444;
  width: 20px;
  height: 20px;
  margin: 5px;
}
.swatch-button {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  height: 20px;
  width: 20px;
  opacity: 1;
}
.transparency-indicator {
  display: inline-block;
  height: 100%;
  width: 100%;
}
.swatch-transparency-white {
  padding: 0px;
  margin: 0px;
  float: left;
  height: 50%;
  width: 50%;
  background-color: lightgrey;
}
.swatch-transparency-grey {
  padding: 0px;
  margin: 0px;
  float: left;
  height: 50%;
  width: 50%;
  background-color: grey;
}
</style>
