const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Player Class
class Player{
    constructor(color,position,direction){
        this.color = color;
        this.position = position;
        this.direction = direction;
    }
    move(deltaTime) {
        this.position.x += this.direction.x * deltaTime / 20;
        this.position.y += this.direction.y * deltaTime / 20;
    }
    show(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, 50, 50);
    }
}
const localAddress = "192.168.1.51"

//Connection to server
let connectedToServer = false;
let initialized = false;
let localID = null;
let playersDict = {};

function connectToServer(){
    const ws = new WebSocket('ws://'+localAddress+':3001');    
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
            case "identification": //Server sends only to you for your ID
                console.log("identified")
                localID = parsedMessage.content.id;
                playersDict[localID] = new Player(parsedMessage.content.color, parsedMessage.content.position, parsedMessage.content.direction);
                initialized = true;
                break;

            case "initial": //When another new Player Joins
                if(parsedMessage.content.id != localID) playersDict[parsedMessage.content.id] = new Player(parsedMessage.content.color, parsedMessage.content.position, parsedMessage.content.direction);
                break;

            case "update": //When server needs to update the direction / position of a Player
                playersDict[parsedMessage.content.id].position = parsedMessage.content.position;
                playersDict[parsedMessage.content.id].direction = parsedMessage.content.direction;
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

    if(keyCount != previousKeyCount){// Works but not error safe (Timewindow) -> Have a control check if the direction being sent to the server is the same as the current client one
        playersDict[localID].direction.y = (-wIsDown + sIsDown) * (aIsDown || dIsDown ? 0.707 : 1);
        playersDict[localID].direction.x = (-aIsDown + dIsDown) * (wIsDown || sIsDown ? 0.707 : 1);

        webSocket.send(JSON.stringify({type:"update", content: {direction:playersDict[localID].direction}}))//Transfer just useful info
        previousKeyCount = keyCount;
    }

    if(deltaTime >= fpsInterval){
        draw()//Pass DeltaTime as a parameter to avoid gloabals
        t1 = t2;
    }
    requestAnimationFrame(update);
}


function draw(){    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(initialized){
        for(let player of Object.values(playersDict)){
            player.move(deltaTime)
            player.show()
        }
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