// Get Canvas (drawing area) and Context (drawing API)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Main Game Loop
function gameLoop() { // called every frame
  update(); // move objects, check collisions
  draw();   // clear + redraw everything
  requestAnimationFrame(gameLoop); 
}

function update() {
  pup.update();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

// Backgorund
  ctx.fillStyle = "#87ceeb"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

// Pup
  pup.draw(ctx);
}

// Pup Class
class Pup {
    constructor(x, y, spriteSrc, frameWidth, frameHeight, frameCount) {
        this.x = x;
        this.y = y;
        this.velocity = 0; // current speed
        this.gravity = 0.25; // pup fall speed
        this.jumpStrength = -4.6; // pup jump speed
        this.maxVelocity = 10;  // max velocity

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
      if (this.velocity > this.maxvelocity) {
      this.y += this.velocity; 
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

    // Draw method:
    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.currentFrame * this.frameWidth, 0, // source x, y
            this.frameWidth, this.frameHeight, // source width, height
            this.x, this.y, // canvas position 
            this.frameWidth * 2, this.frameHeight * 2 // scale up
        );
    }
}
// Pup instance
  const pup = new Pup(50, 250, "assets/dog-character-1.png", 32, 32, 1);

// Game Controls
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        pup.jump();
    }
});

gameLoop(); 