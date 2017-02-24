// paint-js-canvas is a component that draws on a canvas according to primary/secondary colors and the current tool
Vue.component('paint-js-canvas', {
  template: `<canvas id="canvas" ref="canvas" height="400px" width="400px" oncontextmenu="return false;" @mousedown="mouseDown" @mousemove="mouseMove" @mouseup="mouseUp" @mouseout="mouseOut"></canvas>`,

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

      imgData: []

    }
  },

  // basically, called once the page is initialized
  mounted: function() {
    this.canvas = this.$refs.canvas;
    this.context = this.canvas.getContext("2d");
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  },

  methods: {

    mouseDown: function(e) {
      this.prevX = this.currX;
      this.prevY = this.currY;

      this.currX = e.clientX - this.canvas.offsetLeft;
      this.currY = e.clientY - this.canvas.offsetTop;

      this.draw_flag = true;
      this.dot_flag = true;
    },
    mouseMove: function(e) {
      this.dot_flag = false;
      if (this.draw_flag) {
        this.prevX = this.currX;
        this.prevY = this.currY;

        this.currX = e.clientX - this.canvas.offsetLeft;
        this.currY = e.clientY - this.canvas.offsetTop;

        // for left click, draw with primary. Right click, draw with secondary
        if (e.which == 1) {
          this.draw_line(this.primaryColorStyle);
        } else {
          this.draw_line(this.secondaryColorStyle);
        }

      }
    },
    mouseUp: function(e) {
      this.draw_flag = false;
      if (this.dot_flag) {

        // for left click, draw with primary. Right click, draw with secondary
        if (e.which == 1) {
          this.draw_dot(this.primaryColorStyle);
        } else {
          this.draw_dot(this.secondaryColorStyle);
        }

        this.dot_flag = false;
      }
    },
    mouseOut: function(e) {
      this.draw_flag = false;
    },

    draw_dot: function(draw_color) {
      this.context.beginPath();
      this.context.fillStyle = draw_color;
      this.context.arc(this.currX, this.currY, 2, 0, 2*Math.PI);
      this.context.fill();
      this.context.closePath();
    },

    draw_line: function(draw_color) {
      this.context.beginPath();
      this.context.moveTo(this.prevX, this.prevY);
      this.context.lineTo(this.currX, this.currY);
      this.context.strokeStyle = draw_color;
      this.context.lineWidth = this.line_width;
      this.context.stroke();
      this.context.closePath();
    }



  },
  computed: {

  }
})
