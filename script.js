const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let carX = 100;
let speed = 0;
let distance = 0;

let gas = false;
let brake = false;

const gasBtn = document.getElementById("gas");
const brakeBtn = document.getElementById("brake");

function pressGas(e) {
    e.preventDefault();
    gas = true;
}
function releaseGas(e) {
    e.preventDefault();
    gas = false;
}
function pressBrake(e) {
    e.preventDefault();
    brake = true;
}
function releaseBrake(e) {
    e.preventDefault();
    brake = false;
}

gasBtn.addEventListener("touchstart", pressGas);
gasBtn.addEventListener("touchend", releaseGas);
gasBtn.addEventListener("mousedown", pressGas);
gasBtn.addEventListener("mouseup", releaseGas);

brakeBtn.addEventListener("touchstart", pressBrake);
brakeBtn.addEventListener("touchend", releaseBrake);
brakeBtn.addEventListener("mousedown", pressBrake);
brakeBtn.addEventListener("mouseup", releaseBrake);

function gameLoop() {

    if (gas) speed += 0.1;
    if (brake) speed -= 0.1;

    speed *= 0.98;

    if (speed < 0) speed = 0;
    if (speed > 8) speed = 8;

    distance += speed;

    document.getElementById("distance").textContent =
        "Distance: " + Math.floor(distance) + " m";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sky
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hills
ctx.fillStyle = "#4CAF50";
ctx.beginPath();

ctx.moveTo(0, canvas.height);

for (let x = 0; x <= canvas.width; x++) {
    let y = canvas.height - 180 + Math.sin((x + distance) * 0.01) * 80;
}

ctx.lineTo(canvas.width, canvas.height);
ctx.closePath();
ctx.fill();
    // Car body
    ctx.fillStyle = "red";
    ctx.fillRect(carX, canvas.height - 170, 90, 35);

    // Wheels
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(carX + 20, canvas.height - 135, 15, 0, Math.PI * 2);
    ctx.arc(carX + 70, canvas.height - 135, 15, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(gameLoop);
}

gameLoop();
