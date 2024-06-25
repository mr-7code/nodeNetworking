const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Resize Canvas?

function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "blue";
    ctx.fillRect(100,100,100,100);

    //requestAnimationFrame(update);
}

update();