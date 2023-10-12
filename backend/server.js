
const ioEvent = require('./js/io')
const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: [
    "http://localhost:5173",
    "https://port-0-kagao-chat-app-eu1k2lll9au5zx.sel3.cloudtype.app/",
    "https://kagao-chat-app.vercel.app/",
    "*",
  ],
});

app.use(express.static(__dirname + "/dist"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

ioEvent(io)

/* 포트 연결 */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(PORT, "열림");
});
