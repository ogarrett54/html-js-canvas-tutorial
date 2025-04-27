const canvas = document.getElementById("canvas1"); // selects the canvas html tag
const ctx = canvas.getContext("2d"); // uses html tag to select the canvas 2d rendering object, which has lots of different properties and methods used for drawing in the canvas

// normalize canvas dimensions so that dimensions act more intuitively
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// renormalize canvas dimensions and redraw rectangle when you resize the window
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// make a structure to hold newly generated particles
const particlesArray = [];

// fillStyle can be used to change the fill color
//ctx.fillStyle = "white";

// fillRect can be used to draw a filled rectangle
// it takes x, y coordinates of top left point,
// along with h and w lengths.
//ctx.fillRect(175, 160, 50, 50);

// to draw a circle, you have to begin a path (like telling
// the canvas you're placing your paint brush down), define
// the arc with center coordinates, radius, start point and
// end point (in radians), then fill it after.
//ctx.beginPath();
//ctx.arc(100, 100, 50, 0, Math.PI * 2);
//ctx.fill();
//
//// you can also draw strokes rather than filled shapes
//ctx.strokeStyle = "white";
//ctx.lineWidth = 5;
//ctx.beginPath();
//ctx.arc(300, 100, 50, 0, Math.PI * 2);
//ctx.stroke();
//
//// and of course you can draw partial arcs
//ctx.beginPath();
//ctx.arc(200, 250, 100, 0, Math.PI);
//ctx.stroke();
//

// to add interactivity
// define a mouse object for global accessibility
const mouse = {
  x: undefined,
  y: undefined,
};

// add an event listenter to update the global mouse
// object with the x, y coordinates of a click, then
// have it draw a circle.
canvas.addEventListener("click", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  //drawCircle();
});

// more convenient to bundle drawing circles into a
// function
function drawCircle() {
  ctx.fillStyle = "white";
  ctx.beginPath();
  // draw a circle centered at where you clicked, which
  // was updated above
  ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2);
  ctx.fill();
}

// if you link the draw circle to mousemove as well, you've
// got yourself a paintbrush

canvas.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  //drawCircle();
});

class Particle {
  constructor() {
    //this.x = mouse.x;
    //this.y = mouse.y;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  for (let i = 0; i < 100; i++) {
    particlesArray.push(new Particle());
  }
}

init();
console.log(particlesArray);

function handleParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
}

// making an animation
function animate() {
  // first, clear the whole canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handleParticles();

  // call the animate function again, creating a loop
  requestAnimationFrame(animate);
}

animate();
