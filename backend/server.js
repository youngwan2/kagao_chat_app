const { messageFilter } = require("./js/messageFilter");
const { roomList } = require("./js/messageFilter");

const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: [
    "http://localhost:5173",
    "https://port-0-kagao-chat-app-eu1k2lll9au5zx.sel3.cloudtype.app/",
    "*",
  ],
});

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/dist"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
let messageList = [];

const userList = {
  room1: [],
  room2: [],
  room3: [],
  userListTotal: [],
};

// 존재하는 방
const rooms = ["room1", "room2", "room3"];

io.on("connection", (socket) => {
  userList.userListTotal.push(socket.client.id);

  // 방 선택
  socket.on("roomChoice", (room) => {
    userList[`${rooms[room.index]}`].push({
      userId: socket.client.id,
      username: room.username,
    });
    console.log(userList);

    socket.emit("access", userList);
    socket.emit("uid", socket.client.id);

    // 선택된 방에 대한 메시지를 받음
    socket.on(`${rooms[room.index]}`, (messages) => {
      // 유저가 선택한 방으로 가입시킨다.
      socket.join(rooms[room.index]);

      // 유저가 전송한 메시지를 서버단의 메시지 배열에 저장한다.
      messageList.push({
        id: socket.client.id,
        messages: messages.message,
        username: messages.username,
        date: new Date().toLocaleString(),
        room: messages.group,
      });

      // 채팅방 별로 유저를 구분해주는 함수
      messageFilter(messageList);

      io.to(`${rooms[room.index]}`).emit(`${rooms[room.index]}`, {
        content: roomList[`${rooms[room.index]}`],
        userList: userList[`${rooms[room.index]}`],
      });
    });

    // 각 방별로 구분된 유저의 메시지가 담긴 배열을 브라우저로 전송
    socket.on("disconnect", () => {
      userList.userListTotal = userList.userListTotal.filter((user, i) => {
        return user !== socket.client.id;
      });
      userList[`${rooms[room.index]}`] = userList[
        `${rooms[room.index]}`
      ].filter((data, i) => {
        console.log(data.userId);
        return data.userId !== socket.client.id;
      });
      socket.emit("access", userList);
    });
  });
});

server.listen(PORT, () => {
  console.log(PORT, "열림");
});
