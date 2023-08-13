const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: ["http://localhost:5173","https://port-0-kagao-chat-app-eu1k2lll9au5zx.sel3.cloudtype.app", "*"],
});

const PORT = 5000;
app.use(express.static(path.join(__dirname, "dist")));
app.get("/", (req, res) => {
  console.log(path.join(__dirname, "/", "dist/"));
  res.sendFile(path.join(__dirname, "/", "dist", "index.html"));
});

const messageList = [];

const roomList = {
  room1: [],
  room2: [],
  room3: [],
};

const rooms = ["room1", "room2", "room3"];

const messageFilter = (messageList, messages) => {
  // console.log(messageList[messageList.length - 1]);

  switch (messageList[messageList.length - 1].room) {
    case "room1":
      roomList.room1[roomList.room1.length] =
        messageList[messageList.length - 1];
      break;
    case "room2":
      roomList.room2[roomList.room2.length] =
        messageList[messageList.length - 1];
      break;
    case "room3":
      roomList.room3[roomList.room3.length] =
        messageList[messageList.length - 1];
  }
  console.log(messageList);
};

io.on("connection", (socket) => {
  socket.on("leave", (index) => {
    socket.leave(rooms[index]);
  });
  socket.on("roomChoice", (room) => {
    socket.on(`${rooms[room]}`, (messages) => {
      socket.join(rooms[room]);
      console.log(socket.rooms);

      messageList.push({
        id: socket.client.id,
        messages: messages.message,
        username: messages.username,
        date: new Date().toLocaleString(),
        room: messages.group,
      });

      messageFilter(messageList, messages);
      io.to(`${rooms[room]}`).emit(
        `${rooms[room]}`,
        roomList[`${rooms[room]}`]
      );
    });
  });
});

server.listen(PORT, () => {
  console.log(PORT, "열림");
});
