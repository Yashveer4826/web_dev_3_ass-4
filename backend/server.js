
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const httpserver = http.createServer(app);

const io = new Server(httpserver, {
  cors: {
    origin: "*",
  },
});

let count = 0;

io.on("connection", (socket) => {
  count++;
  console.log("Active user:", count);

  // Welcome message
  socket.emit("gyankibaat", "Welcome to Socket.IO server");

  // Notify other users
  socket.broadcast.emit("join", "New User Joined");

  // Original event preserved
  socket.on("kuchbhi", (msg) => {
    console.log(msg);
  });

  // Receive chat message and broadcast it to all connected clients
  socket.on("chatMessage", (message) => {
    console.log("Chat Message:", message);

    io.emit("message", message);
  });

  // Original announcement preserved
  io.emit("announcement", "Today is last time we study web dev -3");

  // Disconnect
  socket.on("disconnect", () => {
    count--;
    console.log("Active user:", count);
    socket.broadcast.emit("join", "A User Left");
  });
});

httpserver.listen(8080, () => {
  console.log("Server started on port 8080");
});
