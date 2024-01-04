const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

// 방 인원 수 바꾸기
function paintRoomName(newCount){
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
}

// 메세지 추가
function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

// 메세지 보내기
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_msg", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

// 닉네임 설정
function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  const value = input.value;
  socket.emit("nickname", value);
}

// 방 화면 설정
function showRoom(newCount) {
  welcome.hidden = true;
  room.hidden = false;
  paintRoomName(newCount);
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

// 방 들어가기
function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

// 입장 이벤트
socket.on("welcome", (user, newCount) => {
  paintRoomName(newCount);
  addMessage(`${user}님이 입장하셨습니다.`);
});

// 퇴장 이벤트
socket.on("bye", (user, newCount) => {
  paintRoomName(newCount);
  addMessage(`${user}님이 퇴장하셨습니다.`);
});

socket.on("new_msg", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if(rooms.length == 0){
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
