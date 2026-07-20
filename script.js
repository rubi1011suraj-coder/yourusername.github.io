let mantis = document.getElementById("mantis");
let pipeTop = document.getElementById("pipeTop");
let pipeBottom = document.getElementById("pipeBottom");

let pipeX = 350;
let gap = 150; // Slightly tighter gap for tight, fast maneuvers
let topHeight = 150;
let y = 250;
let velocity = 0;

// --- EXTREME SPEED & PHYSICS ---
let gravity = 1.2;  // Heavy, aggressive gravity drop
let jump = -14;     // Powerful, snappy jump force to fight gravity
let score = 0;
let scoreBox = document.getElementById("score");
let scored = false;
let gameOver = false;

function handleJump() {
    if (gameOver) return;
    velocity = jump;
}

function update() {
    if (gameOver) {
        return;
    }
    
    // Apply heavy physics updates
    velocity += gravity;
    y += velocity;

    if(y < 0){
        y = 0;
        velocity = 0;
    }

    if(y > 560){
        y = 560;
        velocity = 0;
    }

    mantis.style.top = y + "px";
    
    // --- LUDICROUS SPEED ---
    pipeX -= 9; // High-velocity pipe sprint across the screen

    pipeTop.style.left = pipeX + "px";
    pipeBottom.style.left = pipeX + "px";
    
    // Accurate collision detection matching high speed
    let padding = 6; 
    let mantisLeft = 70 + padding;
    let mantisRight = 70 + 40 - padding; 
    let mantisTop = y + padding;
    let mantisBottom = y + 40 - padding; 

    let pipeLeft = pipeX;
    let pipeRight = pipeX + 60; 
    let bottomPipeTopY = topHeight + gap; 

    if (
        mantisRight > pipeLeft &&
        mantisLeft < pipeRight &&
        (mantisTop < topHeight || mantisBottom > bottomPipeTopY)
    ) {
        gameOver = true;
        setTimeout(() => {
            alert("Game Over!\nScore: " + score);
        }, 50);
        return; 
    }
    
    // Score tracking
    if (pipeX < 70 && !scored) {
        score++;
        scoreBox.innerHTML = "Score: " + score;
        scored = true;
    }
    
    // Reset pipe positions instantly
    if (pipeX < -60) {
        pipeX = 350;
        scored = false;
        
        topHeight = Math.floor(Math.random() * 220) + 50;

        pipeTop.style.height = topHeight + "px";
        pipeBottom.style.height = (600 - topHeight - gap) + "px";
    }
    
    requestAnimationFrame(update);
}

// Controls
document.addEventListener("keydown", function(e){
    if(e.code === "Space"){
        handleJump();
    }
});

document.addEventListener("click", function(){
    handleJump();
});

// Initialize heights right away
pipeTop.style.height = topHeight + "px";
pipeBottom.style.height = (600 - topHeight - gap) + "px";

update();
        
