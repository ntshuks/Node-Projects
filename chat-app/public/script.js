const socket = io();

// Get Join Form input
const join = document.getElementById('join');
const leave = document.getElementById('leave');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const roomInput = document.getElementById('room');
const messageform = document.getElementById('messageform');
const messageInput = document.getElementById('message');
const messageArea = document.getElementById("messagearea");
// Declare username & room with let to extend its scope
let username;
let room;
let RoomJoined;

// Event Listener for join form submit
join.addEventListener('submit', (e) => {
    //prevent page reloading
    e.preventDefault();
    // Only get these values after form is submitted
    username = usernameInput.value;
    const email = emailInput.value;
    room = roomInput.value;
    //create joinroom event to be sent to back end
    console.log(username, email, room);
    socket.emit("joinroom", {username, email, room});
});

// Event Listener for leave submit
leave.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit("leaveroom", username);
});

// Event Listener for message form submit
messageform.addEventListener('submit', (e) => {
   e.preventDefault();
   const message= messageInput.value;
   socket.emit("sendmessage", {message,username});
   // Now clear the input field
   messageInput.value = "";
});

socket.on('welcome', (welcomemsg) => {
    AddContent(welcomemsg);
    // Set HAsjoiend to True
    RoomJoined = room;
});

socket.on('joiner', (roommessage) => {
    AddContent(roommessage);
});

socket.on('sendmessage', (user_message) => {
    AddContent(user_message);
}); 

socket.on("leaver", (leavemessage) => {
    AddContent(leavemessage);
});

socket.on("byebye", (username) => {
    // DOn't reload the page, just empty input boxes and messages 
    // usernameInput.value = "";
    // emailInput.value = "";
    // roomInput.value="holder";
    // messageArea.innerHTML = '';
     location.reload();
});

socket.on("joinerror", (joinedroom) => {
   alert('You have already joined room: ' + joinedroom);
});

socket.on("leaveerror", () => {
    alert('You must join a room before you can leave');
});

socket.on("messageerror", (messageerror) => {
    alert(messageerror);
});

function AddContent (text) {
    const messagecontent = document.createElement("p");
    messagecontent.textContent = text;
    messageArea.appendChild(messagecontent);
}