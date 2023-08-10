
<template>
  <header>
    <h1>title</h1>
    <ConnectionState />
    <form @submit.prevent>
      <input type="text" @keyup.enter="sendMessage" />
    </form>
  </header>
</template>

<script lang="ts">
import { io } from 'socket.io-client'
export default {
  setup() {
    const socket = io('http://localhost:3000')

    function sendMessage() {
      console.log('메시지를 보냈다.')

      socket.emit('send',"전달되는지 확인")
    }

    return {
      sendMessage
    }
  }
}
</script>
<style scoped>
</style>
