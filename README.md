# node-chat
A simple chat application built with node.js, express, socket.io, and redis.

## Installation
Install [node.js](http://nodejs.org/download/), [npm](https://github.com/npm/npm), and [redis](http://redis.io/topics/quickstart).

Clone the repo and install dependencies:
```bash
$ git clone https://github.com/mhosinski/node-chat.git
$ cd node-chat
$ npm install
```

## Run
Start redis server:
```bash
$ redis-server
```

Start app:
```bash
$ node app.js
```

Open your browser and navigate to http://localhost:3000 to test. Open multiple tabs for additional users or access the app from other devices on your network by replacing 'localhost' with the ip address of the computer that is running the server.

## License
[MIT](https://github.com/mhosinski/node-chat/blob/master/LICENSE.md)
