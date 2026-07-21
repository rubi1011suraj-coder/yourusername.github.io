// Element Links
        const dino = document.getElementById("dino");
        const cactus = document.getElementById("cactus");
        const scoreDisplay = document.getElementById("score");
        const speedBar = document.getElementById("speed-bar");

        // Game Configuration Settings
        let score = 0;
        let baseSpeed = 4; 
        let currentSpeed = baseSpeed;
        let currentScale = 1; // 1 = 100% size scale
        let isAlive = true;
        let cactusLeft = 320;

        // Jump Execution Physics
        function jump() {
            if (!dino.classList.contains("jump-animation") && isAlive) {
                // Boosted jump height (175px starting peak instead of 110px)
                let jumpPeak = 175 * (2 - currentScale); 
                
                // Set the value globally so the CSS keyframe reads it immediately
                document.documentElement.style.setProperty('--jump-height', jumpPeak + 'px');

                dino.classList.add("jump-animation");
                
                setTimeout(function() {
                    dino.classList.remove("jump-animation");
                }, 500);
            }
        }

        // Main Refresh Loop Engine
        function moveEnemy() {
            if (!isAlive) return;

            cactusLeft -= currentSpeed; 
            
            // Score tracking condition
            if (cactusLeft < -20) {
                cactusLeft = 320; 
                score++;
                scoreDisplay.innerText = score;

                // EVERY 5 POINTS: Increase speed, scale down graphics, raise jumps
                if (score > 0 && score % 5 === 0) {
                    currentSpeed += 1; 
                    
                    // Grow the UI speed bar progress
                    speedBar.style.width = Math.min(100, (currentSpeed / baseSpeed) * 20) + "%";
                    
                    // Reduce scaling factors down to a limit of 50% size (0.5)
                    currentScale = Math.max(0.5, currentScale - 0.15); 
                    
                    // Apply visual adjustments to the green dino
                    dino.style.width = (30 * currentScale) + "px";
                    dino.style.height = (30 * currentScale) + "px";
                    
                    // Apply visual adjustments to the red obstacle
                    cactus.style.width = (20 * currentScale) + "px";
                    cactus.style.height = (30 * currentScale) + "px";
                }
            }
            
            cactus.style.left = cactusLeft + "px";
            
            // Impact Detection Calculation
            let dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
            if (cactusLeft > 20 && cactusLeft < (20 + (30 * currentScale)) && dinoBottom < (30 * currentScale)) {
                isAlive = false;
                alert("Game Over! Final Score: " + score);
                
                // RESTORE START CONFIGURATIONS ON REBOOT
                score = 0;
                currentSpeed = baseSpeed;
                currentScale = 1;
                cactusLeft = 320;
                
                scoreDisplay.innerText = score;
                speedBar.style.width = "20%";
                
                dino.style.width = "30px";
                dino.style.height = "30px";
                cactus.style.width = "20px";
                cactus.style.height = "30px";
                
                isAlive = true;
            }

            requestAnimationFrame(moveEnemy);
        }

        // Run Engine
        moveEnemy();
    </script>

</body>
</html>
