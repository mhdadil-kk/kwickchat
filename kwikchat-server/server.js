const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'] }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: 'http://localhost:3000' } });

let waitingUser = null; // Queue for waiting users
const userRooms = new Map(); // Map to track which room each user is in

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  if (waitingUser) {
    // Create a private room for the two users
    const room = `${waitingUser}-${socket.id}`;
    socket.join(room);
    io.sockets.sockets.get(waitingUser).join(room); // Add the waiting user to the same room
    userRooms.set(socket.id, room);
    userRooms.set(waitingUser, room);

    // Notify both users
    io.to(room).emit('system_message', 'You are now connected to a stranger.');

    // Clear the waiting user
    waitingUser = null;
  } else {
    // No one is waiting, this user becomes the waiting user
    waitingUser = socket.id;
    socket.emit('system_message', 'Waiting for a stranger...');
  }

  socket.on('send_message', (message) => {
    const room = userRooms.get(socket.id); // Find the room the user is in
    if (room) {
      io.to(room).emit('receive_message', message); // Send the message only to the room
    }
  });

  socket.on('next_stranger', () => {
    const room = userRooms.get(socket.id); // Find the user's current room

    if (room) {
      // Notify the other user in the room that the stranger left
      socket.leave(room);
      io.to(room).emit('system_message', 'The stranger has left the chat.');
    }

    // Remove the user from the current room mapping
    userRooms.delete(socket.id);

    // Reconnect the user to a new stranger
    if (waitingUser) {
      const newRoom = `${waitingUser}-${socket.id}`;
      socket.join(newRoom);
      io.sockets.sockets.get(waitingUser).join(newRoom);
      userRooms.set(socket.id, newRoom);
      userRooms.set(waitingUser, newRoom);

      io.to(newRoom).emit('system_message', 'You are now connected to a new stranger.');
      waitingUser = null;
    } else {
      waitingUser = socket.id;
      socket.emit('system_message', 'Waiting for a stranger...');
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    if (waitingUser === socket.id) {
      waitingUser = null; // Remove from waiting queue if they were waiting
    }

    const room = userRooms.get(socket.id);
    if (room) {
      socket.leave(room);
      io.to(room).emit('system_message', 'The stranger has disconnected.');
    }

    userRooms.delete(socket.id); // Remove user from room mapping
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
