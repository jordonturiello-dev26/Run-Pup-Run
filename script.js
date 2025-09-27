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
  // later: pup movement, pipes, etc.
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  ctx.fillStyle = "#87ceeb"; // sky blue
  ctx.fillRect(0, 0, canvas.width, canvas.height);

 
  ctx.fillStyle = "brown";
  ctx.fillRect(50, 250, 40, 40);
}
gameLoop();
