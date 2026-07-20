const scoreDisplay = document.getElementById("score");

const speedBar = document.getElementById("speed-bar");
if (score > 0 && score % 5 === 0) {
    currentSpeed += 1; 
    console.log("Speed increased! Current speed: " + currentSpeed);
}
// Increases the visible width of the bar (e.g., 20% starting -> 40% -> 60%...)
speedBar.style.width = Math.min(100, (currentSpeed / baseSpeed) * 20) + "%";
currentSpeed = baseSpeed;
scoreDisplay.innerText = score;
speedBar.style.width = "20%";
let baseSpeed = 4; 
let currentSpeed = baseSpeed;
let currentScale = 1; // 1 means 100% normal size
function jump() {
    if (!dino.classList.contains("jump-animation") && isAlive) {
        // Calculate dynamic jump height (goes higher as scale gets smaller)
        let jumpPeak = 80 * currentScale; 
        
        dino.classList.add("jump-animation");
        
        // Inject dynamic heights into the keyframe bounds programmatically
        dino.style.setProperty('--jump-height', jumpPeak + 'px');

        setTimeout(function() {
            dino.classList.remove("jump-animation");
        }, 500);
    }
}
if (score > 0 && score % 5 === 0) {
    currentSpeed += 1; 
    console.log("Speed increased! Current speed: " + currentSpeed);
    speedBar.style.width = Math.min(100, (currentSpeed / baseSpeed) * 20) + "%";
}
    // Drop the scale by 15% every 5 points (min limit of 50% size)
    currentScale = Math.max(0.5, currentScale - 0.15); 
    
    // Shrink the dino (keeps its neon green color!)
    dino.style.width = (30 * currentScale) + "px";
    dino.style.height = (30 * currentScale) + "px";
    
    // Shrink the obstacle
    cactus.style.width = (20 * currentScale) + "px";
    cactus.style.height = (30 * currentScale) + "px";
    score = 0;
currentSpeed = baseSpeed;
scoreDisplay.innerText = score;
speedBar.style.width = "20%";
    currentScale = 1;
    dino.style.width = "30px";
    dino.style.height = "30px";
    cactus.style.width = "20px";
    cactus.style.height = "30px";
      
