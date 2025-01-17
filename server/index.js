const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "https://kwickchat-adils-projects-30626c51.vercel.app" }, // React frontend origin
});

let waitingUsers = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When user joins the chat
  socket.on("join", () => {
    if (waitingUsers.length > 0) {
      const partner = waitingUsers.pop();
      socket.emit("paired", partner.id);
      partner.emit("paired", socket.id);

      socket.partner = partner;
      partner.partner = socket;
    } else {
      waitingUsers.push(socket);
    }
  });

  // Sending messages
  socket.on("message", (msg) => {
    if (socket.partner) {
      socket.partner.emit("message", msg);
    }
  });

  // User disconnect
  socket.on("disconnect", () => {
    waitingUsers = waitingUsers.filter((user) => user.id !== socket.id);
    if (socket.partner) {
      socket.partner.emit("disconnected");
      socket.partner.partner = null;
      socket.partner = null;
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
