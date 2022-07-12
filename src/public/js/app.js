const socket = io();

const welcome = document.getElementById("welcome");
const enterRoom = welcome.querySelector("#enter_room");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = welcome.querySelector("#name input");
  socket.emit("nickname", input.value);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomNameInput = enterRoom.querySelector("#room_name");
  const nicknameInput = enterRoom.querySelector("#name");
  socket.emit("enter_room", roomNameInput.value, nicknameInput.value, showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = "";
  nickname = nicknameInput.value;
  roomNameInput.value = "";
}

enterRoom.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} entered this room.`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left.`);
});

socket.on("new_message", addMessage);
