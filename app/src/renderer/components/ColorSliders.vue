<!-- epheat
CS 498 Group 3
Paint.js -->

<template>
  <div class="controllers">
    <input class="red-slider" type="range" v-model="channel_R" min="0" max="255" > Red
    <input class="green-slider" type="range" v-model="channel_G" min="0" max="255" > Green
    <input class="blue-slider" type="range" v-model="channel_B" min="0" max="255" > Blue
    <input class="brightness-slider" type="range" v-model="channel_A" min="0" max="255" > Alpha
  </div>
</template>

<script>
export default {
  // props are local variables that receive changes from the parent element
  props: ['colorProp'],

  // in components, data must be a function, to keep local variables separate
  data: function() {
    return {

      channel_R: this.colorProp.red,
      channel_G: this.colorProp.green,
      channel_B: this.colorProp.blue,
      channel_A: this.colorProp.alpha,

    }
  },
  watch: {
    color_style: function() {
        this.emitColorChange();
    }
  },

  // computed variables are recalculated any time its dependencies are updated
  computed: {
    color_style: function() {
      // color_style is used in the stylesheet for this component
      return "rgba(" + this.channel_R + ", " + this.channel_G + ", " + this.channel_B + ", " + this.channel_A/255 + ")";
    }
  },

  // Component methods
  methods: {
    emitColorChange: function() {
      this.$emit('colorchanged', {color_style: this.color_style, color: {red: this.channel_R, green: this.channel_G, blue: this.channel_B, alpha: this.channel_A} })
    },
    updateChannels: function() {
      this.channel_R = this.colorProp.red;
      this.channel_G = this.colorProp.green;
      this.channel_B = this.colorProp.blue;
      this.channel_A = this.colorProp.alpha;
    }
  }
}
</script>

<style>
/* styling the sliders */
input[type=range] {
  -webkit-appearance: none;
  display: inline-block;
  margin-right: 10px;
  width: calc(100% - 100px);
  background-color: #99ccff;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 300px;
  height: 5px;
  background: #ddd;
  border: none;
  border-radius: 3px;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  margin-top: -6px;
}

input[type=range]:focus {
  outline: none;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #ccc;
}
.red-slider::-webkit-slider-thumb {
  background: #ff4444;
}
.green-slider::-webkit-slider-thumb {
  background: #44ff44;
}
.blue-slider::-webkit-slider-thumb {
  background: #4444ff;
}
.darkness-slider::-webkit-slider-thumb {
  background: #444444;
}
.brightness-slider::-webkit-slider-thumb {
  background: #aaaaaa;
}
/* end styling sliders */

.controllers {
  width: 250px;
  margin: 0;
  margin-left: 10px;
  margin-top: 8px;
  display: inline-block;
  vertical-align: top;
}
</style>
