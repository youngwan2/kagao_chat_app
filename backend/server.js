const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: ["http://localhost:5173", "*"],
});

const PORT = process.env.PORT || 3000;

// app.use(express.static(__dirname+'/dist'))
// app.get('/',(req,res)=>{
//   res.sendFile(path.join(__dirname,'dist','index.html'))
// })
let messageList = [];

const roomList = {
  room1: [],
  room2: [],
  room3: [],
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
  // console.log("접속한 유저:",socket.id)

  socket.on("roomChoice", (room) => {
    socket.on(`${rooms[room]}`, (messages) => {
      // 유저가 선택한 방으로 가입시킨다.
      socket.join(rooms[room]);

      // 유저가 전송한 메시지를 서버단의 메시지 배열에 저장한다.
      messageList.push({
        id: socket.id,
        messages: messages.message,
        username: messages.username,
        date: new Date().toLocaleString(),
        room: messages.group,
      });

      // 채팅방 별로 유저를 구분해주는 함수
      messageFilter(messageList);

      // id 가 강퇴인 유저의 대화목록은 제외한다.
      roomList[`${rooms[room]}`] = roomList[`${rooms[room]}`].filter(
        (data, i) => {
          return data.id !== "강퇴";
        }
      );

      console.log(roomList[`${rooms[room]}`]);
      io.to(`${rooms[room]}`).emit(
        `${rooms[room]}`,
        roomList[`${rooms[room]}`]
      );

      // 각 방별로 구분된 유저의 메시지가 담긴 배열을 브라우저로 전송
      socket.on("disconnect", () => {
        console.log("나간유저:", socket.id);

        socket.emit("exit", socket.id);
      });
    });
  });
});

server.listen(PORT, () => {
  console.log(PORT, "열림");
});
