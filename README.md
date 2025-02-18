# Creative-Coding
### URL: https://jeffcai0502.github.io/Creative-Coding/
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
Made a not really working pong game, a white ball bounce when touching walls, black part of the video input and the sound amplitude and frequency sound bars bellow.

![2025-02-1811 25 28-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/008c7f66-f440-470c-aa0a-87aaab03655a)

It is working as it should. But i don't like how it moves. It is not controllable at all.

```

function draw() {
  background(0);
  
  // Draw webcam feed
  image(webcam, 0, 0, width, height);
  
  // Analyze sound input
  let spectrum = fft.analyze();
  let amplitude = fft.getEnergy("bass");
  
  // Draw sound bars
  bars = [];
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = map(spectrum[i], 0, 255, 0, height / 2);
    bars.push(new Bar(x, height - h, 10, h));
    fill(255);
    noStroke();
    rect(x, height - h, 10, h);
  }
  
  // Draw ball and check collisions
  ball.update();
  ball.checkEdges();
  ball.checkCollisions(bars);
  ball.display();
}

```
Webcam Feed: Draws the webcam feed on the canvas.

Sound Analysis: Analyzes the sound input to get the frequency spectrum and amplitude of the bass frequencies.

Sound Bars: Draws bars based on the frequency spectrum. These bars act as walls for the ball to bounce off.

Ball Movement and Collision: Updates the ball's position, checks for collisions with the edges, sound bars, and black parts of the webcam feed, and then displays the ball.

```
class Ball {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(5, 5);
    this.r = 10;
  }
  
  update() {
    this.pos.add(this.vel);
  }

```
Constructor: Initializes the ball's position, velocity, and radius.

```update()```: Updates the ball's position based on its velocity.

```

  checkEdges() {
    if (this.pos.x < this.r || this.pos.x > width - this.r) {
      this.vel.x *= -1;
    }
    if (this.pos.y < this.r || this.pos.y > height - this.r) {
      this.vel.y *= -1;
    }
  }

```
```checkEdges()```: Checks for collisions with the edges of the canvas and reverses the velocity if a collision is detected.

```

  checkCollisions(bars) {
    for (let bar of bars) {
      if (this.pos.x > bar.x && this.pos.x < bar.x + bar.w &&
          this.pos.y > bar.y && this.pos.y < bar.y + bar.h) {
        this.vel.y *= -1;
      }
    }
    
    // Check collisions with black parts of the webcam feed
    webcam.loadPixels();
    let index = (floor(this.pos.x) + floor(this.pos.y) * width) * 4;
    if (webcam.pixels[index] == 0 && webcam.pixels[index + 1] == 0 && webcam.pixels[index + 2] == 0) {
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
```
```checkCollisions(bars)```: Checks for collisions with the sound bars and black parts of the webcam feed. If a collision is detected, the ball's velocity is reversed.

```display()```: Draws the ball on the canvas.

The Ball class manages the ball's movement, collision detection, and display. And also represents the sound bars that act as walls for the ball.

### Improving
Changing the ball to free fall. And able to move left and right with sound pitch Improve the video Interactivity.

last verson needs the most black on the webcam to bounce which was rare. Will incule grey. Also changing the sound bar to black

Free Fall Ball Movement: The ball now falls freely due to gravity ```this.acc = createVector(0, 0.5)```

Horizontal Movement: Added code to move the ball left or right based on the sound pitch.

Edge Collision: Modified checkEdges to handle the ball hitting the bottom edge with damping.

I may need to adjust the pitch range in the map function to better suit the microphone and sound environment. And optimize performance by reducing the canvas size or frame rate.

![ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/5a3bfb62-0ea7-4819-881d-59d3e4f0ee7f)

I realised an issue, when the ball reaches the absulute bottom of the screen, it cant bounce up any more. i will fix it by making it bounce up slightly when touching the bottom. As shown in the gif above.

## Theme Goal
I want to make an interative experience with out any touch, users are making impact to the art work without any need of pressing buttons or touch.

And the audiance can feel the relation between sound, noise and inner peace. How it is different when you are in peace compared to “all noisy in side and out”. When everything is in peace,you will be able to see yourself better.

I have added back the Color Shifts Based on Amplitude, to give contrast between quiet and noisy. Also added this to the ball, as it was the normal "focus" for people.

Spent a lot of time tuning the bouncing and damping. The ball can even bounce on my hair(which is black).


### Purpose: Initializes the properties of the ball.

```
constructor() {
  this.pos = createVector(width / 2, 0);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0.2); // Reduced gravity for slower fall
  this.r = 15; // Make the ball slightly bigger
  this.color = 255; // Default color
}
```

### Key Properties:

pos: Position of the ball.

vel: Velocity of the ball.

acc: Acceleration of the ball (gravity).

r: Radius of the ball.

color: Color of the ball.













