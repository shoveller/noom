import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    console.log('3. 소캣을 방에 담는다');
    socket.join(roomName);
    console.log('4. 새로운 소켓이 방에 담겼다는 것을 방 구성원에게 전파한다')
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    console.log('6. 오퍼를 수신했다. 오퍼를 방 구성원에게 전파한다');
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    console.log('10. 답을 받았다. 답을 방 구성원에게 전파한다')
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    console.log('13. web rtc 커넥션을 방 구성원에게 전파한다')
    socket.to(roomName).emit("ice", ice);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);
