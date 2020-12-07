import "./styles.css";
import { saveAs } from "file-saver";
// import { pointsAlongLine } from "./vector.js";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d", {});

let canvasBg = document.getElementById("canvasBg");
let ctxBg = canvasBg.getContext("2d", {});

let pixelRatio = 2.2;
canvas.width = window.innerWidth * pixelRatio;
canvas.height = window.innerHeight * pixelRatio;
canvasBg.width = window.innerWidth * pixelRatio;
canvasBg.height = window.innerHeight * pixelRatio;

let pieces = 8;
let penDown = false;
let buttonState = 1;
let last_x = 0;
let last_y = 0;

let noodlesButton = document.getElementById("noodles");
let eggsButton = document.getElementById("eggs");
let scallionsButton = document.getElementById("scallions");
let cornButton = document.getElementById("corn");
let resetButton = document.getElementById("reset");
let saveButton = document.getElementById("save");
let undoButton = document.getElementById("undo");
let backgroundsButton = document.getElementById("backgrounds");

let bg01 = new Image();
bg01.crossOrigin = "anonymous";
bg01.src = require("../img/table-01-land.jpg");
bg01.onload = render;

let bg02 = new Image();
bg02.crossOrigin = "anonymous";
bg02.src = require("../img/table-02-land.jpg");

let bg03 = new Image();
bg03.crossOrigin = "anonymous";
bg03.src = require("../img/table-03-land.jpg");

let currentBg = [bg01, bg02, bg03];
let bgCount = 0;

ctxBg.fillStyle = "#ffffff";
ctxBg.fillRect(0, 0, canvas.width, canvas.height);

function bgSelected() {
  bgCount = (bgCount + 1) % 3;
  render();
}

let undoStack = [];
pushState();
function pushState() {
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

  if (undoStack.length > 50) {
    undoStack.shift();
  }
}
undoButton.addEventListener("click", function () {
  if (undoStack.length > 1) {
    undoStack.pop();
  }
  let lastElement = undoStack[undoStack.length - 1];
  ctx.putImageData(lastElement, 0, 0);
});

function merge() {
  ctxBg.drawImage(canvas, 0, 0, canvas.width, canvas.height);
}

saveButton.addEventListener("click", () => {
  merge();
  canvasBg.toBlob(function (blob) {
    console.log(blob);
    saveAs(blob, "RamenKaleidoscope.png");
  });
});

function resetButtonStyles() {
  Array.from(document.getElementsByClassName("brush-button")).forEach(
    (button) => {
      button.classList.remove("active");
      button.style.borderWidth = "1px";
    }
  );
}

function activeBtn(ele) {
  ele.classList.add("active");
  Array.from(document.getElementsByClassName("active")).forEach((activeBtn) => {
    activeBtn.style.borderWidth = "3px";
  });
}

function paintStart(x, y) {
  penDown = true;
  last_x = x;
  last_y = y;
}

function norm_random(size) {
  return (Math.random() - 0.5) * size;
}

function paintMove(x, y) {
  ctx.beginPath();
  let thickness = 2;
  ctx.lineWidth = thickness;
  ctx.stroke();

  ctx.fillStyle = `hsla(60, 100%, 50%)`;
  ctx.strokeStyle = `hsla(60, 100%, 50%)`;

  for (var a = 0; a < 360; a += 360 / pieces) {
    ctx.translate(canvas.width / 2, canvas.height / 2); //translate origin
    ctx.rotate((Math.PI / 180) * a); //rotate the image around origin
    ctx.translate(-canvas.width / 2, -canvas.height / 2); //translate back

    for (var i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x, y, 130, -0.9 * Math.PI, -0.1 * Math.PI);
      ctx.stroke();
    }

    //reset translation & rotation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  last_x = x;
  last_y = y;
}

function paintMove2(x, y) {
  for (var a = 0; a < 360; a += 360 / pieces) {
    ctx.translate(canvas.width / 2, canvas.height / 2); //translate origin
    ctx.rotate((Math.PI / 180) * a); //rotate the image around origin
    ctx.translate(-canvas.width / 2, -canvas.height / 2); //translate back

    ctx.strokeStyle = `hsla(39, 100%, 50%)`;
    //egg white
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.ellipse(
      (last_x + x) / 2,
      (last_y + y) / 2,
      50,
      75,
      Math.PI / 4,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();

    //yolk
    ctx.beginPath();
    ctx.fillStyle = "#ffd300";
    let r = 30;
    ctx.arc(last_x - 20, last_y + 20, r, 0, Math.PI * 2);
    ctx.fill();

    //reset translation & rotation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  last_x = x;
  last_y = y;
}

function paintMove3(x, y) {
  ctx.fillStyle = `hsl(120,100%,50%)`;
  ctx.strokeStyle = `hsla(147, 50%, 47%)`;

  for (var a = 0; a < 360; a += 360 / pieces) {
    ctx.translate(canvas.width / 2, canvas.height / 2); //translate origin
    ctx.rotate((Math.PI / 180) * a); //rotate the image around origin
    ctx.translate(-canvas.width / 2, -canvas.height / 2); //translate back // draw rectangles
    ctx.beginPath();
    let thickness = 1;
    ctx.lineWidth = thickness; // ctx.moveTo(last_x, last_y);
    ctx.stroke();
    let randomness = 30;
    for (var i = 0; i < 1; i++) {
      ctx.beginPath();
      ctx.rect(
        x + norm_random(randomness),
        y + norm_random(randomness),
        norm_random(randomness),
        norm_random(randomness)
      );
      ctx.fill();
      ctx.stroke(); // last_x = x; // last_y = y;
    } //reset translation & rotation

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  last_x = x;
  last_y = y;
}

function paintMove4(x, y) {
  ctx.fillStyle = `hsl(53, 100%, 50%)`;
  ctx.strokeStyle = `hsla(147, 50%, 47%)`;

  for (var a = 0; a < 360; a += 360 / pieces) {
    ctx.translate(canvas.width / 2, canvas.height / 2); //translate origin
    ctx.rotate((Math.PI / 180) * a); //rotate the image around origin
    ctx.translate(-canvas.width / 2, -canvas.height / 2); //translate back // draw circles

    ctx.beginPath();
    let thickness = 1;
    ctx.lineWidth = thickness;
    ctx.stroke();
    let randomness = 10;
    ctx.beginPath();
    ctx.arc(
      x + norm_random(randomness),
      y + norm_random(randomness),
      (Math.random() * (1 - 0.7) + 1) * 4,
      0,
      2 * Math.PI
    );
    ctx.fill(); //reset translation & rotation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  last_x = x;
  last_y = y;
}

function paintEnd(x, y) {
  pushState();
}

canvas.addEventListener("mousedown", function (evt) {
  let x = evt.clientX * pixelRatio;
  let y = evt.clientY * pixelRatio;
  paintStart(x, y);
});

canvas.addEventListener("touchstart", function (evt) {
  let touches = Array.from(evt.touches);
  let touch = touches[0];
  let x = touch.clientX * pixelRatio;
  let y = touch.clientY * pixelRatio;
  paintStart(x, y);

  last_x = x;
  last_y = y;
});

canvas.addEventListener("mousemove", function (evt) {
  if (penDown === false) {
    return;
  }

  let x = evt.clientX * pixelRatio;
  let y = evt.clientY * pixelRatio;

  if (buttonState === 1) {
    paintMove(x, y);
  } else if (buttonState === 2) {
    paintMove2(x, y);
  } else if (buttonState === 3) {
    paintMove3(x, y);
  } else if (buttonState === 4) {
    paintMove4(x, y);
  }
});

canvas.addEventListener("touchmove", function (evt) {
  evt.preventDefault();

  let touches = Array.from(evt.touches);
  let touch = touches[0];

  let x = touch.clientX * pixelRatio;
  let y = touch.clientY * pixelRatio;

  if (buttonState === 1) {
    paintMove(x, y);
  } else if (buttonState === 2) {
    paintMove2(x, y);
  } else if (buttonState === 3) {
    paintMove3(x, y);
  } else if (buttonState === 4) {
    paintMove4(x, y);
  }
});

canvas.addEventListener("touchend", function (evt) {
  let x = last_x;
  let y = last_y;
  paintEnd(x, y);
});

canvas.addEventListener("mouseout", function (evt) {
  penDown = false;
});
canvas.addEventListener("mouseup", function (evt) {
  penDown = false;
  let x = evt.clientX;
  let y = evt.clientY;
  paintEnd(x, y);
});

noodlesButton.addEventListener("click", () => {
  buttonState = 1;
  resetButtonStyles();
  activeBtn(noodlesButton);
});

eggsButton.addEventListener("click", () => {
  buttonState = 2;
  resetButtonStyles();
  activeBtn(eggsButton);
});

scallionsButton.addEventListener("click", () => {
  buttonState = 3;
  resetButtonStyles();
  activeBtn(scallionsButton);
});

cornButton.addEventListener("click", () => {
  buttonState = 4;
  resetButtonStyles();
  activeBtn(cornButton);
});

resetButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resetButtonStyles();
});

backgroundsButton.addEventListener("click", bgSelected);

function render() {
  ctxBg.drawImage(currentBg[bgCount], 0, 0, canvasBg.width, canvasBg.height);
}
