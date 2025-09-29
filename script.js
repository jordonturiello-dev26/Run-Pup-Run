// Get Canvas (drawing area) and Context (drawing API)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// Main Game Loop //
function gameLoop() { // called every frame
  update(); // move objects, check collisions
  draw();   // clear + redraw everything
  requestAnimationFrame(gameLoop); 
}

function update() {
  pup.update();

  pipes.forEach(pipe => pipe.update());
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

// Backgorund
  ctx.fillStyle = "#87ceeb"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

// Pipes
pipes.forEach(pipe => pipe.draw(ctx));

// Pup
  pup.draw(ctx);
}

// Pup Class //
class Pup {
    constructor(x, y, spriteSrc, frameWidth, frameHeight, frameCount) {
        this.x = x;
        this.y = y;
        this.velocity = 0; // current speed
        this.gravity = 0.25; // pup fall speed
        this.jumpStrength = -6 // pup jump speed
        this.maxVelocity = 8;  // max velocity

        // Sprite aimation
        this.image = new Image(); // creates image object
        this.image.src = spriteSrc; // path to image

        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount; 
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameInterval = 8; // animation cycle  
    }

    // Jump method:
    jump() {
        this.velocity = this.jumpStrength;
    }

    // Update method:
    update() {
      // Physics
      this.velocity += this.gravity; // gravity

      // Add max velocity cap
      if (this.velocity > this.maxVelocity) {
      this.velocity = this.maxVelocity; 
      }

      // Move pup
      this.y += this.velocity;

    //Animation frame update
    this.frameTimer++;
    if (this.frameTimer >= this.frameInterval) {
        this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        this.frameTimer = 0;
        }
    }

    // Draw pup method:
    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.currentFrame * this.frameWidth, 0, // source x, y
            this.frameWidth, this.frameHeight, // source width, height
            this.x, this.y, // canvas position 
            this.frameWidth * 3, this.frameHeight * 3 // scale up
        );
    }
}

// Pipe Class
class Pipe {
  constructor(x, width, gapHeight, canvasHeight, speed) {
    this.x = x; //starting position
    this.width = width; // pipe width
    this.gapHeight = gapHeight; // size of the gap between pipes
    this.canvasHeight = canvasHeight; // so pipes fill full canvas height
    this.speed = speed; // speed moving left

    //Randomise vertical gap position
    this.gapY = Math.floor(Math.random() * (canvasHeight - this.gapHeight - 40)) + 20;
  }

  update() {
    this.x -= this.speed; // move pipe left

    // if pipe goes off screen, reset to right
    if (this.x + this.width < 0) {
      this.x = canvas.width;
      this.gapY = Math.floor(Math.random() * (this.canvasHeight - this.gapHeight - 40)) + 20;
    }
  }
  
  draw(ctx) {
      ctx.fillStyle = "green";
      ctx.fillRect(this.x, 0, this.width, this.gapY); // top pipe
      ctx.fillRect(this.x, this.gapY + this.gapHeight, this.width, this.canvasHeight - (this.gapY + this.gapHeight)); // bottom pipe
    }    
}

// Pipe setup
const pipes = [];
const pipeWidth = 60;
const pipeGap = 140;
const pipeSpeed = 2;

// adds 3 pipes, spaced 300px apart
for (let i = 0; i < 3; i++) {
  pipes.push(new Pipe(canvas.width + i * 400, pipeWidth, pipeGap, canvas.height, pipeSpeed));
}

// Pup instance
const pup = new Pup(50, 250, "assets/dog-character-1.png", 32, 32, 1);

pup.image.onload = () => {
  console.log("✅ Pup image loaded!");
  gameLoop();
};

pup.image.onerror = () => {
  console.error("❌ Could not load pup image: assets/dog-character-1.png");
};

// Game Controls
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        pup.jump();
    }
});

gameLoop(); 