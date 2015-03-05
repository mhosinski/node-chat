var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');
var rclient = redis.createClient();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	socket.on('set nickname', function(data) {
		console.log(socket.id + ': ' + data + ' has connected');
		socket.broadcast.emit('user connected', data);
		rclient.hvals('users', function(err, data) {
			socket.emit('userlist', data);
			console.dir(data);
		});
		rclient.hset('users', socket.id, data);
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
	socket.on('disconnect', function() {
		rclient.hget('users', socket.id, function(err, name) {
			console.log(socket.id + ': ' + name + ' has disconnected');
			socket.broadcast.emit('user disconnected', name);
			rclient.hdel('users', socket.id);
		});
	});
});



rclient.on('connect', function() {
	console.log('Connected to Redis');
});

http.listen(3000, function() {
	console.log('Listening on *:3000');
});
