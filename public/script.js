const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// when we get the message from server side
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // scroll down everyTime we get a new msg
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
// implement messaging -> when msg is typed , emit it to server and have it send back
chatForm.addEventListener("submit", (e) => {
  // form automatically submits to a file , we stop that from happening using .preventDefault
  e.preventDefault();

  // get text input (message text)
  const msg = e.target.elements.msg.value;

  // emit message to server
  socket.emit("chatMessage", msg);

  // clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
  ${message.textMessage}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
