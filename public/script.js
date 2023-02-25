const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const socket = io();

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
  div.innerHTML = `     <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
  ${message.textMessage}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
