<template>
  <div class="container">
    <!-- 좌측 유저 목록 및 검색 영역 -->
    <Aside :room1="room1" :room2="room2" :room3="room3" :totalUsers="totalUsers"></Aside>
    <!-- <Login :username="username" @dataToParent="dataToChild"/> -->

    <!-- 우측 헤더 영역 -->
    <section class="right-container">
      <!-- 로그인 창 -->
      <article :class="modalState" class="login_modal">
        <div
          class="login_inner_con"
          style="position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%)"
        >
          <h2 style="margin: 10px">사용하실 닉네임을 입력해주세요</h2>
          <input
            type="text"
            minlength="2"
            maxlength="5"
            v-model="username"
            @keyup.enter="login"
            placeholder="2자~5자 이내"
          />
          <br /><br />
          <button @click="login" :disabled="username.length < 1">입장</button>
        </div>
      </article>
      <!-- 나가기 아이콘 -->
      <RoomVue @choice="roomChoice" @roomLeave="exit" />

      <!-- 헤더 -->
      <Header :username="username"></Header>

      <!-- 우측 하단 메인의 대화창 영역 -->
      <section class="main" ref="main">
        <ul class="content">
          <li v-for="(item, index) in message.messages" :key="index" :class="message.target[index]">
            <div class="content_profile">
              <div class="content_img"></div>
              <span style="padding-top: 2px;color: gray; font-size: 13px; display: inline-block; line-height: 1;">{{ item.username }}</span>
            </div>
            <span class="content_message">{{ item.messages }}</span>
            <span class="content_createDate">{{ item.date }}</span>
          </li>
        </ul>
      </section>

      <!-- 유저 메시지 입력창 폼 -->
      <form @submit.prevent class="user_input_form">
        <input
          type="text"
          v-model="message.userInput"
          v-show="userState.disabled"
          placeholder="메시지를 입력해주세요."
        />
        <button class="submit_btn" @click="sendMessage" v-show="userState.disabled">
          <svg
            style="fill: white"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 -100 550 580"
          >
            <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M11.1 260.2c-21.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z"
            />
          </svg>
        </button>
      </form>
    </section>
    <article class="input_alarm" :class="userAlarm">
      <span>{{ message.messages[message.messages.length - 1]?.username }}님이 응답하셨습니다.</span>
    </article>
  </div>
</template>

<script lang="ts" setup>
import { io } from 'socket.io-client'
import { reactive, ref } from 'vue'
import Aside from './components/Aside.vue'
import Header from './components/Header.vue'
import RoomVue from './components/RoomVue.vue'

const socket = io('http://localhost:3000')

const username = ref('')
const modalState = ref('modal_on')

type dType = {
  id: string
  messages: string
  username: string
  date: string
}

type Message = {
  messages: dType[]
  userInput: string
  target: string[]
}

// 서버로 부터 받은 메시지목록, 사용자의 입력값 등이 저장된다.
const message = reactive<Message>({
  messages: [] as any,
  userInput: '',
  target: [] // 상대방인지 나인지 구분된 결과 목록이 저장된다.
})

const room = reactive({
  index: 0,
  name: 'room1'
})

const userState = reactive({
  message: '',
  disabled: true
})

const room1 = ref('')
const room2 = ref('')
const room3 = ref('')
const totalUsers = ref('')

const userAlarm = ref('alarm_off')

// 유저가 입장하면 활성화되는 함수
function isEnter() {
  userAlarm.value = 'alarm_on'
  setTimeout(() => {
    userAlarm.value = 'alarm_off'
  }, 3000)
}

// 방선택하는 함수
function roomChoice(roomInfo: { index: number; name: string }) {
  room.index = roomInfo.index
  room.name = roomInfo.name

  socket.emit('roomChoice', { index: room.index, username: username.value })
}

// 소켓을 종료하는 함수
function exit() {
  socket.close()
}

// 서버로 부터 접속한 유저 명단을 받아온다.
socket.on('access', (user) => {
  // 방병로 유저를 분리한다.
  if (user) {
    console.log(user)
    room1.value = user['room1']
    room2.value = user['room2']
    room3.value = user['room3']
  }
})

// 서버에 메시지를 전송하는 함수
function sendMessage() {
  socket.emit(`${room.name}`, {
    message: message.userInput, // 메시지
    username: username.value, // 유저이름
    group: room.name // 소속된 방
  })

  socket.on(`${room.name}`, (userInfo) => {
    message.messages = userInfo.content
    targetUser(userInfo.content) // 타겟이 되는 유저를 분별하기 위한 함수
    isEnter()
  })
}

// 해당 유저가 본인인지 상대방인지 구분하는 함수
function targetUser(content: dType[]) {
  const map = content.map((data: dType) => {
    const targetUser = data.username === username.value ? 'me' : 'others'
    return targetUser
  })
  message.target = map

  setTimeout(() => {
    document.querySelector('.main')?.scrollTo({ top: 10000000 })
    message.userInput = ''
  }, 10)
}

// 로그인 창을 on/off 하는 함수
function onModal() {
  if (modalState.value === 'modal_off') {
    modalState.value = 'modal_on'
  } else {
    modalState.value = 'modal_off'
  }
}

// 로그인 함수로 로그인 시 서버와 소켓을 연결한다.
function login() {
  onModal()
}
</script>
<style scoped>
.container {
  display: flex;
  height: 100vh;
}

li {
  list-style: none;
}
.right-container {
  margin: 10px auto;
  color: white;
  text-align: center;
  display: flex;
  width: 66%;
  flex-direction: column;
  height: 100vh;
}

/* 메인(대화창) */
.main {
  border-radius: 20px;
  margin: 10px 0;
  height: 65%;
  overflow: hidden scroll;
}
.main::-webkit-scrollbar {
  width: 2px;
}

/* form ui */
.user_input_form {
  justify-content: center;
  border-radius: 20px;
  align-items: center;
  display: flex;
  padding: 20px;
  position: fixed;
  bottom: 5px;
  width: 66%;
}

.user_input_form input {
  padding: 23px 20px;
  background: #303346;
  width: 80%;
  min-width: 200px;
  box-shadow:
    inset -2px -2px 5px black,
    inset 1px 1px 1px rgb(32, 30, 30);
  transition: 0.5s;
  border: none;
  border-radius: 10px;
}

.user_input_form input:focus {
  color: black;
  outline: none;
  background: #5577ff;
}

.user_input_form input:focus::placeholder {
  color: white;
}

/* 전송버튼 */
.user_input_form button {
  background: #6785ff;
  box-shadow:
    inset -2px -2px 5px rgb(2, 2, 30),
    inset 2px 2px 5px rgb(108, 111, 198);
  font-size: 18px;
  border: none;
  border-radius: 10px;
  max-height: 60px;
  margin: 0 10px;
  transition: 0.5s;
  padding: 16.5px 18px 16.5px 18px;
}

.user_input_form button:hover {
  cursor: pointer;
}

/* 대화 메시지(본인/타인) UI */

.me {
  display: flex;
  background: rgb(70, 119, 245);
  max-width: 70%;
  position: relative;
  flex-direction: row-reverse;
  right: -25%;
  padding: 1.5vw;
  border-radius: 10px;
  margin: 35px 0;
  border-end-end-radius: 2px;
  box-shadow:
    inset -2px -2px 5px black,
    inset 1px 1px 2px rgb(51, 48, 48);
  animation: appear 1 1s ease;
}

@keyframes appear {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
}

.me .content_profile {
  display: none;
}

.me .content_createDate {
  position: absolute;
  font-size: 10px;
  color: #808186;
  left: 5px;
  bottom: -16px;
}

/* 상대방 */
.others {
  display: flex;
  max-width: 70%;
  align-items: center;
  position: relative;
  right: -6%;
  box-shadow:
    inset -2px -2px 5px black,
    inset 1px 1px 2px rgb(51, 48, 48);
  background: #393e50;
  border-radius: 14px;
  padding: 1.4vw;
  margin: 35px 0;
  border-bottom-left-radius: 2px;
  animation: others 1 1s ease;
}
@keyframes others {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
}

.others .content_profile {
  position: absolute;
  left: -45px;
  margin: 0;
  padding: 0;
  font-size: 14px;
  width: 35px;
  top: 50%;
  transform: translateY(-50%);
  color: black;
  height: 35px;
}

.others .content_createDate {
  position: absolute;
  font-size:10px;
  right: 8px;
  color: #93959b;
  bottom: -17px;
}

.content_profile .content_img {
  background-image: url('../public/avatar.png');
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  width: 100%;
  height: 100%;
}

/* 로그인 모달 창 */
.login_modal {
  position: fixed;
  z-index: 1000000000;
  visibility: hidden;
  box-shadow: 10px 10px 5px 2px rgba(0, 0, 0, 0.28);
  background: #6785ff;
  transition: 1s;
}

.modal_off {
  opacity: 0;
  transition: 1s;
  visibility: hidden;
  left: 0;
  top: 0;
  transform: rotateX(90deg) perspective(600px) translate(0px, 1000px) scale(0);
  transform-origin: top 0%;
  width: 100%;
  bottom: 0;
  right: 0;
}

.modal_on {
  left: 0;
  top: 0;
  transform: rotateX(0) perspective(600px);
  transform-origin: top 100%;
  transition: 1s;
  width: 100%;
  bottom: 0;
  right: 0;
  visibility: visible;
  height: 100%;
  opacity: 1;
}

/* 로그인 모달 인풋 */
.login_modal h2 {
  margin-top: 1.5rem;
}
/* 유저 닉네임 입력창 */
.login_modal input {
  text-align: center;
  box-shadow: inset 0 0 3px 1px rgba(40, 40, 40, 0.727);
  transition: 0.5s ease-in-out;
  padding: 15px 5vw;
  border: none;
  min-width: 280px;
  border-radius: 10px;
  margin-top: 0.5rem;
}

.login_modal input:focus {
  box-shadow: inset 300px 0 0 0 goldenrod;
}

/* 입장 버튼 */
.login_modal button {
  padding: 10px 12px;
  width: 150px;
}

/* 로그인 아이콘 */
.login_icon {
  position: fixed;
  right: 5px;
}

/* 유저 글작성 중 알람 */
.input_alarm {
  position: absolute;
  background: rgba(255, 255, 255, 0.901);
  border-radius: 10px;
  padding: 5px 10px;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.628);
  left: 50%;
  top: 9rem;
  transform: translate(-50%);
}

/* 사용자 입장 시 알림 메시지 */
.alarm_on {
  visibility: visible;
  opacity: 1;
}

.alarm_off {
  visibility: hidden;
  opacity: 0;
}
</style>
