// first reference required modules
const path = require('path');
const parser = require('body-parser');
const express = require('express');
let users = [];
// create an express app
const app = express();
// tell node to use json and HTTP header features in body-parser
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

//listen for socket communication
const server = require('socket.io');
const io = new server(3000);
//on new connection log to console
io.on('connection', socket => {
    console.log('new connection made with client');
    // client has sent a new user has joined message
    socket.on('username', msg => {
        let id = Math.floor(Math.random() * 70)+1;
        const user = {username: msg, id: id};
        users.push(user);
        console.log('new user: ' + msg);
        // attach passed username with this communication socket
        socket.username = msg;
        const obj = { message: "Has joined", user: msg, users: users };
        io.emit('user', obj);
    });
    //send to all but not sending client
    socket.on('chat from client', msg=>{
        socket.broadcast.emit('chat from server', {user: socket.username, message: msg});
    });
    socket.on('user left', msg=>{
        console.log("user left: "+msg);
        const filtered = users.filter(person=>{return person.username != msg})
        users = filtered;
        const obj = {message: "Has Left", user: msg, users: users};
        io.emit('user', obj);
    })
});


const provider = require('./scripts/data-provider.js');
provider.retrieveCompanies(app);
// handle requests for static resources
app.use('/static', express.static(path.join(__dirname,'public')));
app.use('/socket.io', express.static(path.join(__dirname,'/node_modules/socket.io-client/dist/')));
// Use express to listen to port
let port = 8080;
app.listen(port, () => {
 console.log("Server running at port= " + port);
});
