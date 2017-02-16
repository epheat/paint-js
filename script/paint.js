// Evan Heaton, Bertil Johnson, Garrett Kearns, Corey Kirkpatrick
// CS498 - Group 3
// paint.js

// Much of this code was laid out with the help of this page: http://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse

var canvas, context,
  draw_flag = false,
  dot_flag = false;
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  primary_color = "red",
  secondary_color = "blue",
  selected_color = 0, //selected_color=0 means primary is selected, selected_color=1 means secondary is selected
  line_width = 1;

// init function links to canvas and sets up event listeners
function init() {
  initCanvas();
  initTab();
}

function initCanvas() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  w = canvas.width;
  h = canvas.height;

  canvas.addEventListener("mousemove", function (e) {
    findxy('move', e)
  }, false);
  canvas.addEventListener("mousedown", function (e) {
    findxy('down', e)
  }, false);
  canvas.addEventListener("mouseup", function (e) {
    findxy('up', e)
  }, false);
  canvas.addEventListener("mouseout", function (e) {
    findxy('out', e)
  }, false);
}

function initTab() {
  document.getElementById("default-open").click();
}

function findxy(res, e) {
  if (res == 'down') {
    prevX = currX;
    prevY = currY;

    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;

    draw_flag = true;
    dot_flag = true;
  }
  if (res == 'up' || res == "out") {
    draw_flag = false;
    if (dot_flag) {

      // for left click, draw with primary. Right click, draw with secondary
      if (e.which == 1) {
        draw_dot(primary_color);
      } else {
        draw_dot(secondary_color);
      }

      dot_flag = false;
    }
  }
  if (res == 'move') {
    dot_flag = false;
    if (draw_flag) {
      prevX = currX;
      prevY = currY;

      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;

      // for left click, draw with primary. Right click, draw with secondary
      if (e.which == 1) {
        draw_line(primary_color);
      } else {
        draw_line(secondary_color);
      }

    }
  }
}
function draw_dot(draw_color) {
  context.beginPath();
  context.fillStyle = draw_color;
  context.fillRect(currX, currY, 2, 2);
  context.closePath();
}

function draw_line(draw_color) {
  context.beginPath();
  context.moveTo(prevX, prevY);
  context.lineTo(currX, currY);
  context.strokeStyle = draw_color;
  context.lineWidth = line_width;
  context.stroke();
  context.closePath();
}

// color switching functionality

function selectColor(evt, color_type)
{
  // update color box styles
  var primary = document.getElementById("primary-color");
  var secondary = document.getElementById("secondary-color");
  primary.className = primary.className.replace(" selected", "");
  secondary.className = secondary.className.replace(" selected", "");

  var currentTarget = evt.currentTarget;

  currentTarget.className += " selected";

  // update selected_color variable
  if (currentTarget.id == "primary-color") {
    selected_color = 0;
  } else if (currentTarget.id == "secondary-color") {
    selected_color = 1;
  }

}
