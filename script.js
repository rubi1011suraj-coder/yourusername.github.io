const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const bgImg = new Image();
bgImg.src = "Background.jpg";

const carImg = new Image();
carImg.src = "Car.jpg";

const wheelImg = new Image();
wheelImg.src = "Wheel.jpg";
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

function pressGas(e){e.preventDefault();gas=true;}
function releaseGas(e){e.preventDefault();gas=false;}
function pressBrake(e){e.preventDefault();brake=true;}
function releaseBrake(e){e.preventDefault();brake=false;}

gasBtn.addEventListener("touchstart",pressGas);
gasBtn.addEventListener("touchend",releaseGas);
gasBtn.addEventListener("mousedown",pressGas);
gasBtn.addEventListener("mouseup",releaseGas);

brakeBtn.addEventListener("touchstart",pressBrake);
brakeBtn.addEventListener("touchend",releaseBrake);
brakeBtn.addEventListener("mousedown",pressBrake);
brakeBtn.addEventListener("mouseup",releaseBrake);

function getGroundY(x){
    return canvas.height-120+
    Math.sin((x+distance)*0.02)*40;
}

function gameLoop(){

    if(gas) speed+=0.12;
    if(brake) speed-=0.12;

    speed*=0.98;

    if(speed<0) speed=0;
    if(speed>8) speed=8;

    distance+=speed;

    document.getElementById("distance").textContent=
    "Distance: "+Math.floor(distance)+" m";

    ctx.clearRect(0,0,canvas.width,canvas.height);
const bgImg = new Image();
bgImg.src = "Background.jpg";
    // Background
if (bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
} else {
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
    // Sun
    ctx.fillStyle="yellow";
    ctx.beginPath();
    ctx.arc(80,80,35,0,Math.PI*2);
    ctx.fill();

    // Hills
    ctx.fillStyle="#4CAF50";
    ctx.beginPath();
    ctx.moveTo(0,canvas.height);

    for(let x=0;x<=canvas.width;x++){
        ctx.lineTo(x,getGroundY(x));
    }

    ctx.lineTo(canvas.width,canvas.height);
    ctx.closePath();
    ctx.fill();

    let groundY=getGroundY(carX+45);

    let groundY = getGroundY(carX + 45);

// Draw car on the ground
ctx.drawImage(carImg, carX, groundY - 80, 120, 80);
    // Wheels
    ctx.fillStyle="black";
    ctx.beginPath();
    ctx.arc(carX+20,groundY-10,15,0,Math.PI*2);
    ctx.arc(carX+70,groundY-10,15,0,Math.PI*2);
    ctx.fill();

    requestAnimationFrame(gameLoop);
}

gameLoop();
