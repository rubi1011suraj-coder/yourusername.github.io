let mantis = document.getElementById("mantis");

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
