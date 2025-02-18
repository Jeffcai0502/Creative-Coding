let mic, fft, webcam;
let ball;
let bars = [];

function setup() {
  createCanvas(800, 600);
  
  // Set up microphone input
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  
  // Set up webcam input
  webcam = createCapture(VIDEO);
  webcam.size(width, height);
  webcam.hide(); // Hide the default video element
  
  // Initialize ball
  ball = new Ball();
}

function draw() {
  background(0);
  
  // Draw webcam feed
  image(webcam, 0, 0, width, height);
  
  // Analyze sound input
  let spectrum = fft.analyze();
  let pitch = fft.getCentroid();
  
  // Draw sound bars
  bars = [];
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = map(spectrum[i], 0, 255, 0, height / 2);
    bars.push(new Bar(x, height - h, 10, h));
    fill(0);
    noStroke();
    rect(x, height - h, 10, h);
  }
  
  // Draw ball and check collisions
  ball.update(pitch);
  ball.checkEdges();
  ball.checkCollisions(bars);
  ball.display();
}

class Ball {
  constructor() {
    this.pos = createVector(width / 2, 0);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0.5); // Gravity
    this.r = 10;
  }
  
  update(pitch) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    // Move left or right based on pitch
    let move = map(pitch, 0, 5000, -5, 5); // Adjust range as needed
    this.pos.x += move;
    
    // Constrain position to canvas
    this.pos.x = constrain(this.pos.x, this.r, width - this.r);
  }
  
  checkEdges() {
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y *= -0.5; // Bounce back with damping
    }
  }
  
  checkCollisions(bars) {
    for (let bar of bars) {
      if (this.pos.x > bar.x && this.pos.x < bar.x + bar.w &&
          this.pos.y > bar.y && this.pos.y < bar.y + bar.h) {
        this.vel.y *= -1;
      }
    }
    
    // Check collisions with black and grey parts of the webcam feed
    webcam.loadPixels();
    let index = (floor(this.pos.x) + floor(this.pos.y) * width) * 4;
    let r = webcam.pixels[index];
    let g = webcam.pixels[index + 1];
    let b = webcam.pixels[index + 2];
    if ((r < 50 && g < 50 && b < 50) || (r > 100 && r < 150 && g > 100 && g < 150 && b > 100 && b < 150)) {
      this.vel.x *= -1;
      this.vel.y *= -1;
    }
  }
  
  display() {
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}

class Bar {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}