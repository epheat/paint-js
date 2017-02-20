// color-sliders is an input component that can edit RGB values using 5 sliders.
Vue.component('color-sliders', {
  template: `<div class="controllers"><input class="red-slider" type="range" v-model="channel_R" min="0" max="255" >Red<br><input class="green-slider" type="range" v-model="channel_G" min="0" max="255" >Green<br><input class="blue-slider" type="range" v-model="channel_B" min="0" max="255" >Blue<br><input class="darkness-slider" type="range" v-model="darkness" min="0" max="255" >Darkness<br><input class="brightness-slider" type="range" v-model="brightness" min="0" max="255" >Brightness<br></div>`,

  // props are local variables that receive changes from the parent element
  props: ['channelRProp', 'channelGProp', 'channelBProp'],

  // data must be a function, to keep local variables separate
  data: function() {
    return {

      channel_R: this.channelRProp,
      channel_G: this.channelGProp,
      channel_B: this.channelBProp,

      dark_ratios: [0, 0, 0],
      bright_ratios: [0, 0, 0],
      darkness:0,
      brightness:0
    }
  },

  // watch causes updates every time certain variables are changed
  watch: {
    channel_R: function() {
      this.updateRatios();
      this.updateDarkness();
      this.updateBrightness();
      this.emitColorChange();
    },
    channel_G: function() {
      this.updateRatios();
      this.updateDarkness();
      this.updateBrightness();
      this.emitColorChange();
    },
    channel_B: function() {
      this.updateRatios();
      this.updateDarkness();
      this.updateBrightness();
      this.emitColorChange();
    },
    darkness: function() {
      this.updateChannelsDark();
    },
    brightness: function() {
      this.updateChannelsBright();
    }
  },

  computed: {
    color_style: function() {
      // color_style is used in the stylesheet for this component
      return "rgba(" + this.channel_R + ", " + this.channel_G + ", " + this.channel_B + ", 1)";
      this.emitColorChange();
    }

  },

  methods: {
    // TODO: updateRatios should really only be called when the top 3 (RGB) sliders are changed
    updateRatios: function() {
      var max = Math.max(this.channel_R, this.channel_G, this.channel_B);
      var min = Math.min(this.channel_R, this.channel_G, this.channel_B);
      if (max == 0) max = 1; // to prevent divide by zero errors
      if (min == 255) min = 254; // to prevent divide by zero errors
      this.dark_ratios[0] = this.channel_R / max;
      this.dark_ratios[1] = this.channel_G / max;
      this.dark_ratios[2] = this.channel_B / max;

      this.bright_ratios[0] = (255 - this.channel_R) / (255 - min);
      this.bright_ratios[1] = (255 - this.channel_G) / (255 - min);
      this.bright_ratios[2] = (255 - this.channel_B) / (255 - min);

    },
    updateDarkness: function() {
      this.darkness = Math.max(this.channel_R, this.channel_G, this.channel_B);
    },
    updateBrightness: function() {
      this.brightness = Math.min(this.channel_R, this.channel_G, this.channel_B);
    },
    updateChannelsDark: function() {
      this.channel_R = Math.round(this.dark_ratios[0] * this.darkness);
      this.channel_G = Math.round(this.dark_ratios[1] * this.darkness);
      this.channel_B = Math.round(this.dark_ratios[2] * this.darkness);
    },
    updateChannelsBright: function() {
      this.channel_R = Math.round(255 - this.bright_ratios[0] * (255 - this.brightness));
      this.channel_G = Math.round(255 - this.bright_ratios[1] * (255 - this.brightness));
      this.channel_B = Math.round(255 - this.bright_ratios[2] * (255 - this.brightness));
    },
    emitColorChange: function() {
      this.$emit('colorchanged', {color_style: this.color_style, R: this.channel_R, G: this.channel_G, B: this.channel_B} );
    }
  }

})
