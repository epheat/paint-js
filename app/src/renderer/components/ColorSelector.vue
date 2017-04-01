<!-- epheat
CS 498 Group 3
Paint.js -->

<template>
  <div class="color-container">
    <div class="color-text">{{selectorName}}</div>
    <div class="color-box">
      <div class="transparency-indicator">
        <div class="transparency-white"></div>
        <div class="transparency-grey"></div>
        <div class="transparency-white"></div>
        <div class="transparency-grey"></div>
        <div class="transparency-white"></div>
        <div class="transparency-grey"></div>
        <div class="transparency-white"></div>
        <div class="transparency-grey"></div>
        <div class="transparency-white"></div>
      </div>
      <a href="javascript:void(0)" class="color-selector" v-bind:style="styleObject" v-on:mousedown="select" oncontextmenu="return false;">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  // props are local variables that receive changes from the parent element
  props: ['selectorName', 'selected', 'colorStyle'],

  // in components, data must be a function, to keep local variables separate
  data: function() {
    return {

    }
  },

  // Component methods
  methods: {
    select: function(e) {
      if (e.which == 1) {
        this.$emit('select');
      } else {
        this.$emit('customswatch');
      }
    }
  },

  // computed variables are recalculated any time its dependencies are updated
  computed: {
    boxShadowStyle: function() {
      if (this.selected) {
        return "2px 2px 2px 0px #444444, 0px 0px 0px 2px #fff inset";
      } else {
        return "2px 2px 2px 0px #444444";
      }
    },

    styleObject: function() {
      return {
        backgroundColor: this.colorStyle,
        boxShadow: this.boxShadowStyle,
      }
    }

  }
}
</script>

<style>
.color-container {
  display: inline-block;
  vertical-align: top;
  margin-top: 10px;
  width: 80px;
  height: 80px;
}
.color-text {
  font-family: 'Muli', sans-serif;
  text-align: center;
}
.color-box {
  position: relative;
  margin-left: 10px;
  margin-right: 10px;
  width: 60px;
  height: 60px;
  box-shadow: 2px 2px 2px 0px #444444;
}
.transparency-indicator {
  display: inline-block;
  height: 100%;
  width: 100%;
}
.transparency-white {
  padding: 0px;
  margin: 0px;
  float: left;
  height: 33.3%;
  width: 33.3%;
  background-color: lightgrey;
}
.transparency-grey {
  padding: 0px;
  margin: 0px;
  float: left;
  height: 33.3%;
  width: 33.3%;
  background-color: grey;
}
.color-selector {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  height: 60px;
  width: 60px;
  opacity: 1;
}
</style>
