let mantis = document.getElementById("mantis");
let pipeTop = document.getElementById("pipeTop");
let pipeBottom = document.getElementById("pipeBottom");

// Grab the audio elements from your HTML
let wingSound = document.getElementById("wingSound");
let pointSound = document.getElementById("pointSound");
let hitSound = document.getElementById("hitSound");

let pipeX = 350;
let gap = 170;
let topHeight = 150;
let y = 250;
let velocity = 0;

// --- SNAPPY PHYSICS SPEEDS ---
let gravity = 0.7;  // Faster fall speed
let jump = -10;     // Snappier, higher jump
let score = 0;
let scoreBox = document.getElementById("score");
let scored = false;
let gameOver = false;

// Handles jump physics and forces audio to play instantly on rapid clicks
function handleJump() {
    if (gameOver) return;
    
    velocity = jump;
    
    // Reset sound track to 0 so it plays instantly even during fast clicking
    if (wingSound) {
        wingSound.currentTime = 0;
        wingSound.play().catch(e => console.log("Audio waiting for user click"));
    }
}

function update() {
    if (gameOver) {
        return;
    }
    
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
    
    // --- FASTER OBSTACLE SPEED ---
    pipeX -= 4; // Obstacles now rush at the player twice as fast!

    pipeTop.style.left = pipeX + "px";
    pipeBottom.style.left = pipeX + "px";
    
    // Collision logic with hitbox padding
    let padding = 5; 
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
        
        // Play crash sound
        if (hitSound) hitSound.play();
        
        setTimeout(() => {
            alert("Game Over!\nScore: " + score);
        }, 100);
        return; 
    }
    
    // Score tracking
    if (pipeX < 70 && !scored) {
        score++;
        scoreBox.innerHTML = "Score: " + score;
        scored = true;
        
        // Play score point sound
        if (pointSound) {
            pointSound.currentTime = 0;
            pointSound.play();
        }
    }
    
    // Reset pipe and randomize heights
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

// Initialize first pipe heights
pipeTop.style.height = topHeight + "px";
pipeBottom.style.height = (600 - topHeight - gap) + "px";

update();
    
