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

// create a variable to store the hue
let hue = 0;

// to add interactivity
// define a mouse object for global accessibility
const mouse = {
  x: undefined,
  y: undefined,
};

// add an event listenter to update the global mouse
// object with the x, y coordinates of a click
canvas.addEventListener("click", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  generateParticles(5);
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

function generateParticles(n) {
  for (let i = 0; i < n; i++) particlesArray.push(new Particle());
}

function handleMouseMove() {
  mouse.x = event.x;
  mouse.y = event.y;
  generateParticles(5);
}

function throttle(callback, limit) {
  var tick = false;
  return function () {
    if (!tick) {
      callback.call();
      tick = true;
      setTimeout(function () {
        tick = false;
      }, limit);
    }
  };
}

canvas.addEventListener("mousemove", throttle(handleMouseMove, 1000 / 20));

class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 10 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.03;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function handleParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
    for (let j = i; j < particlesArray.length; j++) {
      const dx = particlesArray[j].x - particlesArray[i].x;
      const dy = particlesArray[j].y - particlesArray[i].y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2);
      if (distance < 100) {
        ctx.strokeStyle = particlesArray[i].color;
        ctx.lineWidth = particlesArray[i].size / 10;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
        ctx.closePath();
      }
    }

    if (particlesArray[i].size < 0.3) {
      particlesArray.splice(i, 1);
      i--;
    }
  }
}

// making an animation
function animate() {
  //// first, clear the whole canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fade out the canvas to give particles trails
  //ctx.fillStyle = 'rgba(0,0,0,0.01)'
  //ctx.fillRect(0,0, canvas.width, canvas.height);

  handleParticles();

  hue += 0.5;

  // call the animate function again, creating a loop
  requestAnimationFrame(animate);
}

animate();
