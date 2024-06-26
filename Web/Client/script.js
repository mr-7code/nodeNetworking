const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Player Class
class Player{
    constructor(){
        this.color = "";
        this.pos = {x:0,y:0};
        this.direction = {x:0,y:0};
    }
    move(deltaTime) {
        this.pos.x += this.direction.x * deltaTime / 20;
        this.pos.y += this.direction.y * deltaTime / 20;
    }
    show(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, 50, 50);
    }
}


//Connection to server
let connectedToServer = false;
let initialized = false;
let localPlayer = new Player();

function connectToServer(){
    const ws = new WebSocket('ws://localhost:3001');    
    ws.onopen = function(){
        console.log('connected to server');
        connectedToServer = true;
    }
    ws.onclose = function(){
        console.log('disconnected from server');
        connectedToServer = false;
    }
    ws.onmessage = function(message){
        const parsedMessage = JSON.parse(message.data)
        switch(parsedMessage.type){
            case "initial":
                initialized = true;
                localPlayer.color = parsedMessage.content.color;
                localPlayer.pos = parsedMessage.content.pos;
                localPlayer.direction = parsedMessage.content.direction;
                break;
        }
    }
    return ws;
}
const webSocket = connectToServer()


//get user input

let wIsDown = false, dIsDown = false, sIsDown = false, aIsDown = false;
let keyCount = 0;
let previousKeyCount = keyCount;
document.addEventListener("keydown",(event)=>{
    switch(event.key){
        case "w":
            keyCount += !wIsDown;
            wIsDown = true;
            break;
        case "a":
            keyCount += !aIsDown;
            aIsDown = true;
            break;
        case "s":
            keyCount += !sIsDown;
            sIsDown = true;
            break;
        case "d":
            keyCount += !dIsDown;
            dIsDown = true;
            break;
    }
})

document.addEventListener("keyup",(event)=>{
    switch(event.key){
        case "w":
            keyCount -= wIsDown;
            wIsDown = false;
            break;
        case "a":
            keyCount -= aIsDown;
            aIsDown = false;
            break;
        case "s":
            keyCount -= sIsDown;
            sIsDown = false;
            break;
        case "d":
            keyCount -= dIsDown;
            dIsDown = false;
            break;
    }
})



//Temporal
const fps = 20;
const fpsInterval = 1000 / fps;
let t1 = Date.now();
let t2 = t1;
let deltaTime = 0;

function update(){
    t2 = Date.now();
    deltaTime = t2 - t1;

    if(deltaTime >= fpsInterval){
        draw()//Pass DeltaTime as a parameter to avoid gloabals
        t1 = t2;
    }
    requestAnimationFrame(update);
}


function draw(){    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(keyCount != previousKeyCount){
        console.log("Changed Dir")
        previousKeyCount = keyCount;
    }

    if(initialized){
        localPlayer.show()

        localPlayer.direction.y = (-wIsDown + sIsDown) * (aIsDown || dIsDown ? 0.707 : 1);
        localPlayer.direction.x = (-aIsDown + dIsDown) * (wIsDown || sIsDown ? 0.707 : 1);

        localPlayer.move(deltaTime)
    }

    if(connectedToServer){
        document.body.style.borderColor = "#0F0";
    }else{
        document.body.style.borderColor = "#F00";
    }

}

//Apply deltaTime only to the delta which is being applied this frame
//Avoid changing total (longer than 1 frame) values because the multiplication needs to be a weighted dist. of all deltas of those Frames
//DO -> m1 * dt1 + m2 * dt2 != DONT -> (m1 + m2) * dt1
update();