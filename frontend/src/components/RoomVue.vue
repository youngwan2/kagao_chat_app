<template>
  <div>
    <div class="room_container" :class="closeState ? 'on' : 'off'">
      <h2 class="title">이용하고자 하는 방을 선택해주세요</h2>
      <p style="padding:5px">※ 만일, 방 변경에 문제가 발생한다면 우측 상단의 나가기 버튼을 클릭 후 다시 시도해주세요</p>
      <p style="padding:5px">※ 방 입장 후 채팅을 한 번 입력해주세요. 그러면 정상적으로 메시지가 표시됩니다. 이 문제는 빠른 시일 내에 개선토록 하겠습니다.</p>
      <ul>
        <li v-for="(_, i) in rooms" :key="i" @click="roomSwitch(i)">{{ roomName[i] }}</li>
      </ul>
    </div>
    <button @click="roomLeave" class="room_leave">나가기</button>
    <div>
      <h3>{{ roomName[currentRoomIndex] }}채팅방</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
  setup(_, context) {
    const rooms = ['room1', 'room2', 'room3']
    const roomName = ['자유', '회의', '기타']
    const currentRoomIndex = ref(0)
    const closeState = ref(true) // 방선택 모달창의 활성화 여부를 체크

    // 사용자가 방을 선택하면 해당 방의 인덱스 번호와 방 이름을 객체에 담아서
    // 부모 컴포넌트인 App.vue 로 데이터를 전달한다.
    const roomSwitch = (i: number) => {
      context.emit('choice', { index: i, name: rooms[i] })
      currentRoomIndex.value = i
      windowClose() // ==> 방선택 모달창을 닫는다
    }

    const windowClose = () => {
      closeState.value = !closeState.value
    }

    const roomLeave =()=>{
      context.emit('roomLeave', currentRoomIndex.value)
      location.href='/'
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
/* 인트로 소개글 */
h2 {
  color: rgb(255, 255, 255);
  padding: 30px 0 0 0;
}

.on {
  transition: 0.5s;
  opacity: 1;
  visibility: visible;
}


.off {
  transition: 1s;
  visibility: hidden;
  transform: translate(-5000px) skewX(-45deg);
  opacity: 0;
}
.room_container {
  position: absolute;
  padding-top: 5rem;
  background: #6785ff;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 110vh;
}
ul {
  margin: 1rem 0 0 0;
  padding: 0;
}
ul li {
  transition: 1s;
  color: black;
  position: relative;
  border-radius: 5px;
  background: white;
  border: none;
  list-style: none;
  max-width: 600px;
  box-shadow: inset 0 2px 2px 1px rgba(0, 0, 0, 0.466);
  font-size: 1.5rem;
  margin: 10px auto;
}

ul li:hover {
  color: rgb(44, 44, 44);
  cursor: pointer;
  padding: 12px;
  box-shadow: inset 1000px 0 0 0 rgb(255, 255, 255);
}

ul li::before {
  content: '';
  width: 0%;
  position: absolute;
  bottom: 5px;
  transition: 0.5s;
  left: 50%;
  transform: translate(-50%);
}

ul li:hover::before {
  content: '';
  border-bottom: 3px ridge red;
  width: 8%;
}

/* 방 아이콘 */

.room_leave {
  position: fixed;
  z-index: 100000;
  right: 1rem;
  border: none;
  border-radius: 10px;
  box-shadow: inset -2px -2px 5px rgb(11, 11, 12);
  background: rgb(70, 70, 86);
  color:white;
  padding:8px 10px;
  top: 2rem;
}

.room_leave:hover {
  cursor: pointer;
  background: rgb(106, 105, 105);
}

.room_icon_inner {
  margin-top: 1.5rem;
  border: none;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.658);
  border-radius: 10px;
  width: 100px;
  padding: 10px;
  cursor: pointer;
}

.room_icon_inner:hover {
  background: #bdbdbd;
}
</style>
