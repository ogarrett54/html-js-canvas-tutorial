let canvas;
let ctx;
let flowField;
let flowFieldAnimation;

// Wait for the window to load all elements before grabbing them and setting the canvas dimensions
window.onload = function () {
  canvas = document.getElementById("canvas1");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowField.animate(0);
};

window.addEventListener("resize", function () {
  cancelAnimationFrame(flowFieldAnimation);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  flowField.animate(0);
});

const mouse = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

class FlowFieldEffect {
  // these are private class features. they can't be changed from outside of the class
  #ctx;
  #width;
  #height;
  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#ctx.lineWidth = 1;
    this.#width = width;
    this.#height = height;
    this.lastTime = 0;
    this.interval = 1000 / 60;
    this.timer = 0;
    this.cellSize = 8;
    this.gradient;
    this.#createGradient();
    this.#ctx.strokeStyle = this.gradient;
    this.radius = 0;
    this.vr = 0.01;
    this.noise = new Noise(Math.random());
  }
  #createGradient() {
    this.gradient = this.#ctx.createLinearGradient(
      0,
      0,
      this.#width,
      this.#height
    );
    this.gradient.addColorStop("0.1", "#ff5c33");
    this.gradient.addColorStop("0.2", "#ff66b3");
    this.gradient.addColorStop("0.4", "#ccccff");
    this.gradient.addColorStop("0.6", "#b3ffff");
    this.gradient.addColorStop("0.8", "#80ff80");
    this.gradient.addColorStop("0.9", "#ffff33");
  }
  #drawLine(angle, x, y) {
    //let positionX = x;
    //let positionY = y;
    //let dx = mouse.x - positionX;
    //let dy = mouse.y - positionY;
    //let distance = dx ** 2 + dy ** 2;
    //if (distance > 600000) distance = 600000;
    //else if (distance < 50000) distance = 50000;
    //let length = distance * 0.0001;

    let length = 14;
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(
      x + Math.cos(angle) * length,
      y + Math.sin(angle) * length
    );
    this.#ctx.stroke();
  }

  animate(timeStamp) {
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    if (this.timer > this.interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height);
      //this.radius = mouse.x * this.vr + mouse.y * this.vr;
      this.radius += this.vr;
      //if (this.radius > 5 || this.radius < -5) this.vr *= -1;

      for (let y = 0; y < this.#height; y += this.cellSize) {
        for (let x = 0; x < this.#width; x += this.cellSize) {
          let positionX = x;
          let positionY = y;
          let dx = mouse.x - positionX;
          let dy = mouse.y - positionY;
          let mouseDistance = 0.000005 * (dx * dx + dy * dy);
          const angle =
            //(Math.cos(x * 0.00001 * mouseDistance) + Math.sin(y * 0.00001 * mouseDistance)) * this.radius;
            this.noise.perlin3(
              x * 0.006,
              y * 0.006,
              this.radius + mouseDistance
            ) *
            Math.PI *
            2;
          this.#drawLine(angle, x, y);
        }
      }

      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }

    flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}
