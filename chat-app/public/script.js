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
const roomuserlist = document.getElementById("roomuserlist");
// Declare username & room with let to extend scope
let username;
let room;
let roomusers;

// Event Listener for join form submit
join.addEventListener('submit', (e) => {
    //prevent page reloading
    e.preventDefault();
    // Only get these values after form is submitted
    username = usernameInput.value;
    const email = emailInput.value;
    room = roomInput.value;
    //create joinroom event to be sent to back end
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
   // Make sure there is a message
   if(!message) {
    alert("Please create a message before submitting");
   } else {
   socket.emit("sendmessage", {message,username});
   // Now clear the input field
   messageInput.value = ""; }
});

socket.on('welcome', (welcomemsg) => {
    AddContent(welcomemsg);
    // console.log("List of users in room " + room);
    // console.log(usernamesinroom);
    // roomusers = usernamesinroom;
    // // display room user list
});

socket.on("updateroomlist", (usernamesinroom) => {
    roomusers = usernamesinroom;
    console.log(roomusers);
    //clear list before re populating
    roomuserlist.innerText='';
    for (i=0 ; i < roomusers.length ; i++) {
        let item = document.createElement('li');
         item.textContent = roomusers[i];
         roomuserlist.appendChild(item);
    }
    const item = document.createElement('li');
});

socket.on('joiner', (roommessage) => {
    // Letting other room users know of new joiner
    AddContent(roommessage);
    //roomusers = usernamesinroom;
});

socket.on('sendmessage', (user_message) => {
    AddContent(user_message);
}); 

socket.on("leaver", (leavemessage) => {
    AddContent(leavemessage);
   // roomusers = usernamesinroom;
});

socket.on("byebye", (username) => {
  // Relaod page after user manually leaves
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