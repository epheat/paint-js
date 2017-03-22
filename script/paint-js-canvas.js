// epheat
// CS 498 Group 3
// Paint.js
// <paint-js-canvas>

// paint-js-canvas is a component that draws on a canvas according to primary/secondary colors and the current tool
Vue.component('paint-js-canvas', {

  // HTML template of the component
  template: `<div><canvas id="canvas" ref="canvas" height="400px" width="400px" oncontextmenu="return false;" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" @mouseout="mouseOut"></canvas><br>prevX: {{prevX}} prevY: {{prevY}}   currX: {{currX}} currY: {{currY}}</div>`,

  // props are local variables that receive changes from the parent element
  // TODO: add 'tool' as a prop
  props: ['primaryColor', 'secondaryColor', 'primaryColorStyle', 'secondaryColorStyle'],

  // data must be a function, to keep local variables separate
  data: function() {
    return {
      canvas: null,
      context: null,
      draw_flag: false,
      dot_flag: false,
      prevX: 0,
      currX: 0,
      prevY: 0,
      currY: 0,
      w: 0,
      h: 0,
      line_width: 2,

      imgData: null,

      // TODO: COREY
      // add undo and redo stacks here

    }
  },

  // basically, called once the page is initialized
  mounted: function() {
    this.canvas = this.$refs.canvas;
    this.context = this.canvas.getContext("2d");
    this.w = this.canvas.width;
    this.h = this.canvas.height;

    this.imgData = this.context.getImageData(0, 0, this.w, this.h);
    this.context.imageSmoothingEnabled = false;
  },

  // Component methods
  methods: {

    mouseDown: function(e) {

      // draw initial dot
      if (e.which == 1) {
        this.updatePixel(this.currX, this.currY, this.primaryColor);
      } else {
        this.updatePixel(this.currX, this.currY, this.secondaryColor);
      }

      this.draw_flag = true;
    },
    mouseMove: function(e) {

      this.prevX = this.currX;
      this.prevY = this.currY;

      this.currX = e.pageX - this.canvas.offsetLeft;
      this.currY = e.pageY - this.canvas.offsetTop;

      if (this.draw_flag) {
        // for left click, draw with primary. Right click, draw with secondary
        if (e.which == 1) {
          this.draw_line(this.primaryColor);
        } else {
          this.draw_line(this.secondaryColor);
        }

      }
    },
    mouseUp: function(e) {
      this.draw_flag = false;

      // TODO: COREY
      // save canvas to undo stack

    },
    mouseOut: function(e) {
      this.draw_flag = false;

      // TODO: COREY
      // save canvas to undo stack

    },

    draw_line: function(draw_color) {
      // Draw a raster line from (prevX, prevY) to (currX, currY) using Bresenham's line algorithm
      // https://en.wikipedia.org/wiki/Bresenham's_line_algorithm
      // http://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript

      var dx = Math.abs(this.currX - this.prevX);
      var dy = Math.abs(this.currY - this.prevY);
      var sx = (this.prevX < this.currX) ? 1 : -1;
      var sy = (this.prevY < this.currY) ? 1 : -1;
      var err = dx - dy;

      while(true){

        this.updatePixel(this.prevX, this.prevY, draw_color);

        if ((this.prevX==this.currX) && (this.prevY==this.currY)) break;
        var e2 = 2*err;
        if (e2 >-dy) {
          err -= dy;
          this.prevX += sx;
        }
        if (e2 < dx) {
          err += dx;
          this.prevY += sy;
        }
      }

    },

    draw_thick_line: function(draw_color) {

      // TODO: BGIV
      // replace instances of the draw_line() function in the mousemove/mousedown with this function to test.
      // you'll want to draw a thick line from (this.prevX, this.prevY) to (this.currX, this.currY)




    },

    updatePixel: function(x, y, draw_color) {
      var pixel = this.context.createImageData(1,1);
      // set the pixel to the draw_color
      pixel.data[0] = draw_color.red;
      pixel.data[1] = draw_color.green;
      pixel.data[2] = draw_color.blue;
      // set alpha value for pixel to 255;
      pixel.data[3] = 255;
      this.context.putImageData(pixel, x, y);
    },

    clearCanvas: function() {
      var new_canvas = this.context.createImageData(this.w, this.h);
      this.context.putImageData(new_canvas, 0, 0);
    },

    saveCanvas: function() {

      console.log("saving...");
      // TODO: GARRETT

    },

    undoCanvas: function() {
      // TODO: COREY
    },

    redoCanvas: function() {
      // TODO: COREY
    }

  },

  computed: {

  }
})
