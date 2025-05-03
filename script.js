const NETWORKS = false;

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numParticles = 500;
let particlesArray = [];

// set up text as an object
let titleElement = document.getElementById("title1");
let titleMeasurements = titleElement.getBoundingClientRect();
let title = {
  x: titleMeasurements.left,
  y: titleMeasurements.top,
  width: titleMeasurements.width,
  height: titleMeasurements.height - 90,
};

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = "aquamarine";
    this.size = Math.random() * 3;
    this.weight = Math.random() * 1 + 1;
    this.directionX = Math.random() * 2 - 1;
  }

  update() {
    if (this.y > canvas.height) {
      this.y = 0 - this.size;
      this.x = Math.random() * canvas.width * 1.5;
      this.weight = 2;
    }
    this.y += this.weight;
    this.x += this.directionX;
    this.weight += 0.01;

    if (
      this.x < title.x + title.width &&
      this.x + this.size > title.x &&
      this.y < title.y + title.height &&
      this.y + this.size > title.y
    ) {
      this.y -= 3;
      this.weight *= -0.5;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
  }
}

function init(nParticles) {
  for (let i = 0; i < nParticles; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    particlesArray.push(new Particle(x, y));
  }
}

init(numParticles);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
    if (NETWORKS) {
      for (let j = i; j < particlesArray.length; j++) {
        const dx = particlesArray[j].x - particlesArray[i].x;
        const dy = particlesArray[j].y - particlesArray[i].y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance < 50) {
          ctx.strokeStyle = "white";
          ctx.lineWidth = particlesArray[i].size / 8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  titleMeasurements = titleElement.getBoundingClientRect();
  title = {
    x: titleMeasurements.left,
    y: titleMeasurements.top,
    width: titleMeasurements.width,
    height: titleMeasurements.height - 90,
  };
  init();
});
