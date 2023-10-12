const roomList = {
    room1: [],
    room2: [],
    room3: [],
  };

// 각 방별로 유저를 분리한다.
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


module.exports = {roomList, messageFilter}

