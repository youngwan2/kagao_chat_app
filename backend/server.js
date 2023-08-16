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

app.use(express.static(path.join(__dirname, "dist")));
app.get("/", (req, res) => {
  console.log(path.join(__dirname, "/", "dist/"));
  res.sendFile(path.join(__dirname, "/", "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/dist"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
let messageList = [];
const roomList = {
  room1: [],
  room2: [],
  room3: [],
};

const userList = {
  userListByRoom: {
    room1: [],
    room2: [],
    room3: [],
  },
  userList: [],
};

const rooms = ["room1", "room2", "room3"];

const messageFilter = (messageList) => {
  try {
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
  } catch (error) {
    console.log(error);
  }
};

io.on("connection", (socket) => {

  userList.userList.push(socket.client.id);

  socket.on("roomChoice", (room) => {
    socket.on(`${rooms[room]}`, (messages) => {
      // 유저가 선택한 방으로 가입시킨다.
      socket.join(rooms[room]);

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

      io.to(`${rooms[room]}`).emit(
        `${rooms[room]}`,
        roomList[`${rooms[room]}`]
      );
    });
  });

  // 각 방별로 구분된 유저의 메시지가 담긴 배열을 브라우저로 전송
  socket.on("disconnect", () => {
    userList.userList = userList.userList.filter((user, i) => {
      return user !== socket.client.id;
    });
 
    
  });

  socket.emit('access',userList.userList)
});



server.listen(PORT, () => {
  console.log(PORT, "열림");
});

