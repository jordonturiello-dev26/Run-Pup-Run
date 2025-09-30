const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// ---------------- MIAN GAME LOOP ---------------- //
function gameLoop() { 
  update(); 
  draw();   
  requestAnimationFrame(gameLoop); 
}

function update() {
  pup.update();
  updatePipes();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#87ceeb"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  pipes.forEach(pipe => pipe.draw(ctx));

  pup.draw(ctx);
}

// ---------------- PUP CLASS ---------------- //
class Pup {
    constructor(x, y, spriteSrc, frameWidth, frameHeight, frameCount) {
        this.x = x;
        this.y = y;
        this.velocity = 0; 
        this.gravity = 0.25; 
        this.jumpStrength = -6;
        this.maxVelocity = 8;  

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

      this.velocity += this.gravity; // gravity

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
            this.currentFrame * this.frameWidth, 0, 
            this.frameWidth, this.frameHeight, 
            this.x, this.y, 
            this.frameWidth * 3, this.frameHeight * 3 
        );
    }
}

// ---------------- PIPE CLASS ----------------
class Pipe {
  constructor(x, gapHeight, canvasHeight, speed, spriteTop, spriteBottom) {
    this.x = x;
    this.gapHeight = gapHeight;
    this.canvasHeight = canvasHeight;
    this.speed = speed;

    // Random gap position
    this.gapY = Math.floor(Math.random() * (canvasHeight - gapHeight - 40)) + 20;

    this.spriteTop = new Image();
    this.spriteBottom = new Image();

    this.spriteTop.src = spriteTop;
    this.spriteBottom.src = spriteBottom;

    // Default width until image loads
    this.width = 80;

    this.spriteTop.onload = () => {
      this.width = this.spriteTop.width; // sync to image width
    };
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    // ---- TOP bamboo ----
    for (let y = this.gapY - this.spriteTop.height; y > -this.spriteTop.height; y -= this.spriteTop.height) {
      ctx.drawImage(this.spriteTop, this.x, y);
    }

    // ---- BOTTOM bamboo ----
    for (let y = this.gapY + this.gapHeight; y < this.canvasHeight; y += this.spriteBottom.height) {
      ctx.drawImage(this.spriteBottom, this.x, y);
    }
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }
}

// ---------------- PIPE MANAGER ----------------
let pipes = [];
const pipeGap = 150;
const pipeSpeed = 2;
let frameCount = 0;

function updatePipes() {
  // Move existing pipes
  pipes.forEach(pipe => pipe.update());

  // Remove off-screen pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    if (pipes[i].isOffScreen()) {
      pipes.splice(i, 1);
    }
  }

  // Spawn new pipes
  frameCount++;
  if (frameCount % 90 === 0) {
    pipes.push(
      new Pipe(
        canvas.width,
        pipeGap,  
        canvas.height,
        pipeSpeed,
        "assets/bamboo-top.png",
        "assets/bamboo-bottom.png"
      )
    );
  }
}

// ---------------- PUP INSTANCE ----------------
const pup = new Pup(50, 250, "assets/dog-character-1.png", 32, 32, 1);

pup.image.onload = () => {
  console.log("✅ Pup image loaded!");
  gameLoop();
};

pup.image.onerror = () => {
  console.error("❌ Could not load pup image: assets/dog-character-1.png");
};

// ---------------- CONTROLS ----------------
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    pup.jump();
  }
});