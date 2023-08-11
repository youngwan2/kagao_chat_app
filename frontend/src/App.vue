<template>
  <div class="container">
    <!-- 좌측 유저 목록 및 검색 영역 -->
    <Aside></Aside>

    <!-- 우측 헤더 영역 -->
    <section class="right-container">
      <div :class="modalState" class="login_modal">
        <h2>Login</h2>
        <input type="text" :value="username" @keyup.enter="onModal" />
        <br /><br />
        <button @click="onModal">입장</button>
      </div>
      <button class="login_icon" @click="onModal">로그인</button>
      <Header></Header>

      <!-- 우측 하단 메인의 대화창 영역 -->
      <section class="main" ref="main">
        <ul class="content">
          <li v-for="(item, index) in message.messages" :key="index" :class="message.target[index]">
            <div class="content_profile">
              <div class="content_img"></div>
            </div>
            <span class="content_message">{{ item['messages'] }}</span>
            <span class="content_createDate">{{ item['date'] }}</span>
          </li>
        </ul>
      </section>
      <!-- 유저 메시지 입력창 폼 -->
      <form @submit.prevent class="user_input_form">
        <input type="text" v-model="message.userInput" />
        <button class="submit_btn" @click="sendMessage">
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
  </div>
</template>

<script lang="ts" setup>
import { io } from 'socket.io-client'
import { reactive, ref } from 'vue'
import Aside from './components/Aside.vue'
import Header from './components/Header.vue'

const socket = io('http://localhost:3000')

const username = ref('익명')
const modalState = ref('modal_off')

interface Message {
  messages: [
    {
      id: string
      messages: string
      username: string
      date: string
    }
  ]
  userInput: string
  target: string[]
}

const message: Message = reactive({
  messages: [],
  userInput: '',
  target: []
})

function sendMessage() {
  console.log('메시지를 보냈다.')
  socket.emit('send', { message: message.userInput, username })
}

socket.on('content', (content) => {
  message.messages = content
  console.log(content)
  targetUser(content)
})

// 해당 유저가 본인인지 상대방인지 구분하는 함수
function targetUser(content: string[]) {
  const map = content.map((data: any, i) => {
    const targetUser = data.username === username.value ? 'me' : 'others'
    return targetUser
  })
  message.target = map

  const timeout = setTimeout(() => {
    document.querySelector('.main')?.scrollTo({ top: 10000000 })
    message.userInput = ''
  }, 10)
}

function onModal() {
  if (modalState.value === 'modal_off') {
    modalState.value = 'modal_on'
  } else {
    modalState.value = 'modal_off'
  }
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
  box-shadow: 2px 2px 5px 1px rgb(5, 5, 5);
  background: #303346;
  border-radius: 20px;
  padding: 20px;
  position: fixed;
  bottom: 9px;
  width: 66%;
}

.user_input_form input {
  padding: 20px;
  width: 75%;
  transition: 0.5s;
  border-top-left-radius: 10px;
  border: none;
  border-bottom-left-radius: 10px;
}

.user_input_form input:focus {
  outline: none;
  box-shadow: inset 0 0 3px 1px rgb(9, 45, 162);
}

/* 전송버튼 */
.user_input_form button {
  background: #6785ff;
  box-shadow: inset 0 0 0 0;
  font-size: 18px;
  border: none;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  margin: 0 10px;
  transition: 0.5s;
  padding: 13.5px 15px 17.5px 15px;
}

.user_input_form button:hover {
  box-shadow: inset 300px -300px 5px 2px rgb(49, 96, 213);
  cursor: pointer;
}

/* 대화 메시지(본인/타인) UI */

/* 
            <span class="content_username">{{ item['username'] }}</span>
            <span class="content_message">{{ item['messages'] }}</span>
            <span class="content_createDate">{{ item['date'] }}</span>
            <span class="content_target">{{ message.target[index] }}</span>
*/

/* 나 */
.me {
  display: flex;
  min-width: 230px;
  background: rgb(70, 119, 245);
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.518);
  max-width: 70%;
  position: relative;
  right: -15%;
  padding: 20px;
  border-radius: 14px;
  margin: 30px 0;
  border-end-end-radius: 2px;
}

.me .content_profile {
  border-radius: 50%;
  position: absolute;
  right: -70px;
  background: rgb(90, 79, 79);
  width: 60px;
  top: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: black;
  height: 60px;
}

.me .content_createDate {
  position: absolute;
  right: 0;
  bottom: -23px;
}

/* 상대방 */
.others {
  display: flex;
  max-width: 70%;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.518);
  position: relative;
  right: -6%;
  background: #393e50;
  border-radius: 14px;
  padding: 20px;
  margin: 30px 0;
  border-bottom-left-radius: 2px;
}

.others .content_profile {
  position: absolute;
  left: -70px;
  background: white;
  width: 60px;
  top: 50%;
  transform: translateY(-50%);
  color: black;
  height: 60px;
}

.content_profile .content_img {
  background-image: url('../public/avatar.png');
  background-size: cover;
  background-position: center;
  width: 100%;
  border-radius: 3px;
  height: 100%;
}

/* 로그인 모달 창 */

.login_modal {
  position: fixed;
  visibility: hidden;
  right: 50%;
  left: 50%;
  box-shadow: 10px 10px 5px 2px rgba(0, 0, 0, 0.28);
  border-radius: 20px;
  background: #6785ff;

  transition: 1s;
  width: 300px;
  height: 200px;
}
.modal_off {
  opacity: 0;
}

.modal_on {
  visibility: visible;
  transform: translate(-50%, 40px);
  opacity: 1;
}

/* 로그인 모달 인풋 */
.login_modal h2 {
  margin-top: 1.5rem;
}
.login_modal input {
  box-shadow: inset 0 0 5px 2px black;
  transition: 0.5s ease-in-out;
  padding: 20px;
  border: none;
  margin-top: 0.5rem;
}

.login_modal input:focus {
  box-shadow: inset 300px 0 0 0 goldenrod;
}

/* 로그인 아이콘 */
.login_icon {
  position: fixed;
  right: 5px;
}
</style>
