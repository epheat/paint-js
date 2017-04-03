<!-- epheat
CS 498 Group 3
Paint.js -->

<!-- https://codepo8.github.io/canvas-images-and-pixels/ -->
<!-- Caveat: every time you change the size of a canvas, it gets wiped.
This is great when you animate a canvas, but in simple plotting cases it gets annoying.
The good news is that if you paint beyond the size of a canvas there is no error -
it just doesn't show up. It is a forgiving API, but it expects you to do some calculation work beforehand. -->

<!-- http://exploringjs.com/es6/ch_template-literals.html#sec_introduction-template-literals -->

<template>
  <div id="canvas-container" ref="container">
    <!-- TODO: Use mouse button modifiers to detect right/left click? -->
    <!-- https://vuejs.org/v2/guide/events.html#Mouse-Button-Modifiers -->
    <canvas id="saved-canvas" ref="canvas" height="500px" width="500px" oncontextmenu="return false;"
      @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" @mouseout="mouseOut">
    </canvas>
    <canvas id="stroke-canvas" ref="strokecanvas" height="500px" width="500px" oncontextmenu="return false;"
      @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" @mouseout="mouseOut">
    </canvas>
    <div id="resizer-outline" :style="resizer_outline_style"></div>
    <a id="resizer" :style="resizer_positioning"
      @mousedown="beginResize" @mouseup="endResize">
    </a>
    <br>
    prevX: {{prevX}} prevY: {{prevY}}   currX: {{currX}} currY: {{currY}}
  </div>
</template>

<script>
export default {
  // props are local variables that receive changes from the parent element
  props: ['primaryColor', 'secondaryColor', 'tool', 'blendMode'],

  // data must be a function when using components, to keep local variables separate
  data: function() {
    return {
      saved_canvas: null,
      context: null,
      stroke_canvas: null,
      s_context: null,
      points: [],
      draw_flag: false,
      dot_flag: false,
      resize_flag: false,
      prevX: 0,
      currX: 0,
      prevY: 0,
      currY: 0,
      resize_w: 500,
      resize_h: 500,
      w: 500,
      h: 500,
      line_width: 2,

      undo_stack: [],
      redo_stack: []

    }
  },

  // basically, called once the page is initialized
  mounted: function() {

    this.saved_canvas = this.$refs.canvas;
    this.stroke_canvas = this.$refs.strokecanvas;
    this.context = this.saved_canvas.getContext("2d");
    this.s_context = this.stroke_canvas.getContext("2d");
    this.w = this.saved_canvas.width;
    this.h = this.saved_canvas.height;

    this.context.imageSmoothingEnabled = false;
    this.s_context.imageSmoothingEnabled = false;

  },

  // Component methods
  methods: {

    mouseDown: function(e) {

      // right before any changes, save the state of the canvas for undo
      this.saveCanvasToUndoStack();

      // start drawing - set draw style, etc.
      if (e.which == 1) {
        this.draw(this.currX, this.currY, this.primaryColor);
      } else {
        this.draw(this.currX, this.currY, this.secondaryColor);
      }

      // so that when we start moving the mouse, we'll know if we're drawing a line or not
      this.draw_flag = true;
      this.dot_flag = true;
    },
    mouseMove: function(e) {

      // update coordinates
      this.prevX = this.currX;
      this.prevY = this.currY;

      this.currX = e.pageX - this.$refs.container.offsetLeft;
      this.currY = e.pageY - this.$refs.container.offsetTop;

      if (this.draw_flag) {
        this.dot_flag = false;
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

      if (e.which == 1) {
        this.end_draw(this.currX, this.currY, this.primaryColor);
      } else {
        this.end_draw(this.currX, this.currY, this.secondaryColor);
      }

      this.points.length = 0;

      this.place_stroke_canvas();

    },
    mouseOut: function(e) {

      // TODO: detect mousemove even outside of the canvas, to allow greater drawing flexibility
      this.draw_flag = false;

      // this.place_stroke_canvas();

    },

    place_stroke_canvas: function() {
      this.context.drawImage(this.stroke_canvas, 0, 0);
      this.s_context.clearRect(0, 0, this.w, this.h);
    },

    draw: function(x, y, draw_color) {
      if (this.tool.name == "pencil") {
        // set color blending option
        this.context.globalCompositeOperation = this.blendMode;
        this.s_context.lineWidth = this.tool.properties.width;
        this.s_context.strokeStyle = `rgba(${draw_color.red}, ${draw_color.green}, ${draw_color.blue}, ${draw_color.alpha/255})`;

        this.s_context.fillStyle = `rgba(${draw_color.red}, ${draw_color.green}, ${draw_color.blue}, ${draw_color.alpha/255})`;
        this.s_context.lineCap = 'round';
        this.s_context.lineJoin = 'round';

        this.points.push({x: this.currX, y: this.currY});

      } else if (this.tool.name == "brush") {
        // set color blending option
        this.context.globalCompositeOperation = this.blendMode;
        this.points.push({x: this.currX, y: this.currY});
      } else if (this.tool.name == "eraser") {
        // set color blending option to normal
        this.context.globalCompositeOperation = "destination-out";
        this.drawCircle(x, y, this.tool.properties.width/2, {red: 255, green: 255, blue: 255, alpha: 255});
      } else if (this.tool.name == "bucket") {

      } else if (this.tool.name == "pen") {
        // set color blending option
        this.context.globalCompositeOperation = this.blendMode;
        this.s_context.fillStyle = `rgba(${draw_color.red}, ${draw_color.green}, ${draw_color.blue}, ${draw_color.alpha/255})`;

        this.push_pen_slice(x, y, this.tool.properties.width, this.tool.properties.angle);
      } else {

      }
    },

    draw_line: function(x0, y0, xf, yf, draw_color) {
      if (this.tool.name == "pencil") {
        this.points.push({x: xf, y: yf});

        this.render_points_array_pencil();

      } else if (this.tool.name == "brush") {

      } else if (this.tool.name == "eraser") {
        this.draw_line_builtin(x0, y0, xf, yf, this.tool.properties.width, {red: 255, green: 255, blue: 255, alpha: 255});
      } else if (this.tool.name == "bucket") {

      } else if (this.tool.name == "pen") {
        this.push_pen_slice(xf, yf, this.tool.properties.width, this.tool.properties.angle);
        this.render_points_array_pen();
      } else {

      }

    },

    end_draw: function(x, y, draw_color) {
      if (this.tool.name == "pencil") {
        if (this.dot_flag) {
          this.drawCircle(x, y, this.tool.properties.width/2, draw_color);
        }
      } else if (this.tool.name == "brush") {

      } else if (this.tool.name == "eraser") {

      } else if (this.tool.name == "bucket") {

      } else if (this.tool.name == "pen") {
        if (this.dot_flag) {
          this.draw_pen_slice(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y, this.tool.properties.width, this.tool.properties.angle, draw_color);
        }
      } else {

      }
    },

    render_points_array_pencil: function() {
      this.s_context.clearRect(0, 0, this.w, this.h);

      this.s_context.beginPath();
      this.s_context.moveTo(this.points[0].x, this.points[0].y);
      for (var i=1; i<this.points.length; i++) {
        this.s_context.lineTo(this.points[i].x, this.points[i].y);
      }
      this.s_context.stroke();
    },

    render_points_array_pen: function() {
      this.s_context.clearRect(0, 0, this.w, this.h);

      this.s_context.beginPath();
      this.s_context.moveTo(this.points[0].x, this.points[0].y);
      for (var i=2; i<this.points.length; i+=2) {
        this.s_context.lineTo(this.points[i].x, this.points[i].y);
      }
      for (var i=this.points.length-1; i>=0; i-=2) {
        this.s_context.lineTo(this.points[i].x, this.points[i].y);
      }
      this.s_context.fill('nonzero');
    },

    draw_line_builtin: function(x0, y0, xf, yf, width, draw_color) {
      this.context.beginPath();
      this.context.moveTo(x0, y0);
      this.context.lineTo(xf, yf);
      this.context.lineWidth = width;
      this.context.strokeStyle = `rgba(${draw_color.red}, ${draw_color.green}, ${draw_color.blue}, ${draw_color.alpha/255})`; // http://exploringjs.com/es6/ch_template-literals.html#sec_introduction-template-literals
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
      this.s_context.fillStyle = `rgba(${draw_color.red}, ${draw_color.green}, ${draw_color.blue}, ${draw_color.alpha/255})`;
      this.s_context.beginPath();
      this.s_context.arc(x, y, radius, 0, 2* Math.PI, false);
      this.s_context.fill();
    },

    push_pen_slice: function(x, y, width, angle) {
      var rad_angle = angle * Math.PI / 100;
      var x0 = x - width/2 * Math.cos(rad_angle);
      var y0 = y - width/2 * Math.sin(rad_angle);
      var xf = x + width/2 * Math.cos(rad_angle);
      var yf = y + width/2 * Math.sin(rad_angle);
      this.points.push({x: x0, y: y0});
      this.points.push({x: xf, y: yf});
    },

    draw_pen_slice: function(x0, y0, xf, yf, width, angle, draw_color) {
      this.s_context.beginPath();
      this.s_context.moveTo(x0, y0);
      this.s_context.lineTo(xf, yf);
      this.s_context.lineWidth = 2;
      this.s_context.strokeStyle = `rgba(${draw_color.red}, ${draw_color.green}, ${draw_color.blue}, ${draw_color.alpha/255})`; // http://exploringjs.com/es6/ch_template-literals.html#sec_introduction-template-literals

      this.s_context.stroke();
    },

    draw_pen_point: function(x, y, width, angle, draw_color) {
      var rad_angle = angle * Math.PI / 100;
      var x0 = x - width/2 * Math.cos(rad_angle);
      var y0 = y - width/2 * Math.sin(rad_angle);
      var xf = x + width/2 * Math.cos(rad_angle);
      var yf = y + width/2 * Math.sin(rad_angle);
      this.context.beginPath();
      this.context.moveTo(x0, y0);
      this.context.lineTo(xf, yf);
      this.context.lineWidth = 2;
      this.context.strokeStyle = `rgba(${draw_color.red}, ${draw_color.green}, ${draw_color.blue}, ${draw_color.alpha/255})`; // http://exploringjs.com/es6/ch_template-literals.html#sec_introduction-template-literals

      this.context.stroke();
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
        this.undo_stack.shift(); // https://www.w3schools.com/jsref/jsref_shift.asp
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

        // if the canvas is a different size on the undo stack, resize the current canvas to fit
        if (img_data.width != this.w && img_data.height != this.h) {
          this.setCanvasDimensions(img_data.width, img_data.height);
        }
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

        // if the canvas is a different size on the redo stack, resize the current canvas to fit
        if (img_data.width != this.w && img_data.height != this.h) {
          this.setCanvasDimensions(img_data.width, img_data.height);
        }
        this.context.putImageData(img_data, 0, 0);
      }

    },

    // helper functions to manage canvas resizing
    beginResize: function() {
      this.resize_flag = true;
    },
    continueResize: function(e) {
      if (this.resize_flag) {

        // adjust resizer_outline width and height
        this.resize_w = e.pageX - this.$refs.container.offsetLeft;
        this.resize_h = e.pageY - this.$refs.container.offsetTop;

      }
    },
    endResize: function() {
      this.resize_flag = false;
      // save canvas content
      var img_data = this.context.getImageData(0, 0, this.w, this.h);
      this.saveCanvasToUndoStack();
      // adjust canvas width and height
      this.h = this.resize_h;
      this.w = this.resize_w;

      // manually change canvas size according to h and w
      // if I v-bind h and w to canvas height and width, then it's bugged.
      // the binding doesn't update till the function exits, meaning I can't replace the canvas data after the resize.
      this.setCanvasDimensions(this.w, this.h);

      // paste canvas content
      this.context.putImageData(img_data, 0, 0);
    },

    // set current canvas dimension variables to w, h
    setCanvasDimensions: function(w, h) {
      this.resize_w = w;
      this.resize_h = h;
      this.w = w;
      this.h = h;
      this.saved_canvas.width = w;
      this.saved_canvas.height = h;
      this.stroke_canvas.width = w;
      this.stroke_canvas.height = h;
    }

  },

  computed: {
    resizer_positioning: function() {
      return {
        top: `${this.resize_h - 4}px`,
        left: `${this.resize_w - 4}px`
      }
    },
    resizer_outline_style: function() {
      if (this.resize_flag) {
        return {
          outline: "1px dotted",
          height: `${this.resize_h}px`,
          width: `${this.resize_w}px`,
        }
      }
    }
  }
}
</script>

<style>
#saved-canvas {
  background-color: white;
  cursor: crosshair;
  box-shadow: 0px 0px 0px 1px #000000 inset;
}
#stroke-canvas {
  position: absolute;
  top: 0px;
  left: 0px;
  cursor: crosshair;
}
#canvas-container {
  position: relative;
}

#resizer-outline {
  position: absolute;
  top: 0px;
  left: 0px;
  display: inline-block;
}
#resizer {
  position: absolute;
  display: inline-block;
  height: 7px;
  width: 7px;
  border: 1px solid;
  background-color: white;
}

</style>
