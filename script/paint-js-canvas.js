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
  props: ['primaryColor', 'secondaryColor', 'primaryColorStyle', 'secondaryColorStyle', 'tool', 'blendMode'],

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

      undo_stack: [],
      redo_stack: []

    }
  },

  // basically, called once the page is initialized
  mounted: function() {
    this.canvas = this.$refs.canvas;
    this.context = this.canvas.getContext("2d");
    this.w = this.canvas.width;
    this.h = this.canvas.height;

    this.context.imageSmoothingEnabled = false;

  },

  // Component methods
  methods: {

    mouseDown: function(e) {

      this.saveCanvasToUndoStack();

      // draw initial dot
      if (e.which == 1) {
        this.draw(this.currX, this.currY, this.primaryColor);
      } else {
        this.draw(this.currX, this.currY, this.secondaryColor);
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
          this.draw_line(this.prevX, this.prevY, this.currX, this.currY, this.primaryColor);
        } else {
          this.draw_line(this.prevX, this.prevY, this.currX, this.currY, this.secondaryColor);
        }

      }
    },
    mouseUp: function(e) {
      this.draw_flag = false;

    },
    mouseOut: function(e) {
      this.draw_flag = false;

    },

    draw: function(x, y, draw_color) {
      if (this.tool.name == "pencil") {
        this.drawCircle(x, y, this.tool.properties.width/2, draw_color);
      } else if (this.tool.name == "brush") {

      } else if (this.tool.name == "eraser") {
        this.drawCircle(x, y, this.tool.properties.width/2, {red: 255, green: 255, blue: 255});
      } else if (this.tool.name == "bucket") {

      } else if (this.tool.name == "pen") {

      } else {

      }
    },

    draw_line: function(x0, y0, xf, yf, draw_color) {
      if (this.tool.name == "pencil") {
        this.draw_line_builtin(x0, y0, xf, yf, this.tool.properties.width, draw_color);
      } else if (this.tool.name == "brush") {

      } else if (this.tool.name == "eraser") {
        this.draw_line_builtin(x0, y0, xf, yf, this.tool.properties.width, {red: 255, green: 255, blue: 255});
      } else if (this.tool.name == "bucket") {

      } else if (this.tool.name == "pen") {

      } else {

      }

    },

    draw_line_builtin: function(x0, y0, xf, yf, width, draw_color) {
      this.context.beginPath();
      this.context.moveTo(x0, y0);
      this.context.lineTo(xf, yf);
      this.context.lineWidth = width;
      this.context.strokeStyle = `rgba(${draw_color.red}, ${draw_color.green}, ${draw_color.blue}, 255)`;
      this.context.lineCap = 'round';
      this.context.stroke();
    },

    draw_line_bresenham: function(x0, y0, xf, yf, draw_color) {
      // Draw a raster line from (prevX, prevY) to (currX, currY) using Bresenham's line algorithm
      // https://en.wikipedia.org/wiki/Bresenham's_line_algorithm
      // http://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript

      var dx = Math.abs(xf - x0);
      var dy = Math.abs(yf - y0);
      var sx = (x0 < xf) ? 1 : -1;
      var sy = (y0 < yf) ? 1 : -1;
      var err = dx - dy;

      while(true){

        this.draw(x0, y0, draw_color);

        if ((x0==xf) && (y0==yf)) break;
        var e2 = 2*err;
        if (e2 >-dy) {
          err -= dy;
          x0 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y0 += sy;
        }
      }

    },

    drawCircle: function(x, y, radius, draw_color) {
      this.context.beginPath();
      this.context.arc(x, y, radius, 0, 2* Math.PI, false);
      this.context.fillStyle =  `rgba(${draw_color.red}, ${draw_color.green}, ${draw_color.blue}, 255)`;
      this.context.fill();

      // TODO: use this with bresenham's midpoint algorithm
      //var color = [draw_color.red, draw_color.green, draw_color.blue, 255];
      //var pixel = this.context.createImageData(radius, radius);
      //for (var i = 0; i < 4*radius*radius; i++) {
        //pixel.data[i] = color[i%4];
      //}
      // set the pixel to the draw_color
      //pixel.data[0] = draw_color.red;
      //pixel.data[1] = draw_color.green;
      //pixel.data[2] = draw_color.blue;
      // set alpha value for pixel to 255;
      //pixel.data[3] = 255;
      //this.context.putImageData(pixel, x - radius/2, y - radius/2);
    },

    clearCanvas: function() {
      this.saveCanvasToUndoStack();

      var new_canvas = this.context.createImageData(this.w, this.h);
      this.context.putImageData(new_canvas, 0, 0);
    },

    saveCanvas: function() {

      console.log("saving...");
      // TODO: GARRETT

    },

    saveCanvasToUndoStack: function() {
      // save canvas image data to undo_stack so we can undo to that state
      var undo_data = this.context.getImageData(0, 0, this.w, this.h);
      this.undo_stack.push(undo_data);

      // how many undos should we allow? 15? Is there a way to detect memory availability as our limit for undo?
      if (this.undo_stack.length > 15) {
        this.undo_stack.shift();
        // console.log("shift");
      }

      // reset redo stack
      this.redo_stack = [];
    },

    undoCanvas: function() {
      if (this.undo_stack.length == 0) {
        console.log("Nothing to undo!");
      } else {
        // save current canvas to redo stack, recall top of undo stack to canvas
        var redo_data = this.context.getImageData(0, 0, this.w, this.h);
        this.redo_stack.push(redo_data);

        var img_data = this.undo_stack.pop();
        this.context.putImageData(img_data, 0, 0);
      }

    },

    redoCanvas: function() {
      if (this.redo_stack.length == 0) {
        console.log("Nothing to redo!");
      } else {
        // save current canvas to undo stack, recall top of redo stack to canvas
        var undo_data = this.context.getImageData(0, 0, this.w, this.h);
        this.undo_stack.push(undo_data);
        var img_data = this.redo_stack.pop();
        this.context.putImageData(img_data, 0, 0);
      }

    }

  },

  watch: {
    blendMode: function() {
      this.context.globalCompositeOperation = this.blendMode;
    }
  },

  computed: {

  }
})
