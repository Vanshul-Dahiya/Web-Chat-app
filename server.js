const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { Socket } = require("engine.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// run when a client connects
io.on("connection", (socket) => {
  // socket.emit() emits to single client that is connecting
  // emit event back and forth /msgs in this case
  socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));
  // catch this on client side -> script.js

  // Broadcast when a user connects , to everyone (using broadcast.emit()) except user
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "User has joined the chat")
  );

  // runs when client disconnects
  socket.on("disconnect", () => {
    // io.emit() broadcasts to every single user
    io.emit("message", formatMessage(botName, "User has left the chat"));
  });

  // listen for chatMessage
  socket.on("chatMessage", (msg) => {
    //  emit message to everyone i.e client
    io.emit("message", formatMessage("USER", msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
