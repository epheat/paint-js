

// color-swatch is a component that receives an rgb value and can be selected/deselected
Vue.component('color-swatch', {
  template: `<div class="color-container"><div class="color-text">{{swatchName}}</div><div class="color-box"><a href="javascript:void(0)" class="color-selector" v-bind:style="styleObject" v-on:click="selectSwatch"></a></div></div>`,

  // props are local variables that receive changes from the parent element
  props: ['swatchName', 'selected', 'colorStyle'],

  // data must be a function, to keep local variables separate
  data: function() {
    return {

    }
  },

  methods: {
    selectSwatch: function() {
      this.$emit('selectswatch', {name: this.swatchName});
    }
  },
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
})
