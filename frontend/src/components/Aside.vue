<template>
  <div class="outer_container">
    <aside class="aside" :class="display">
      <div style="width: 100%; height: 100vh">
        <h2 style="text-align: center; margin-top: 3rem">유저목록</h2>
        <ul class="aside_userlist">
          <h3>자유채팅방({{ room1?.length }})</h3>
          <li v-for="(info, i) in room1" :key="i">
            <img src="../assets/user.png" alt="프로필" class="profile" width="50" height="50" />
            <div>
              <p style="margin: 15px 0 0 0">{{ info.username }}</p>
            </div>
          </li>
        </ul>
        <ul class="aside_userlist">
          <h3>회의채팅방({{ room2?.length }})</h3>
          <li v-for="(info, i) in room2" :key="i">
            <img src="../assets/user.png" alt="프로필" class="profile" width="50" height="50" />
            <div>
              <p style="margin: 15px 0 0 0">{{ info.username }}</p>
            </div>
          </li>
        </ul>
        <ul class="aside_userlist">
          <h3>기타채팅방({{ room3?.length }})</h3>
          <li v-for="(info, i) in room3" :key="i">
            <img src="../assets/user.png" alt="프로필" class="profile" width="50" height="50" />
            <div>
              <p style="margin: 15px 0 0 0">{{ info.username }}</p>
            </div>
          </li>
        </ul>
      </div>
      <button class="display" @click="offDisplay">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
          <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path
            d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
          />
        </svg>
      </button>
    </aside>
    <button v-show="!displayState.display" class="display outer_display" @click="onDisplay">
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
        <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
        <path
          d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue'

export default {
  props: {
    room1: Array,
    room2: Array,
    room3: Array,
    totalUsers: Array
  },

  setup() {
    const totalUserCount = ref(0)
    const displayState = reactive({
      display: false
    })

    let display = ref('off')

    function offDisplay() {
      display.value = 'off'
      displayState.display = !displayState.display
    }

    function onDisplay() {
      display.value = 'on'
      displayState.display = !displayState.display
    }

    return {
      offDisplay,
      onDisplay,
      displayState,
      display,
      totalUserCount
    }
  }
}
</script>
<style scoped>
h3 {
  padding: 0 10px;
}
/* 컴포넌트 전체 컨테이너 */
.outer_container {
  opacity: 0.9;

  position: fixed;
  z-index: 1000;
  min-width: 30%;
  color: white;
  max-width: 30%;
  width: 100%;
  margin: 10px 10px 0 10px;
}
li {
  list-style: none;
}

/* 내부 컨테이너 */
.aside {
  box-shadow: 2px 2px 5px 1px rgb(5, 5, 5);
  position: relative;
  color: white;
  justify-content: space-around;
  display: flex;
  background: #303346;
  width: 100%;
  min-width: 300px;
  max-width: 400px;
  border-radius: 20px;
  transition: 1s;
  overflow: auto scroll;
}

.aside.on {
  transform: translate(0);
  visibility: visible;
  opacity: 1;
}

.aside.off {
  transform: translate(-800px);
  visibility: hidden;
  opacity: 0;
}

.aside::-webkit-scrollbar {
  width: 5px;
}
/* 검색영역 */
.aside_search {
  margin: 10px auto;
  width: 90%;

  border-radius: 20px;
  background: white;
  text-align: center;
}

/* 돋보기 역할 */
.aside_search label {
  position: relative;
  color: black;
  bottom: -3px;
  left: -3%;
}
.aside_search input {
  padding: 15px;
  border: none;
  background: transparent;
  border-radius: 10px;
  width: 80%;
}

.aside_search input:focus {
  outline: none;
}

/* 유저리스트 영역 */
.aside_userlist {
  padding-left: 0;
  margin-top: 2.25rem;
}

.aside_userlist li {
  margin: 10px 13px;
  box-shadow: inset -2px -2px 5px rgb(21, 21, 21);
  padding: 20px 0;
  border-radius: 15px;
  background: #3a3e56;
  display: flex;
}

.aside_userlist li img {
  border-radius: 50%;
  background: black;
  margin: 5px;
}

.aside_userlist li div {
  margin-left: 5px;
}

/* 디스플레이 컨트롤 버튼 */
.aside .display {
  cursor: pointer;
  border: none;
  padding: 0 8px;
  box-shadow:
    inset -1px -1px 5px black,
    inset 3px 3px 5px rgb(61, 59, 59);
  position: sticky;
  z-index: 10000;
  min-height: 100%;
  top: 20px;
  font-weight: 700;
  border-radius: 10px;
  transition: 0.5s;
}


.aside .display svg {
  transform: rotate(180deg);
}

.outer_display {
  border: none;
  transition: 0.5s;
  position: fixed;
  left: 0;
  box-shadow:
    inset -1px -1px 5px black,
    inset 3px 3px 5px rgb(61, 59, 59);
  top: 0;
  min-height: 100%;
  height: 100%;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
}

.outer_display:hover {
  font-size: 25px;
  cursor: pointer;
}
</style>
