let mic, fft, webcam;
let ball;
let bars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Set up microphone input
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  
  // Set up webcam input
  webcam = createCapture(VIDEO);
  webcam.size(windowWidth, windowHeight); // Set resolution to full screen
  webcam.hide(); // Hide the default video element
  
  // Initialize ball
  ball = new Ball();
}

function draw() {
  background(0);
  
  // Analyze sound input
  let spectrum = fft.analyze();
  let amplitude = fft.getEnergy("bass");
  let pitch = fft.getCentroid();
  
  // Draw inverted webcam feed with more noticeable color shifts based on amplitude
  push();
  translate(width, 0);
  scale(-1, 1);
  let colorShift = map(amplitude, 0, 255, 0, 150); // Make color shift more noticeable and only when there is sound
  if (amplitude > 0) {
    tint(255 + colorShift, 255 - colorShift, 255 + colorShift); // Apply color shift
  } else {
    noTint(); // No color shift when quiet
  }
  image(webcam, 0, 0, width, height);
  pop();
  
  // Draw sound bars
  bars = [];
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = map(spectrum[i], 0, 255, 0, height); // Make sound bars more sensitive
    bars.push(new Bar(x, height - h, 10, h));
    fill(0);
    noStroke();
    rect(x, height - h, 10, h);
  }
  
  // Draw ball and check collisions
  ball.update(pitch, amplitude);
  ball.checkCollisions(bars);
  ball.display();
  
  // Display instructions
  fill(255);
  textSize(20); // Make text slightly bigger
  textAlign(RIGHT, TOP);
  text("Use sound pitch to move the ball left and right.\nThe ball will bounce on black areas on camera!", width - 10, 10);
}

class Ball {
  constructor() {
    this.pos = createVector(width / 2, 0);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0.2); // Reduced gravity for slower fall
    this.r = 15; // Make the ball slightly bigger
    this.color = 255; // Default color
  }
  
  update(pitch, amplitude) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    
    // Move left or right based on pitch
    let move = map(pitch, 0, 5000, -5, 5); // Adjust range as needed
    this.pos.x += move;
    
    // Constrain position to canvas
    this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    
    // Check if the ball hits the bottom of the screen
    if (this.pos.y >= height - this.r) {
      this.vel.y = -abs(this.vel.y) * 0.8; // Increase bounce factor
      this.pos.y = height - this.r; // Ensure the ball stays within the canvas
    }
    
    // Make color change more noticeable
    this.color = map(amplitude, 0, 255, 0, 255);
  }
  
  checkCollisions(bars) {
    for (let bar of bars) {
      if (this.pos.x > bar.x && this.pos.x < bar.x + bar.w &&
          this.pos.y + this.r > bar.y && this.pos.y - this.r < bar.y + bar.h) {
        this.vel.y = -abs(this.vel.y) * 0.8; // Increase bounce factor when touching the sound bar
        this.pos.y = bar.y - this.r; // Adjust position to be just above the bar
      }
    }
    
    // Check collisions with black parts of the webcam feed only when falling
    if (this.vel.y > 0) {
      webcam.loadPixels();
      let index = (floor(this.pos.x) + floor(this.pos.y) * width) * 4;
      let r = webcam.pixels[index];
      let g = webcam.pixels[index + 1];
      let b = webcam.pixels[index + 2];
      if (r < 50 && g < 50 && b < 50) { // Only bounce off black and dark colors
        this.vel.x *= -1;
        this.vel.y *= -1;
      }
    }
  }
  
  display() {
    fill(this.color, 255 - this.color, 255); // Make color change more noticeable
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}