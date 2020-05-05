var express = require('express');
var app = express();
var server = require('http').createServer(app);
var pm2 = require('pm2');
var socketInfo;

pm2.launchBus(function(err, bus) {
    bus.on('log:err', function(e) {
        // Send
        console.log(new Date())
        if(socketInfo)
          socketInfo.emit("log-lines", e);
    });
});

var io = require('socket.io')(server);
//either use cloud service port or local port:3000
var port = process.env.PORT || 8000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname));


io.sockets.on('connection', function(socket) {
  socketInfo=socket;
    socket.emit("hello", "Hello from Server");
    socket.on("hello", function(data) {
      console.log(data);
    });
    socket.on("logs", function(data) {
      console.log("sending logs1");
    });
});
