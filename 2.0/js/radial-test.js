let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let numberOfParticles = 100;
let colors = ['rgb(255 227 126 / 100%)', 'rgb(255 227 126 / 75%)', 'rgb(255 227 126 / 50%)', 'rgb(255 227 126 / 25%)'];
let eases = ['Power0.easeOut', 'Power2.easeOut', 'Power3.easeOut'];
let particles = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xEnd = random(0, canvasWidth);
    this.yEnd = random(0, canvasHeight);
    this.color = colors[randomInt(0, colors.length - 1)];
    this.radius = random(6, 10);
    this.delay = random(0, 2);
    this.ease = eases[randomInt(0, eases.length - 1)];
  }
  
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.closePath();    
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function anime(p) {
  let tl = gsap.timeline()
            .to(p, {
                x: p.xEnd,
                y: p.yEnd,
                delay: p.delay,
                radius: 0,
                duration: 2,
                ease: p.ease,
                repeat: -1
            });
}

function createParticles(x, y) {
  for (let i = 0; i < numberOfParticles; i++) { 
    let particle = new Particle(x, y);
    particles.push(particle);
    anime(particle);
  }
}

createParticles(canvasWidth / 2, canvasHeight / 2);

gsap.ticker.add(function(){
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  for (let i = 0; i < numberOfParticles; i++) {
    particles[i].draw(ctx);
  }
})

function random(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}