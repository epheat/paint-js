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
  color = "black",
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
      draw_dot();
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
      draw();
    }
  }
}
function draw_dot() {
  context.beginPath();
  context.fillStyle = color;
  context.fillRect(currX, currY, 2, 2);
  context.closePath();
}

function draw() {
  context.beginPath();
  context.moveTo(prevX, prevY);
  context.lineTo(currX, currY);
  context.strokeStyle = color;
  context.lineWidth = line_width;
  context.stroke();
  context.closePath();
}
