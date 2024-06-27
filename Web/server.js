//Imports
const http = require('http');
const websocket = require('ws');

const fs = require('fs');


//Setup for HTTP requests
const htmlFileName = "index.html";
const jsFileName = "script.js";
const cssFileName = "style.css";

const clientFolder = "./Client/"

/* const htmlFile = fs.readFileSync(clientFolder + htmlFileName, 'utf8');
const jsFile = fs.readFileSync(clientFolder + jsFileName, 'utf8');
const cssFile = fs.readFileSync(clientFolder + cssFileName, 'utf8'); */

const reReadFiles = true;

const httpPORT = 3000;
const OKCode = 200;
const errorCode = 404;

//HTTP Server (Read Files on start or when requested?)
const httpServer = http.createServer((req, res) => {
    switch(req.url){
        case '/':
            if(reReadFiles){
                htmlFile = fs.readFileSync(clientFolder + htmlFileName, 'utf8');
            }
            res.writeHead(OKCode, { 'Content-Type': 'text/html' });
            res.write(htmlFile);
            res.end();
            break;

        case '/' + jsFileName:
            if(reReadFiles){
                jsFile = fs.readFileSync(clientFolder + jsFileName, 'utf8');
            }
            res.writeHead(OKCode, { 'Content-Type': 'text/javascript' });
            res.write(jsFile);
            res.end();
            break;

        case '/' + cssFileName:
            if(reReadFiles){
                cssFile = fs.readFileSync(clientFolder + cssFileName, 'utf8');
            }
            res.writeHead(OKCode, { 'Content-Type': 'text/css' });
            res.write(cssFile);
            res.end();
            break;

        default:
            res.writeHead(errorCode, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            break;
    }
});

httpServer.listen(httpPORT, () => {
console.log('HTTP Manager is listening on Port:',httpPORT);});



class Player{
    constructor(id,color){
        this.id = id
        this.color = color;
        this.position = {x:0,y:0};
        this.direction = {x:0,y:0};
    }
    move(deltaTime) {
        this.position.x += this.direction.x * deltaTime / 20;
        this.position.y += this.direction.y * deltaTime / 20;
    }
}

const wsServer = new websocket.Server({port: 3001});

wsServer.on("connection", handleConnection)

const colorArr = ["blue","red","green","purple","orange"];

const playersDict = {};

let connectionsSinceBeginning = 0;

function handleConnection(client){
    console.log("New Connection");
    let t1 = Date.now();
    let t2 = t1;

    //Prepare initial send
    let player = new Player(connectionsSinceBeginning, colorArr[Math.floor(Math.random() * colorArr.length)]);
    playersDict[connectionsSinceBeginning] = player;
    connectionsSinceBeginning++;
    
    //Initial send
    client.send(JSON.stringify({type: "identification", content: {position:player.position, direction:player.direction, color: player.color, id: player.id}}));

    for(let user of Object.values(playersDict)){//Send new user all other users
        client.send(JSON.stringify({type: "initial", content: {position:user.position, direction:user.direction, color: user.color, id: user.id}}));
    };

    wsServer.clients.forEach((user)=>{
        user.send(JSON.stringify({type: "initial", content: {position:player.position, direction:player.direction, color: player.color, id: player.id}}));
    });

    client.on("message", (message)=>{
        const messageString = message.toString()
        const parsedMessage = JSON.parse(messageString)
        switch(parsedMessage.type){
            case "update"://Handle movement updates
                t2 = Date.now();
                const deltaTime = t2 - t1;

                player.move(deltaTime);
                player.direction = parsedMessage.content.direction;

                t1 = t2;//Send to all exept the one we recieved from the data and only of this player so we need an identifier

                wsServer.clients.forEach((client)=>{
                    client.send(JSON.stringify({type: "update", content: {position:player.position, direction:player.direction, id: player.id}}))
                });
                break;
        }
    });

    client.on("close", () => {
        console.log("Connection closed");
    });
}

// Approach A: Have a worker Thread start a gameloop
// Approach B: Only use timestamp calculations to find out the movement (Timestamp Serverside for control / Clientside for higher accuracy)