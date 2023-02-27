const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { Socket } = require("engine.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// run when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // socket.emit() emits to single client that is connecting
    // emit event back and forth /msgs in this case
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));
    // catch this on client side -> script.js

    // Broadcast when a user connects , to everyone (using broadcast.emit()) except user
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, ` ${user.username} has joined the chat`)
      );

    // send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    //  emit message to everyone i.e client [ io.emit() ]
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      // io.emit() broadcasts to every single user
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      // send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
