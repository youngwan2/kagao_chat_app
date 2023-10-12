
const ioEvent=(io)=>{
const { messageFilter } = require("./messageFilter");
const { roomList } = require("./messageFilter");

/* 클라이언트에서 받은 메시지를 일단 1차로 배열로 저장 후
해당 리스트를 인자로 받는 별도의 필터 함수를 활용하여
방별로 메시지를 구분해서 뿌릴 때 사용함. */
let messageList = [];

/* 각 방별 유저리스트 정보를 담는 객체 */
const userList = {
  room1: [],
  room2: [],
  room3: [],
};

// 존재하는 방
const rooms = ["room1", "room2", "room3"];

io.on("connection", (socket) => {
  // 방 선택
  socket.on("roomChoice", (room) => {
    socket.join(rooms[room.index]); // 선택된 방으로 가입

    // 선택된 방으로 접속한 유저 정보를 저장
    userList[`${rooms[room.index]}`].push({
      userId: socket.client.id,
      username: room.username,
    });
    console.log("유저목록:", userList);
    // 해당 유저 정보를 모든 방으로 전송
    socket.emit("access", userList);

    // 각 방에 대한 유저 정보를 업데이트 하려면 개별 방에 유저정보를 한 번 더 보내줘야 한다(현재 까지는 이게 최선).
    for (let i = 0; i < 3; i++) {
      socket.to(`${rooms[i]}`).emit("access", userList);
    }

    // 해당 방에서 유저가 보낸 메시지를 받음
    socket.on(`${rooms[room.index]}`, (messages) => {
      messageList.push({
        id: socket.client.id,
        messages: messages.message,
        username: messages.username,
        date: new Date().toLocaleString(),
        room: messages.group,
      });

      // 채팅방 별로 유저를 구분해주는 함수
      messageFilter(messageList);

      // 선택된 방으로 방목록과 유저목록을 보낸다.
      io.to(`${rooms[room.index]}`).emit(`${rooms[room.index]}`, {
        content: roomList[`${rooms[room.index]}`],
        userList: userList[`${rooms[room.index]}`],
      });
    });

    // 유저가 로그아웃한 결과를 userList 에 반영
    socket.on("disconnect", () => {
      userList[`${rooms[room.index]}`] = userList[
        `${rooms[room.index]}`
      ].filter((data, i) => {
        return data.userId !== socket.client.id;
      });

      for (let i = 0; i < 3; i++) {
        socket.to(`${rooms[i]}`).emit("access", userList);
      }
    });
  });
});

}

module.exports = ioEvent