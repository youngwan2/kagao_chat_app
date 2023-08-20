<template>
  <header class="header">
    <div class="left_username">
      <img class="profile" style="padding: 5px; width: 40px" />
      <span style="font-size: 16px; font-weight: 600" class="username">{{ username }}</span>
    </div>
    <div class="right_option">
      <span
        ><svg
          style="fill: rgb(132, 127, 127)"
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
        >
          <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path
            d="M432 48H208c-17.7 0-32 14.3-32 32V96H128V80c0-44.2 35.8-80 80-80H432c44.2 0 80 35.8 80 80V304c0 44.2-35.8 80-80 80H416V336h16c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32zM48 448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V256H48V448zM64 128H320c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z"
          /></svg></span>
      <span><svg
          style="fill: rgb(132, 127, 127)"
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
        >
          <path
            d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
          /></svg></span>
      <span
        ><svg
          style="fill: rgb(132, 127, 127)"
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 448 512"
        >
          <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path
            d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
          /></svg></span>
    </div>
  </header>
</template>

<script lang="ts">
import { toRef } from 'vue'
export default {
  props: {
    username: String
  },
  setup(props) {
    toRef(props)
  }
}
</script>
<style scoped>
.header {
  background: #303346;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2.5vw;
  border-radius: 10px;
  box-shadow: 2px 3px 9px 1px rgba(35, 34, 34, 0.23);
}

.profile {
  background-image: url('../assets/user.png');
  background-size: cover;
  background-position: center;
}

.header span {
  margin: 8px;
  font-size: 1.2rem;
}

.left_username {
  display: flex;
}
</style>
