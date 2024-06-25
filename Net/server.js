const net = require('net');

const server = net.createServer((socket) => {
    console.log('Client connected');

    socket.on('data', (data) => {
        console.log('Received: ' + data);
        socket.write('Echo: ' + data);
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });
});

server.on('error', (err) => {
    throw err;
});

server.listen(8080, () => {
    console.log('Server listening on port 8080');
});
