const socket = io('')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const new_user = new Audio('./audio/new.mp3');

if (messageForm != null) {
  let name = prompt('What is your name?')
  if (name == null || name.trim() == "") {
      appendChat("You", " joined", "center")
      fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => socket.emit('new-user', roomName, data.ip));
  }
  else{
    appendChat("You", " joined", "center")
    socket.emit('new-user', roomName, name)
  }

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    if (message.trim() != "") {
      appendChat("You: ", message, "right")
      socket.emit('send-chat-message', roomName, message)
      messageInput.value = ''
    }
  })
}

// socket.on('room-created', room => {
//   // const roomElement = document.createElement('div')
//   // roomElement.innerText = room
//   // const roomLink = document.createElement('a')
//   // roomLink.href = `/${room}`
//   // roomLink.innerText = 'join'
//   // roomContainer.append(roomElement)
//   // roomContainer.append(roomLink)

//   localStorage.setItem(`You have successfully created a temp-private ChatRoom with code: "${room}"`, )
//   alert(`You have successfully created a temp-private ChatRoom with code: "${room}"`)
// })

socket.on('invalid-code', room => {
  alert(`Invalid Code !!\nNo ChatRoom with code: ${room}`)
})

socket.on('chat-message', data => {
  appendChat(data.name + ": ", data.message, "left")
})

socket.on('user-connected', name => {
  appendChat(name, " joined", "center")
  setTimeout(() => {
    new_user.play();
  }, 5000);
})

socket.on('user-disconnected', name => {
  appendChat(name, " left", "center")
})

function appendChat(client, message, position) {
  const messageElement = document.createElement('div')
  messageElement.style.textAlign = position;
  messageElement.innerHTML = `<div class="bubble"><b>${client}</b>${message}</div>`
  messageContainer.append(messageElement)
}
