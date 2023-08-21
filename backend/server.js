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

app.use(express.static(__dirname + "/dist"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

/* 클라이언트에서 받은 메시지를 일단 1차로 배열로 저장 후
해당 리스트를 인자로 받는 별도의 필터 함수를 활용하여
방별로 메시지를 구분해서 뿌릴 때 사용함. */
let messageList = [];

/* 각 방별 유저리스트 정보를 담는 객체 */
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
    socket.join(rooms[room.index]); // 선택된 방으로 가입

    // 선택된 방으로 접속한 유저 정보를 저장
    userList[`${rooms[room.index]}`].push({
      userId: socket.client.id,
      username: room.username,
    });
    // 해당 유저 정보를 모든 방으로 전송
    socket.emit("access", userList);

    // 각 방에 대한 유저 정보를 업데이트 하려면 개별 방에 유저정보를 한 번 더 보내줘야 한다(현재 까지는 이게 최선).
    socket.to(`${rooms}`).emit("access", userList);
    socket.to(`${rooms[room.index]}`).emit("access", userList);

    // 선택된 방에 대한 메시지를 받음
    socket.on(`${rooms[room.index]}`, (messages) => {
      // 유저가 선택한 방으로 가입시킨다.
      // socket.emit("access", userList);
      socket.to(`${rooms[room.index]}`).emit("access", userList);

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
      socket.to(`${rooms}`).emit("access", userList);
      socket.to(`${rooms[room.index]}`).emit("access", userList);
    });
  });
});

/* 포트 연결 */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(PORT, "열림");
});
