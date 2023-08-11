const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: ["http://localhost:5173", "*"],
});

const PORT = process.env.PORT || 3000;
const messageList = [];

io.on("connection", (socket) => {
  socket.on("send", (messages) => {
    messageList.push({
      id: socket.client.id,
      messages: messages.message,
      username: messages.username._value,
      date: new Date().toLocaleString()
    });
    socket.emit("content", messageList);
  });
});


server.listen(PORT, () => {
  console.log(PORT, "열림");
});



