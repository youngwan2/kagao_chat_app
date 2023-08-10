const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: ["http://localhost:5173","*"],
});

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("유저와 연결됨");
  socket.on('send',(message)=>{
    console.log("유저가 보낸 메시지:",message)
  })
});

server.listen(PORT, () => {
  console.log(PORT, "열림");
});
