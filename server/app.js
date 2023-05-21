const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://127.0.0.1:5173"
  }
});

let votes = {};

io.on('connection', (socket) => {
  console.log('New client connected');
  console.log(votes);

  // Emit the current vote count to the newly connected client
  socket.emit('voteCount', votes);

  // Update the vote count on receiving a vote from a client
  socket.on('vote', (option) => {
    votes[option] = votes[option] ? votes[option] + 1 : 1;
    io.sockets.emit('voteCount', votes);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
