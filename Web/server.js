const http = require('http');
const websocket = require('ws');

const fs = require('fs');

const htmlFileName = "index.html";
const jsFileName = "script.js";
const cssFileName = "style.css";

const clientFolder = "./Client/"


//HTTP
const httpPORT=3000
const httpServer = http.createServer((req, res) => {

    switch(req.url){
        case '/':
            const htmlFile = fs.readFileSync(clientFolder + htmlFileName, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(htmlFile);
            res.end();
            break;

        case '/' + jsFileName:
            const jsFile = fs.readFileSync(clientFolder + jsFileName, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(jsFile);
            res.end();
            break;

        case '/' + cssFileName:
            const cssFile = fs.readFileSync(clientFolder + cssFileName, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(cssFile);
            res.end();
            break;

        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            break;
    }
});

httpServer.listen(httpPORT, () => {
console.log('HTTP Manager is listening on Port:',httpPORT);});


//HTTP Firewall
/* if(blacklistIP.includes(req.socket.remoteAddress)){
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end('Your are Blocked from this Website');

    console.log('Denied access to:',req.socket.remoteAddress)
    return 
} */

/* if(trollIP.includes(req.socket.remoteAddress)){
    res.writeHead(302, {
    'Location': 'https://www.youtube.com/watch?v=xvFZjo5PgG0'
    });
    res.end()

    console.log('Trolled:',req.socket.remoteAddress)
    return 
} */

/* if(clientConnections >= maxConnections){// Max Connections Reached
    res.writeHead(401, { 'Content-Type': 'text/plain' });//Maybe send a different Html File
    res.end('401 Maximum Amount of Clients reached');
    console.log('Denied access to a Client due to Limit being reached')
    return null
} */