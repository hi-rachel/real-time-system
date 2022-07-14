const socket = io();

const welcome = document.getElementById("welcome");
const enterRoom = welcome.querySelector("#enter_room");
const room = document.getElementById("room");
const changeNickname = document.querySelector("#nameChange");
const setting = document.querySelector("#setNickname span");
const changeCompleted = document.querySelector("#nameChange button");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
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

function showRoom(newCount) {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room Name : ${roomName} (Participating User : ${newCount})`;
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
  const h4 = room.querySelector("h4");
  h4.innerText = `Your nickname : ${nickname}`;
  const title = document.querySelector("header");
  title.style.display = "none";
}

function handleSetting() {
  changeNickname.style.display = "block";
}

function handleChangeCompleted() {
  changeNickname.style.display = "none";
}

function handleNewnameSubmit(event) {
  event.preventDefault();
  const newNameInput = room.querySelector("#nameChange input");
  nickname = newNameInput.value;
  socket.emit("nickname", nickname);
  const h4 = room.querySelector("#setNickname h4");
  h4.innerText = `Your nickname: ${nickname}`;
  newNameInput.value = "";
}

enterRoom.addEventListener("submit", handleRoomSubmit);

setting.addEventListener("click", handleSetting);

changeCompleted.addEventListener("click", handleChangeCompleted);

changeNickname.addEventListener("submit", handleNewnameSubmit);

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} entered this room.`);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} left.`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = `🍦 ${room}`;
    roomList.append(li);
  });
});
