<template>
  <div class="container">
    <!-- 좌측 유저 목록 및 검색 영역 -->
    <Aside></Aside>

    <!-- 우측 헤더 영역 -->
    <section class="right-container">
      <Header></Header>

      <!-- 우측 하단 메인의 대화창 영역 -->
      <section class="main">
        <ul class="content">
          <li><span>유저가 말함</span> <span>보낸시간</span></li>
          <li><span>내가 말함</span> <span>보낸시간</span></li>
        </ul>
      </section>
      <!-- 유저 메시지 입력창 폼 -->
      <form @submit.prevent class="user_input_form">
        <input type="text" @keyup.enter="sendMessage" :v-model="message.userInput" />
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
import { reactive } from 'vue'
import Aside from './components/Aside.vue'
import Header from './components/Header.vue'

const socket = io('http://localhost:3000')

const message = reactive({
  messages: [],
  userInput: ''
})

function sendMessage() {
  console.log('메시지를 보냈다.')
  socket.emit('send', '전달되는지 확인')
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
  height: 100%;
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
</style>
