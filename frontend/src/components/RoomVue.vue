<template>
  <div>
    <div class="room_container" :class="closeState ? 'on' : 'off'">
      <h2 class="title">방목록</h2>
      <hr />
      <ul>
        <li v-for="(_, i) in rooms" :key="i" @click="roomSwitch(i)">{{ roomName[i] }}</li>
      </ul>
      <button @click="windowClose" class="room_icon_inner">닫기</button>
    </div>
    <button @click="windowClose" class="room_icon">방목록</button>
    <button @click="roomLeave" class="room_leave">나가기</button>
    <div>
      <h3>{{ roomName[currentRoomIndex] }} 채팅방</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
  setup(props, context) {
    const rooms = ['room1', 'room2', 'room3']
    const roomName = ['자유', '회의', '기타']
    const currentRoomIndex = ref(0)
    const closeState = ref(true)

    const roomSwitch = (i: number) => {
      context.emit('choice', { index: i, name: rooms[i] })
      currentRoomIndex.value = i
      windowClose()
    }

    const windowClose = () => {
      closeState.value = !closeState.value
    }

    const roomLeave = () => {
      context.emit('roomLeave', currentRoomIndex.value)
      location.reload()
    }
    return {
      rooms,
      roomSwitch,
      windowClose,
      closeState,
      roomName,
      currentRoomIndex,
      roomLeave
    }
  }
}
</script>

<style scoped>
h2 {
  color: black;
  background-color: rgb(255, 255, 255);
  font-size: 3rem;
}

.on {
  transition: 0.5s;
  visibility: visible;
  transform: translate(0) perspective(600);
  animation: appear 1s 1 ease-in-out;
}

@keyframes appear {
  from {
    transform: translate(-1000px, -1000px) skewY(-80deg);
    transform-origin: top top;
    opacity: 0;
  }
}

.off {
  transition: 1s;
  visibility: hidden;
  transform: translate(-5000px) skewX(-45deg);
  opacity: 0;
}
.room_container {
  position: absolute;
  background: #303346;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 110vh;
}
ul {
  margin: 2rem 0 0 0;
  padding: 0;
}
ul li {
  transition: 1s;
  color: black;
  border-radius: 5px;
  background: #6785ff;
  border: none;
  list-style: none;
  max-width: 600px;
  box-shadow: inset 0 2px 2px 1px;
  font-size: 1.5rem;
  margin: 10px auto;
}

ul li:hover {
  color: white;
  cursor: pointer;
  padding: 15px;
  transform: matrix(2px);
  box-shadow: inset 1000px 0 0 0 rgb(120, 121, 133);
}

/* 방 아이콘 */
.room_icon {
  position: fixed;
  right: 5px;
  padding: 2px 6px;
  top: 2.5rem;
}

.room_leave {
  position: fixed;
  right: 5px;
  padding: 2px 6px;
  top: 4.5rem;
}

.room_icon_inner {
  margin-top: 1.5rem;
  box-shadow: 2px 2px 5px 1px;
  width: 100px;
  padding: 10px;
  cursor: pointer;
}
</style>
