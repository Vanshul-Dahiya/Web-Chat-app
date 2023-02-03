const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const { Socket } = require("engine.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// run when a client connects
io.on("connection", (socket) => {
  console.log("new socket connection");
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
