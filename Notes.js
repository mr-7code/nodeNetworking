//Client

// Define the 10 points of the irregular polygon
const points = [
    {x: 50, y: 60},
    {x: 120, y: 20},
    {x: 200, y: 80},
    {x: 250, y: 30},
    {x: 300, y: 100},
    {x: 380, y: 40},
    {x: 450, y: 90},
    {x: 420, y: 150},
    {x: 350, y: 200},
    {x: 100, y: 180}
];

// Function to draw the irregular polygon
function drawPolygon(ctx, points) {
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

//Auto reconnection
setInterval(attemptReconnect,10000) // 10 sec
function attemptReconnect(){
    if(!connectedToServer){
        connectToServer()
    }
}

//Server

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