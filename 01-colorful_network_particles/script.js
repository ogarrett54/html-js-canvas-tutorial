// Parameters
const N_PARTICLES = 5;
const MAX_SIZE = 10;
const MAX_SPEED = 1;
const DECAY_RATE = 0.02;
const TRAILS = false;
const TRAIL_FADE = 0.075;
const THROTTLE_GEN_PER_SEC = 20;

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
const particlesArray = [];
let hue = 0;

const mouse = {
  x: undefined,
  y: undefined,
};

canvas.height = window.innerHeight;
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * MAX_SIZE + 1;
    this.speedX = Math.random() * MAX_SPEED - MAX_SPEED / 2;
    this.speedY = Math.random() * MAX_SPEED - MAX_SPEED / 2;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= DECAY_RATE;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function generateParticles(n) {
  for (let i = 0; i < n; i++) particlesArray.push(new Particle());
}

canvas.addEventListener("click", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  generateParticles(N_PARTICLES);
});

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

canvas.addEventListener(
  "mousemove",
  throttle(handleMouseMove, 1000 / THROTTLE_GEN_PER_SEC)
);

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
        ctx.lineWidth = particlesArray[i].size / 8;
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

function animate() {
  if (!TRAILS) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (TRAILS) {
    // fade out the canvas to give particles trails
    ctx.fillStyle = `rgba(0,0,0,${TRAIL_FADE})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  handleParticles();
  hue += 0.5;
  requestAnimationFrame(animate);
}

animate();
