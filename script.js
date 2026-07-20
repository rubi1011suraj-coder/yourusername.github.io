const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const uiBestScore = document.getElementById("uiBestScore");

// --- HIGH-PERFORMANCE ENGINE SETTINGS ---
const physics = {
    gravity: 0.65,      // Snappy gravity pull
    jumpForce: -10,     // Instant, powerful vertical push
    pipeSpeed: 5,       // Fast obstacle forward velocity
    pipeGap: 155        // Balanced vertical opening space
};

// --- CORE OBJECT SCHEMATICS ---
let mantis = {
    x: 70,
    y: 250,
    radius: 15,         // Pixel boundary radius for crisp circle tracking
    velocity: 0
};

let pipes = [];
let score = 0;
let highScore = localStorage.getItem("mantisHighScore") || 0;

// Update the UI sidebar block right away with historical high score
if (uiBestScore) uiBestScore.innerText = highScore;

let gameOver = false;
let gameStarted = false;

// --- DYNAMIC OBSTACLE LOGIC ---
function createPipe() {
    let minHeight = 60;
    let maxHeight = canvas.height - physics.pipeGap - 100;
    let topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomHeight: canvas.height - topHeight - physics.pipeGap,
        width: 60,
        passed: false
    });
}

// --- HARDWARE CORE INPUT CONTROLLER ---
function triggerJump(e) {
    if (e) e.preventDefault(); // Lock down phone page viewport shifts

    if (gameOver) {
        resetGame();
        return;
    }
    if (!gameStarted) gameStarted = true;
    
    mantis.velocity = physics.jumpForce;
}

// Event Tracking Listeners
document.addEventListener("keydown", (e) => { 
    if (e.code === "Space" || e.code === "ArrowUp") triggerJump(); 
});
canvas.addEventListener("touchstart", triggerJump, { passive: false });
canvas.addEventListener("mousedown", triggerJump);

// --- STATE MANAGEMENT ENGINE ---
function resetGame() {
    mantis.y = 250;
    mantis.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = false;
    createPipe();
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("mantisHighScore", highScore);
        if (uiBestScore) uiBestScore.innerText = highScore;
    }
}

// --- GRAPHICS AND RENDERING ENGINE LOOP ---
function loop() {
    // 1. Wipe Graphic Buffer 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Space / Sky Background Layer
    ctx.fillStyle = "#0a192f"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle starry grid look background element
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.fillRect(i + 15, (i * 2) % canvas.height, 2, 2);
    }

    if (gameStarted && !gameOver) {
        // 2. Compute Player Vectors
        mantis.velocity += physics.gravity;
        mantis.y += mantis.velocity;

        // Canvas Boundary Constraints
        if (mantis.y + mantis.radius > canvas.height) {
            mantis.y = canvas.height - mantis.radius;
            gameOver = true;
            updateHighScore();
        }
        if (mantis.y - mantis.radius < 0) {
            mantis.y = mantis.radius;
            mantis.velocity = 0; // Ceiling bumper block
        }

        // 3. Compute Pillar Coordinates
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 210) {
            createPipe();
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            let p = pipes[i];
            p.x -= physics.pipeSpeed;

            // Score Tracker
            if (!p.passed && p.x + p.width < mantis.x) {
                score++;
                p.passed = true;
            }

            // Flush out offscreen arrays
            if (p.x + p.width < 0) {
                pipes.splice(i, 1);
                continue;
            }

            // --- HITBOX RADIAL BOX DETECTOR ---
            let buffer = 4; // Tiny inner margin adjustment for fairer mobile hitbox
            let mLeft = mantis.x - mantis.radius + buffer;
            let mRight = mantis.x + mantis.radius - buffer;
            let mTop = mantis.y - mantis.radius + buffer;
            let mBottom = mantis.y + mantis.radius - buffer;

            if (mRight > p.x && mLeft < p.x + p.width) {
                if (mTop < p.topHeight || mBottom > canvas.height - p.bottomHeight) {
                    gameOver = true;
                    updateHighScore();
                }
            }
        }
    }

    // 4. DRAW GRAPHICAL ASSETS ON SCREEN
    // Draw Obstacle Pillars (Arcade Tube Look)
    pipes.forEach(p => {
        // Top Pipe
        ctx.fillStyle = "#003566";
        ctx.fillRect(p.x, 0, p.width, p.topHeight);
        ctx.fillStyle = "#00d4ff"; // Neon rim lining
        ctx.fillRect(p.x - 2, p.topHeight - 12, p.width + 4, 12);
        
        // Bottom Pipe
        ctx.fillStyle = "#003566";
        ctx.fillRect(p.x, canvas.height - p.bottomHeight, p.width, p.bottomHeight);
        ctx.fillStyle = "#00d4ff";
        ctx.fillRect(p.x - 2, canvas.height - p.bottomHeight, p.width + 4, 12);
    });

    // Draw Mantis Character
    ctx.beginPath();
    ctx.arc(mantis.x, mantis.y, mantis.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#00ea47"; // Glowing Mantis Green
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffd60a"; // Bright gold accent shield ring
    ctx.stroke();
    ctx.closePath();

    // Render Canvas Standard Interface Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.fillText("Score: " + score, 20, 45);

    // Dynamic Display State Prompts
    if (!gameStarted && !gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00d4ff";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.fillText("TAP SCREEN TO FLY", canvas.width / 2, canvas.height / 2);
        ctx.textAlign = "left";
    }

    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ff3333";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 25);
        ctx.fillStyle = "#ffffff";
        ctx.font = "18px Arial";
        ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2 + 15);
        ctx.fillStyle = "#ffd60a";
        ctx.fillText("Tap screen to restart", canvas.width / 2, canvas.height / 2 + 50);
        ctx.textAlign = "left";
    }

    // Force engine hardware frames
    requestAnimationFrame(loop);
}

// FIRE UP CORE ENGINE ACTIVE CALLS
resetGame();
loop();
                
