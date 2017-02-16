// color-swatch is a component that contains an rgb value and can be selected/deselected
Vue.component('color-swatch' {
  template: `<div class="color-container"><div class="color-text">{{swatch_name}}</div><div class="color-box"><a href="javascript:void(0)" class="color-selector" id="primary-color" v-bind:style="{ backgroundColor: colorStyle }" v-on:click="selectSwatch"></a></div></div>`,

  // props are local variables that receive changes from the parent element
  props: ['swatch_name', 'channelRProp', 'channelGProp', 'channelBProp'],

  // data must be a function, to keep local variables separate
  data: function() {
    return {
      // in order to not mutate props, make local variables that have prop values as their initial values
      channel_R: this.channelRProp,
      channel_G: this.channelGProp,
      channel_B: this.channelBProp,

      selected: false

    }
  },

  computed: {
      // colorStyle is used in the stylesheet for this component
      colorStyle: function(){
        return 'rgba('+ this.channel_R+','+ this.channel_G+','+ this.channel_B+', 1)';
      }
  },

  methods: {
    selectSwatch: function() {
      this.$emit('selectswatch');
      this.selected = true;
    }


  }



})
