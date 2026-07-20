// 1. SELECT ELEMENT HIERARCHY
const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const scoreDisplay = document.getElementById("score");
const speedBar = document.getElementById("speed-bar");

// 2. GAME VARIABLES
let score = 0;
let baseSpeed = 4; // Starting speed
let currentSpeed = baseSpeed;
let currentScale = 1; // 1 means 100% normal size
let isAlive = true;
let cactusLeft = 320;

// 3. JUMP LOGIC WITH DYNAMIC HEIGHT
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

// 4. MAIN GAME ENGINE LOOP
function moveEnemy() {
    if (!isAlive) return;

    cactusLeft -= currentSpeed; // Move using dynamic speed variable
    
    // Scenario: Obstacle passes the screen safely (Score Point!)
    if (cactusLeft < -20) {
        cactusLeft = 320; // Reset obstacle position to right side
        score++;
        scoreDisplay.innerText = score;

        // EVERY 5 POINTS: Increase speed and shrink sizes
        if (score > 0 && score % 5 === 0) {
            currentSpeed += 1; 
            console.log("Speed increased! Current speed: " + currentSpeed);
            
            // Update visual progress of the speed bar
            speedBar.style.width = Math.min(100, (currentSpeed / baseSpeed) * 20) + "%";
            
            // Drop the scale by 15% every 5 points (min limit of 50% size)
            currentScale = Math.max(0.5, currentScale - 0.15); 
            
            // Shrink the dino (keeps its neon green color!)
            dino.style.width = (30 * currentScale) + "px";
            dino.style.height = (30 * currentScale) + "px";
            
            // Shrink the obstacle
            cactus.style.width = (20 * currentScale) + "px";
            cactus.style.height = (30 * currentScale) + "px";
        }
    }
    
    cactus.style.left = cactusLeft + "px";
    
    // Scenario: Collision detection (Game Over check)
    let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
    if (cactusLeft > 20 && cactusLeft < 50 && dinoBottom < (30 * currentScale)) {
        isAlive = false;
        alert("Game Over! Final Score: " + score);
        
        // RESET STATE BACK TO NORMAL
        score = 0;
        currentSpeed = baseSpeed;
        currentScale = 1;
        cactusLeft = 320;
        
        // Reset HTML Text and Speed bar graphics
        scoreDisplay.innerText = score;
        speedBar.style.width = "20%";
        
        // Reset object styles back to standard sizes
        dino.style.width = "30px";
        dino.style.height = "30px";
        cactus.style.width = "20px";
        cactus.style.height = "30px";
        
        isAlive = true;
    }

    requestAnimationFrame(moveEnemy);
}

// 5. START UP THE ENGINE
moveEnemy();
            
