
            const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const uiBestScore = document.getElementById("uiBestScore");

// --- HIGH-PERFORMANCE ENGINE SETTINGS ---
const physics = {
    gravity: 0.65,      
    jumpForce: -10,     
    pipeSpeed: 5,       
    pipeGap: 155        
};

// --- CORE OBJECT SCHEMATICS ---
let mantis = {
    x: 70,
    y: 250,
    radius: 15,         
    velocity: 0
};

let pipes = [];
let score = 0;
let highScore = localStorage.getItem("mantisHighScore") || 0;

// Safe UI check to prevent silent script crashes
if (uiBestScore) {
    uiBestScore.innerText = highScore;
}

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

// --- UNIVERSAL ACCESSIBILITY INPUT CONTROLLER ---
function triggerJump(e) {
    // ONLY prevent default on actual mobile touch events to avoid breaking clicks
    if (e && e.type === "touchstart") {
        e.preventDefault(); 
    }

    if (gameOver) {
        resetGame();
        return;
    }
    
    if (!gameStarted) {
        gameStarted = true;
    }
    
    mantis.velocity = physics.jumpForce;
}

// Global input listeners tracking side-by-side
document.addEventListener("keydown", (e) => { 
    if (e.code === "Space" || e.code === "ArrowUp") {
        triggerJump(e); 
    }
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#0a192f"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Starry grid background decoration
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.fillRect(i + 15, (i * 2) % canvas.height, 2, 2);
    }

    if (gameStarted && !gameOver) {
        mantis.velocity += physics.gravity;
        mantis.y += mantis.velocity;

        if (mantis.y + mantis.radius > canvas.height) {
            mantis.y = canvas.height - mantis.radius;
            gameOver = true;
            updateHighScore();
        }
        if (mantis.y - mantis.radius < 0) {
            mantis.y = mantis.radius;
            mantis.velocity = 0; 
        }

        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 210) {
            createPipe();
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            let p = pipes[i];
            p.x -= physics.pipeSpeed;

            if (!p.passed && p.x + p.width < mantis.x) {
                score++;
                p.passed = true;
            }

            if (p.x + p.width < 0) {
                pipes.splice(i, 1);
                continue;
            }

            let buffer = 4; 
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

    // Draw Obstacle Pillars
    pipes.forEach(p => {
        ctx.fillStyle = "#003566";
        ctx.fillRect(p.x, 0, p.width, p.topHeight);
        ctx.fillStyle = "#00d4ff"; 
        ctx.fillRect(p.x - 2, p.topHeight - 12, p.width + 4, 12);
        
        ctx.fillStyle = "#003566";
        ctx.fillRect(p.x, canvas.height - p.bottomHeight, p.width, p.bottomHeight);
        ctx.fillStyle = "#00d4ff";
        ctx.fillRect(p.x - 2, canvas.height - p.bottomHeight, p.width + 4, 12);
    });

    // Draw Mantis Character
    ctx.beginPath();
    ctx.arc(mantis.x, mantis.y, mantis.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#00ea47"; 
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffd60a"; 
    ctx.stroke();
    ctx.closePath();

    // Render Interface Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.fillText("Score: " + score, 20, 45);

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

    requestAnimationFrame(loop);
}

resetGame();
loop();
