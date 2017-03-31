<template>
  <div id="paint-js" @mousemove="mouseMove">
     <!-- @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" -->
    <div id="toolbars">

      <ul class="row tab-area">
        <li class="col-xs-3 col-sm-2 col-lg-1 tab" v-for="(tab, index) in tabs"><a href="javascript:void(0)" class="tablink" :class="{active: tab_selected == index}" @click="openTab(index)">
          {{ tabs[index] }}
        </a></li>
      </ul>

      <div id="utilities" v-if="tab_selected == 0">
        <utility-button
          v-for="(button, index) in utility_buttons"
          :key="button"
          :button-name="button"
          @buttonpress="executeUtility(index)" >
        </utility-button>
      </div>

      <div id="tools" v-if="tab_selected == 1">
        <div class="tools-container">
            <tool-button
              v-for="(tool, index) in tools"
              :key="tool"
              :button-name="tool.name"
              :selected="index == tool_selected"
              @buttonpress="selectTool(index)" >
            </tool-button>
        </div>
        <div class="tools-sliders-container">
          <tool-sliders
            v-for="(tool, index) in tools"
            v-if="index == tool_selected"
            :key="tool"
            :tool-properties="tools[index].properties" >
          </tool-sliders>
        </div>

      </div>

      <div id="colors" v-if="tab_selected == 2">

        <!-- TODO: wrap these into columns using bootstrap -->

        <div class="selector-container">
          <color-selector
            :selector-name="primary_swatch_name"
            :selected="primary_selected"
            :color-style="primary_style"
            @select="selectPrimarySwatch"
            @customswatch="customSwatchFromPrimary">
          </color-selector>
          <color-selector
            :selector-name="secondary_swatch_name"
            :selected="secondary_selected"
            :color-style="secondary_style"
            @select="selectSecondarySwatch"
            @customswatch="customSwatchFromSecondary">
          </color-selector>
          <color-sliders
            ref="primarycolorsliders"
            :color-prop="primary_color"
            :visible="primary_selected"
            @colorchanged="updatePrimaryColor">
          </color-sliders>
          <color-sliders
            ref="secondarycolorsliders"
            :color-prop="secondary_color"
            :visible="secondary_selected"
            @colorchanged="updateSecondaryColor">
          </color-sliders>
        </div>
        <div class="swatch-container">
          <color-swatch
            v-for="(swatch, index) in swatches"
            key="swatch"
            :rgb="swatch"
            :index="index"
            @swatch="updateSelector"
            @deleteswatch="deleteSwatch">
          </color-swatch>
        </div>

        <!-- blend modes -->
        <select v-model="blend_mode">
          <option>normal</option>
          <option>darken</option>
          <option>lighten</option>
          <option>luminosity</option>
          <option>overlay</option>
          <option>color-dodge</option>
          <option>color-burn</option>
          <option>difference</option>
          <option>hard-light</option>
          <option>soft-light</option>
          <option>color</option>

        </select>



      </div>

      <div id="other" class="row tabcontent" v-if="tab_selected == 3">

        <a href="in_progress/color-sliders.html">Color Picker Demo</a>

      </div>

    </div>
    <div id="canvas-area">

      <paint-js-canvas
      ref="paintjscanvas"
      :primary-color="primary_color"
      :secondary-color="secondary_color"
      :primary-color-style="primary_style"
      :secondary-color-style="secondary_style"
      :tool="tools[tool_selected]"
      :blend-mode="blend_mode" >
      </paint-js-canvas>

    </div>
  </div>
</template>

<script>

// import all used components
import UtilityButton from './components/UtilityButton.vue'
import ToolButton from './components/ToolButton.vue'
import ToolSliders from './components/ToolSliders.vue'
import ColorSelector from './components/ColorSelector.vue'
import ColorSliders from './components/ColorSliders.vue'
import ColorSwatch from './components/ColorSwatch.vue'
import PaintJsCanvas from './components/PaintJsCanvas.vue'


export default {
  data: function() {
    return {
      tabs: ['Utilities', 'Tools', 'Colors', 'Other'],
      tab_selected: 0,

      tools:  [ { name: 'pencil', properties: { width: 1 } },
                { name: 'brush', properties: { width: 5, hardness: 99 } },
                { name: 'eraser', properties: { width: 5 } },
                { name: 'bucket', properties: { leniency: 0 } },
                { name: 'pen', properties: { width: 5, angle: 0 } },
              ],

      tool_selected: 0,

      primary_color: {red: 0, green: 0, blue: 0},
      secondary_color: {red: 0, green: 0, blue: 0},

      primary_swatch_name: 'Primary',
      secondary_swatch_name: 'Secondary',
      primary_selected: true,
      secondary_selected: false,
      primary_style: 'rgba(0, 0, 0, 1)',
      secondary_style: 'rgba(0, 0, 0, 1)',

      swatches:         [ { red: 255, green: 0, blue: 0 },
                          { red: 200, green: 20, blue: 40 },
                          { red: 160, green: 40, blue: 80 },
                          { red: 120, green: 60, blue: 120 },
                          { red: 80, green: 80, blue: 160 },
                          { red: 40, green: 100, blue: 200 },
                          { red: 0, green: 120, blue: 255 },
                          { red: 20, green: 140, blue: 0 },
                          { red: 40, green: 160, blue: 40 },
                          { red: 60, green: 180, blue: 80 },
                          { red: 80, green: 200, blue: 120 },
                          { red: 100, green: 220, blue: 160 },
                          { red: 120, green: 240, blue: 200 },
                          { red: 140, green: 255, blue: 240 },
                          { red: 160, green: 0, blue: 255 },
                          { red: 180, green: 40, blue: 240 },
                          { red: 200, green: 80, blue: 220 },
                          { red: 220, green: 120, blue: 200 },
                          { red: 240, green: 160, blue: 180 },
                          { red: 255, green: 200, blue: 160 },
                          { red: 240, green: 255, blue: 140 },
                          { red: 220, green: 180, blue: 120 },
                          { red: 200, green: 100, blue: 100 },
                          { red: 180, green: 0, blue: 80 },
                          { red: 160, green: 100, blue: 60 },
                          { red: 140, green: 180, blue: 40 },
                          { red: 120, green: 255, blue: 20 },
                          { red: 100, green: 240, blue: 0 },
                          { red: 80, green: 200, blue: 60 },
                          { red: 60, green: 100, blue: 120 }
      ],

      blend_mode: 'normal',

      utility_buttons: ['Save', 'Load', 'Undo', 'Redo', 'Clear']

    }
  },

  methods: {
    openTab: function(tab) {
      this.tab_selected = tab;
    },
    executeUtility: function(utility) {
      if (utility == 0) {         // save
        this.saveCanvas();
      } else if (utility == 1) {  // load

        // TODO: GARRETT

      } else if (utility == 2) {  // undo
        this.undoCanvas();
      } else if (utility == 3) {  // redo
        this.redoCanvas();
      } else if (utility == 4) {  // clear
        this.clearCanvas();
      }
    },

    selectTool: function(t) {
      this.tool_selected = t;
    },

    updatePrimaryColor: function(e) {
      this.primary_color.red = e.red;
      this.primary_color.green = e.green;
      this.primary_color.blue = e.blue;
      this.primary_style = e.color_style;
    },
    updateSecondaryColor: function(e) {
      this.secondary_color.red = e.red;
      this.secondary_color.green = e.green;
      this.secondary_color.blue = e.blue;
      this.secondary_style = e.color_style;
    },

    selectPrimarySwatch: function(e) {
      this.primary_selected = true;
      this.secondary_selected = false;
    },
    selectSecondarySwatch: function(e) {
      this.secondary_selected = true;
      this.primary_selected = false;
    },

    updateSelector: function(e) {
      if (this.primary_selected) {
        this.primary_color.red = e.rgb.red;
        this.primary_color.green = e.rgb.green;
        this.primary_color.blue = e.rgb.blue;
        this.primary_style = "rgba(" + this.primary_color.red + ", " + this.primary_color.green + ", " + this.primary_color.blue + ", 1)";
        this.$refs.primarycolorsliders.updateChannels();
      } else {
        this.secondary_color.red = e.rgb.red;
        this.secondary_color.green = e.rgb.green;
        this.secondary_color.blue = e.rgb.blue;
        this.secondary_style = "rgba(" + this.secondary_color.red + ", " + this.secondary_color.green + ", " + this.secondary_color.blue + ", 1)";
        this.$refs.secondarycolorsliders.updateChannels();
      }
    },

    deleteSwatch: function(e) {
      this.swatches.splice(e, 1);
    },

    customSwatchFromPrimary: function() {
      this.swatches.splice(this.swatches.length, 0, {red: this.primary_color.red, green: this.primary_color.green, blue: this.primary_color.blue});
    },

    customSwatchFromSecondary: function() {
      this.swatches.splice(this.swatches.length, 0, {red: this.secondary_color.red, green: this.secondary_color.green, blue: this.secondary_color.blue});
    },

    saveCanvas: function() {
      // execute saveCanvas() method from child
      this.$refs.paintjscanvas.saveCanvas();
    },

    undoCanvas: function() {
      this.$refs.paintjscanvas.undoCanvas();
    },
    redoCanvas: function() {
      this.$refs.paintjscanvas.redoCanvas();
    },

    clearCanvas: function() {
      // execute clearCanvas() method from child
      this.$refs.paintjscanvas.clearCanvas();
    },

    mouseDown: function(e) {
      this.$refs.paintjscanvas.mouseDown(e);
    },
    mouseMove: function(e) {
      this.$refs.paintjscanvas.continueResize(e);
      // this.$refs.paintjscanvas.mouseMove(e);
    },
    mouseUp: function(e) {
      this.$refs.paintjscanvas.mouseUp(e);
    }

  },

  components: {
    'utility-button': UtilityButton,
    'tool-button': ToolButton,
    'tool-sliders': ToolSliders,
    'color-selector': ColorSelector,
    'color-sliders': ColorSliders,
    'color-swatch': ColorSwatch,
    'paint-js-canvas': PaintJsCanvas
  }
}
</script>

<style>
html{
  height: 100%;
}

body{
  margin: 0px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
#paint-js {
  height: 100%;
}

/* toolbars div is the top 150px of the screen */
#toolbars {
  background-color: #99ccff;
  min-height: 150px;

}
/* canvas-area div is the remaining area of the screen */
#canvas-area {
  background-color: #e6e6e6;

}
#canvas {
  background-color: white;
  cursor: crosshair;
  box-shadow: 0px 0px 0px 1px #000000 inset;
}

.tab {
  height: 26px;
  margin-top: 4px;
  display: inline-block;
}

.tabcontent {
  display: block;
}

.tablink {
  font-family: 'Muli', sans-serif;
  display: block;
  /*box-shadow: 0px 0px 0px 1px #000000 inset;*/
  background-color: #80b3ff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%;
  height: 100%;
  text-align: center;
  color: black;
  text-decoration: none;
}

.active {
  background-color: #99ccff;
}


.tab-area {
  list-style-type: none;
  padding-left: 0px;
  margin: 0px;
  height: 30px;
  background-color: #8080ff;
  /*box-shadow: 0px 0px 0px 1px #000000 inset;*/
}

/* styles for color tab */
#colors {

}

.color-container {
  width: 60px;
  height: 60px;
}
.color-text {
  font-family: 'Muli', sans-serif;
  text-align: center;
}
.color-box {
  margin-left: 5px;
  margin-right: 5px;
  width: 50px;
  height: 50px;
  box-shadow: 2px 2px 2px 0px #444444;
}

.swatch {
  display: inline-block;
  box-shadow: 1px 1px 1px 0px #444444;
  width: 20px;
  height: 20px;
  margin: 5px;
}
.swatch-button {
  display: inline-block;
  width: 100%;
  height: 100%;
}

.swatch-container {
  display: inline-block;
  height: 100%;
  width: 300px;
}

.selector-container {
  margin-left: 15px;
  display: inline-block;
  vertical-align: top;
  height: 100%;
  width: 450px;
}

/* end styles for color tab */

/* styles for utilities tab */
.button-container {
  display: inline-block;
  width: 80px;
  height: 80px;
  margin: 10px;
  margin-top: 20px;
}

.button {
  display: block;
  text-align: center;
  background-color: #80b3ff;
  width: 100%;
  height: 100%;
}


/* end styles for utilities tab */

/* styles for tools tab */
.tools-container {
  display: inline-block;
  margin-top: 30px;
  width: 260px;
  height: 100%;
  margin-left: 15px;

}
.tools-sliders-container {
  display: inline-block;
  vertical-align: top;
  margin-top: 30px;
  width: 200px;
  height: 100%;

}

.tool-controllers {
  width: 250px;
  margin: 0;
  display: inline-block;
  vertical-align: top;
}

.tool-button-container {
  display: inline-block;
  width: 50px;
  height: 60px;
}

.tool-button {
  display: block;
  text-align: center;
  background-color: #80b3ff;
  width: 100%;
  height: 100%;
}

/* end styles for tools tab */


</style>
