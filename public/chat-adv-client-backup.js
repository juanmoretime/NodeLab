// add code here
const socket = io('http://localhost:3000');
    let username = prompt("Whats your username?");
    window.onload =(e)=>{
        document.querySelector("h3").textContent =  'Chat [ '+username+' ]';
         //user has entered a new message
        document.querySelector("#chatForm").addEventListener('submit', e =>{
            e.preventDefault();
            const entry = document.querySelector('#entry');
            //send message to server
            socket.emit('chat from client', entry.value);
            let msg = {message: entry.value, user: username}
            const li = createChatFromClientMsg(msg);
            document.querySelector("#messages .messages-body ul").appendChild(li);
            entry.value="";
        });
        document.querySelector("#leave").addEventListener('click', e=>{
            socket.emit('user left', username);
            document.querySelector("#chatForm").style.visibility="hidden";
        })
    };
    //const header = document.querySelector("h3").textContent =  'Chat['+username+']';
    socket.emit('username',username);
    socket.on('user joined', msg=>{
        const li = createUserMsg(msg);
        document.querySelector("#messages .messages-body ul").appendChild(li);
        //add user to list of users and photo by updating
        updateUserList(msg);
    });
    socket.on('user left', msg=>{
        const li = createUserMsg(msg);
        document.querySelector("#messages .messages-body ul").appendChild(li);
        //update user list
        updateUserList(msg);
    });
    socket.on('chat from server', msg=>{
        const li = createChatFromServerMsg(msg);
        document.querySelector("#messages .messages-body ul").appendChild(li);
    });

function updateUserList(msg){
    document.querySelector("#users ul").innerHTML ="";
    msg.users.forEach(user => {
        const li2 = createUserElement(user);
        document.querySelector("#users ul").appendChild(li2);
    });
}
function createUserMsg(msg){
    const li = createMsgData(msg, "message-user");
    return li;
}
function createUserElement(user){
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = `https://randomuser.me/api/portraits/med/women/${user.id}.jpg`;
    img.alt = "avatar";
    const div = document.createElement('div');
    div.className= "name";
    div.innerHTML = `<p> ${user.username} </p> <p> Online </p>`;
    li.appendChild(img);
    li.appendChild(div);
    return li;
}
function createChatFromServerMsg(msg){
    const li = createMsgData(msg, "message-received");
    return li;
}
function createChatFromClientMsg(msg){
    const li = createMsgData(msg, "message-sent");
    return li;
}
function createMsgData(msg, className){
    const datetime =dateFormat();
    const li = document.createElement("li");
    li.className = className;
    const p1 = document.createElement("p");
    p1.className="message-data";
    p1.innerHTML = msg.user+ "<span> "+datetime+" </span>";
    const p2 = document.createElement("p");
    p2.className ="message-text";
    p2.textContent = msg.message;
    li.appendChild(p1);
    li.appendChild(p2);
    return li;
}
function dateFormat(){
    let date = new Date ();
    let day = date.toDateString();
    let time = date.toLocaleTimeString();
    return day+" "+time;
}