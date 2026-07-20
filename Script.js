let mantis = document.getElementById("mantis");
let pipeTop = document.getElementById("pipeTop");
let pipeBottom = document.getElementById("pipeBottom");

let pipeX = 350;
let gap = 170;
let topHeight = 150;
let y = 250;
let velocity = 0;
let gravity = 0.5;
let jump = -8;

function update() {

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
pipeX -= 2;

pipeTop.style.left = pipeX + "px";
pipeBottom.style.left = pipeX + "px";

if (pipeX < -60) {

    pipeX = 350;

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

update();
