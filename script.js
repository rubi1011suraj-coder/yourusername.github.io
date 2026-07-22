const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let carX = 100;
let speed = 0;
let distance = 0;

let gas = false;
let brake = false;

const gasBtn = document.getElementById("gas");
const brakeBtn = document.getElementById("brake");

gasBtn.addEventListener("touchstart", () => gas = true);
gasBtn.addEventListener("touchend", () => gas = false);

brakeBtn.addEventListener("touchstart", () => brake = true);
brakeBtn.addEventListener("touchend", () => brake = false);

function gameLoop() {

    if (gas) speed += 0.1;
    if (brake) speed -= 0.1;

    speed *= 0.98;

    if (speed < 0) speed = 0;
    if (speed > 8) speed = 8;

    distance += speed;

    document.getElementById("distance").textContent =
        "Distance: " + Math.floor(distance) + " m";

    ctx.clearRect(0,0
