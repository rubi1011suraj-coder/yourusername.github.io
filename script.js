let mantis = document.getElementById("mantis");
let pipeTop = document.getElementById("pipeTop");
let pipeBottom = document.getElementById("pipeBottom");

let pipeX = 350;
let gap = 170;
let topHeight = 150;
let y = 250;
let velocity = 0;
let gravity = 0.75;
let jump = -8;
let score = 0;
let scoreBox = document.getElementById("score");
let scored = false;
let gameOver = false;

function update() {
    if (gameOver) {
        return;
    }
    
    function update() {
    if (gameOver) {
        return;
    }
    
    velocity += gravity;
    y += velocity;

    // ... (keep your boundary checks the same) ...

    mantis.style.top = y + "px";
    
    // --- CHANGED FOR FASTER PIPES ---
    pipeX -= 4; // Increased from 2 (Pipes move twice as fast!)

    pipeTop.style.left = pipeX + "px";
    pipeBottom.style.left = pipeX + "px";
        
    
    // --- FIXED COLLISION LOGIC WITH HITBOX PADDING ---
    let padding = 5; // Shaves off 5px from all sides so the player has a fair chance
    let mantisLeft = 70 + padding;
    let mantisRight = 70 + 40 - padding; // Mantis width is 40px
    let mantisTop = y + padding;
    let mantisBottom = y + 40 - padding; // Mantis height is 40px

    let pipeLeft = pipeX;
    let pipeRight = pipeX + 60; // Pipe width is 60px
    let bottomPipeTopY = topHeight + gap; // Dynamic start point of the bottom obstacle

    if (
        mantisRight > pipeLeft &&
        mantisLeft < pipeRight &&
        (mantisTop < topHeight || mantisBottom > bottomPipeTopY)
    ) {
        gameOver = true;
        alert("Game Over!\nScore: " + score);
        return; // Stop the animation frame immediately
    }
    
    // Score tracking
    if (pipeX < 70 && !scored) {
        score++;
        scoreBox.innerHTML = "Score: " + score;
        scored = true;
    }
    
    // Reset pipe and randomize heights
    if (pipeX < -60) {
        pipeX = 350;
        scored = false;
        
        // Randomize top height between 50px and 270px
        topHeight = Math.floor(Math.random() * 220) + 50;

        pipeTop.style.height = topHeight + "px";
        pipeBottom.style.height = (600 - topHeight - gap) + "px";
    }
    
    requestAnimationFrame(update);
}

document.addEventListener("keydown", function(e){
    if(e.code === "Space"){
        velocity = jump;
    }
});

document.addEventListener("click", function(){
    velocity = jump;
});

// Initialize the first pipe heights right away so they aren't hardcoded to CSS defaults
pipeTop.style.height = topHeight + "px";
pipeBottom.style.height = (600 - topHeight - gap) + "px";

update();
