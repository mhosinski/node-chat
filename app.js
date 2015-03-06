var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');
var rclient = redis.createClient();
var sockets = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	socket.on('set nickname', function(data) {
		console.log(socket.id + ': ' + data + ' has connected');
		sockets[socket.id] = data;
		socket.broadcast.emit('user connected', data);
		rclient.hvals('users', function(err, data) {
			socket.emit('userlist', data);
		});
		rclient.lrange('messages', 0, -1, function(err, data) {
			socket.emit('messagelist', data);
		});
		rclient.hset('users', socket.id, data);
	});
	socket.on('chat message', function(name, msg) {
		socket.broadcast.emit('chat message', name, msg);
		rclient.lpush('messages', name + ': ' + msg);
		rclient.ltrim('messages', 0, 49);
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
			delete sockets[socket.id];
			socket.broadcast.emit('user disconnected', name);
			rclient.hdel('users', socket.id);

			if (Object.keys(sockets).length === 0) {
				rclient.del('messages');
			}
		});
	});
});



rclient.on('connect', function() {
	console.log('Connected to Redis');
});

http.listen(3000, function() {
	console.log('Listening on *:3000');
});
