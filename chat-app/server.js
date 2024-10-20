/*
Chat App - using sockt.io



*/

const PORT = process.env.PORT || 5001;
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const server = require('node:http').createServer(app);
const io = require('socket.io')(server);
let manualdisconnect;

// const User = {username, email, room,id};
let userlist = [];

// Static file folder
app.use(express.static('public'));

//Body Parser to allow form data to be accessed
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/', (req,res) => {
   res.render(index.html);
});

app.post('/', (req,res) => {
   console.log(`User: ${req.body.username} Email: ${req.body.email} Room: ${req.body.room}`);
});
  
// Socket io logic
io.on('connection', (socket) => {
   // console.log(socket.id);
    const id = socket.id;
    socket.on("joinroom",({username,email,room}) => {
        // Check to see if user already joing - reject if so
        const result = findUser(id);
        if(result) {
            const joinedroom = result.room;
            socket.emit("joinerror", joinedroom);
        } else {
        const newuser = {username,email,room, id};
        userlist.push(newuser);
        socket.join(newuser.room);
        const welcomemsg = `INFO:: Welcome to the ${room} Room`;
        const roommessage = `INFO:: ${username} has joined the chat in ${room}`;
        console.log("User List after a join event");
        console.log(userlist);
        socket.broadcast.to(room).emit("joiner", roommessage);
        socket.emit("welcome", welcomemsg) }
    });

    socket.on("leaveroom", (username) => {
        console.log("Inside Leave Room");
        console.log(username);
        //const user = username;
        const leaver = findUser2(username);
        console.log(leaver);
        if(!leaver) {
            console.log("No user to leave");
            socket.emit("leaveerror")
        } else {
            console.log("user to leave found");
            //removeUser(result);
            const index = findUserIndex(leaver.id);
            userlist.splice(index,1);
            console.log("User List after manual leave");
            console.log(userlist);
            // Let other users know user has left
            const leavemessage = `INFO:: User ${leaver.username} has manually left the room`
            socket.emit("byebye", leaver);
            socket.to(leaver.room).emit("leaver", leavemessage);
        }
    });

    socket.on("sendmessage", ({message,username}) => {
        // get current user
        const currentuser = findUser2(username);
        // If no current user, throw alert error
        if(!currentuser) {
            const messageerror="You need to be in room to send messages";
            socket.emit("messageerror", messageerror);
        } else {
        const currentusername = currentuser.username;
        const user_message = `${currentusername}: ${message}`;
        console.log('Currentusername use is');
        console.log(currentusername);
        io.to(currentuser.room).emit("sendmessage", (user_message)); }
    });

    socket.on("disconnect", () => {
        // find user in userlist, remove and tell other room users
        console.log("socket that has disconnected: " + socket.id);
        const index = findUserIndex(socket.id);
        const user = findUser(socket.id);
        console.log("print out index of user to be removed");
        console.log(index);
        // remove user
        if (index !== -1) {
            console.log('INDEX to be spliced');
            console.log(index);
            userlist.splice(index,1);
            console.log("User List after splice");
            console.log(userlist);
            // Let other users know user has left
            const leavemessage = `INFO:: User ${user.username} connection reset`
            io.to(user.room).emit("leaver", leavemessage);
        }
        console.log(`User disconnected, socket.id: ${socket.id}`);
    });

});

function findUser(id) {
    // Fuction can search using any property
    const searchObj = userlist.find((user) => user.id === id);
    //console.log('From function');
    //console.log(` SearchObj = ${searchObj}`);
    return (searchObj);
}

function findUser2(username) {
    // Fuction can search using any property
    const searchObj = userlist.find((user) => user.username === username);
    console.log('From function');
    console.log(` SearchObj = ${searchObj}`);
    return (searchObj);
}

function findUserIndex(id) {
    const index = userlist.findIndex((user) => user.id === id);
    return(index);
}

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});