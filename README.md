# Creative-Coding
### URL: 
### Chosen Theme: Interactivity

## Interactivity with real time video and sound
After brainstorming on the workbook. I want something that can have a connection with the audience. More than click and drag. I am thinking about using real time "video and sound". This idea is derived the music visualiszer. Music isn’t accessible all the time. Sound would be fine.

## Incorporating video and sound to create a connection with the audience. 
Create an interactive experience where users can manipulate the art using video and sound in real-time. 

### Capture Sound Input:

Use the ```p5.AudioIn()``` function to capture sound input from the microphone.

Analyze the sound input using the ```p5.FFT()``` function to get frequency and amplitude data.

```
let mic, fft;

function setup() {
  createCanvas(800, 600);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background(0);
  let spectrum = fft.analyze();
  // Use spectrum data to create visual effects
}
```
### Load and Manipulate  real time Video:
Use the ```createVideo()``` function to load a video file.

Use the ```createCapture()``` function to access the webcam(real time).

Using the webcam instead of a pre-recorded video makes it project even more interactive. 

Hide the default video element to draw it on the canvas.

Implement controls for playback, speed, and direction using mouse and keyboard events.

## A basic audio frequency and amplitude spectrum animation combining real time Video:
<img width="795" alt="截屏2025-02-18 上午10 01 41" src="https://github.com/user-attachments/assets/50b931fc-5ffb-4cfa-8025-6073928d60be" />

```
let mic, fft, webcam;

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
}

function draw() {
  background(0);
  
  // Analyze sound input
  let spectrum = fft.analyze();
  
  // Draw webcam feed
  image(webcam, 0, 0, width, height);
  
  // Apply visual effects based on sound input
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }
}

```
The ```createCapture(VIDEO)``` function accesses the webcam and sets its size to match the canvas. 

The ```webcam.hide()``` function hides the default video element so you can draw it on the canvas using the ```image()``` function.

```The fft.analyze()``` function analyzes the sound input from the microphone, and the spectrum data is used to create visual effects.

The ```image(webcam, 0, 0, width, height)``` function draws the webcam feed on the canvas. The for loop creates rectangles based on the sound spectrum data, adding an interactive visual effect.

The canvas isn't full screen yet, i will make it fit the maximum size of the browser soon.
## Exploring with possiblities
### Color Shifts Based on Amplitude
Change the colors of the webcam feed based on the amplitude of the sound.

Implementation: Use the amplitude data to adjust the color channels (red, green, blue) of the webcam feed.

<img width="497" alt="截屏2025-02-18 上午10 36 00" src="https://github.com/user-attachments/assets/a651fd7f-2b49-4a1e-8368-10032e4ab349" />
<img width="497" alt="截屏2025-02-18 上午10 35 47" src="https://github.com/user-attachments/assets/a71599ea-95ef-4b82-98a2-1c382741aa7a" />

```

function draw() {
  background(0);
  
  // Analyze sound input
  let spectrum = fft.analyze();
  let amplitude = fft.getEnergy("bass");
  
  // Draw webcam feed
  image(webcam, 0, 0, width, height);
  
  // Apply color shift based on amplitude
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = pixels[i] + amplitude; // Red channel
    pixels[i + 1] = pixels[i + 1] - amplitude; // Green channel
    pixels[i + 2] = pixels[i + 2] + amplitude; // Blue channel
  }
  updatePixels();
}

```

It also give a pulsing effect with sound. can definetly feel more interaction

### Pixelation Effect Based on Amplitude
Create a pixelation effect on the webcam feed that changes based on the amplitude of the sound.

Use amplitude to control the size of the pixel blocks.

<img width="438" alt="截屏2025-02-18 上午10 47 15" src="https://github.com/user-attachments/assets/123d7121-45f1-4e10-835b-66f52d9b0c81" />
<img width="438" alt="截屏2025-02-18 上午10 47 01" src="https://github.com/user-attachments/assets/3a738dcc-cd36-432e-b5c3-034666808cf4" />

Unfortunatly it is extremely laggy. Very very slow. And the Sound changing effect wasn't obvious. One of the screenshoot above was with loud music playing, and there isn't a difference.

```

function draw() {
  background(0);
  
  // Analyze sound input
  let amplitude = fft.getEnergy("bass");
  
  // Draw webcam feed
  image(webcam, 0, 0, width, height);
  
  // Apply pixelation effect based on amplitude
  let pixelSize = map(amplitude, 0, 255, 10, 50); // Increased minimum pixel size
  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      let c = webcam.get(x, y);
      fill(c);
      noStroke();
      rect(x, y, pixelSize, pixelSize);
    }
  }
  
  // Debugging: Display amplitude value
  fill(255);
  textSize(16);
  text("Amplitude: " + amplitude, 10, height - 10);
}

```

Even after seting a lower frame rate and resolution to reduce the computational load. it is still very laggy. 

```
function setup() {
  frameRate(30); // Set frame rate to 30 FPS or even lower 
}

```
### A simple sketch to verify that the microphone is capturing sound
Due to that the pixel isn't changing. and it is working. Just that the mic has noise cancelling aganist the sound that it is playing itslef.
<img width="401" alt="截屏2025-02-18 上午11 02 17" src="https://github.com/user-attachments/assets/a53e2916-9be8-46b4-ba2d-d397e1e9362e" />
## Interactive game
Made a pong game, a white ball bounce when touching walls, black part of the video input and the sound amplitude and frequency sound bars bellow.

```
 // Draw ball and check collisions
  ball.update();
  ball.checkEdges();
  ball.checkCollisions(bars);
  ball.display();
}

class Ball {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(5, 5);
    this.r = 10;
  }
  
  update() {
    this.pos.add(this.vel);
  }
  
  checkEdges() {
    if (this.pos.x < this.r || this.pos.x > width - this.r) {
      this.vel.x *= -1;
    }
    if (this.pos.y < this.r || this.pos.y > height - this.r) {
      this.vel.y *= -1;
    }
  }
  ```


