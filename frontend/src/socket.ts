// https://socket.io/how-to/use-with-vue
import { reactive } from 'vue'
import { io } from 'socket.io-client'

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
})

// 소켓을 연결할 url
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000'

export const socket = io(URL)

// 연결 상태에 따른 state 변경
socket.on('connect', () => {
  state.connected = true
})

socket.on('disconnect', () => {
  state.connected = false
})

socket.on('foo', (...args) => {
  state.fooEvents.push(args)
})

socket.on('bar', (...args) => {
  state.barEvents.push(args)
})

/* 
개발하는 동안 서버에서 CORS를 활성화해야 합니다.

const io = new Server({
  cors: {
    origin: "http://localhost:8080"
  }
});

*/
