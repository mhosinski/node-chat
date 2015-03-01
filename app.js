var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	socket.on('set nickname', function(data) {
		console.log(data + ' has connected');
		socket.broadcast.emit('user connected', data + ' has joined the room');
	});
	socket.on('chat message', function(name, msg) {
		socket.broadcast.emit('chat message', name, msg);	
	});
	socket.on('user typing', function(data) {
		socket.broadcast.emit('user typing', data);
	});
	socket.on('cease typing', function(data) {
		socket.broadcast.emit('cease typing', data);
	});
});

http.listen(3000, function() {
	console.log('Listening on *:3000');
});