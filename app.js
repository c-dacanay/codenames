const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes");

const app = express();
app.use(index);

const server = http.createServer(app);
server.listen(port, () => console.log(`Listening on port ${port}`));

const io = socketIo(server);

var num = {};
var players = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("joinRoom", (room) => {
    console.log(room);
    roomName = room;
    if (!players[room]) {
      players[room] = [];
      num[room] = 1;
    }
    socket.join(room);
    var player = { number: num[room], socketId: socket.id };
    players[room].push(player);
    console.log(players, "players");
    io.to(room).emit("newPlayer", players[room]);
    num[room]++;
  });
});