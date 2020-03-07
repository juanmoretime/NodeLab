// add code here
const socket = io('http://localhost:3000');
let username = prompt("Whats your username?");
//event listeners
window.onload =(e)=>{
    document.querySelector("h3").textContent =  'Chat [ '+username+' ]';
     //user has entered a new message
    document.querySelector("#chatForm").addEventListener('submit', e =>{
        e.preventDefault();
        const entry = document.querySelector('#entry');
        socket.emit('chat from client', entry.value);
        let msg = {message: entry.value, user: username}
        createChatMsg('message-sent',msg);
        entry.value="";
    });
    //user leaves chat
    document.querySelector("#leave").addEventListener('click', e=>{
        socket.emit('user left', username);
        document.querySelector("#chatForm").style.visibility="hidden";
    })
};
//socket handling
socket.emit('username',username);
socket.on('user', msg=>{
    createChatMsg('message-user',msg);
    updateUserList(msg);
});
socket.on('chat from server', msg=>{
   createChatMsg('message-received',msg);
});

//helper functions
function updateUserList(msg){
    document.querySelector("#users ul").innerHTML ="";
    msg.users.forEach(user => {
        const li2 = createUserElement(user);
        document.querySelector("#users ul").appendChild(li2);
    });
}
function createChatMsg(className, msg){
    const li = createMsgData(className, msg);
    document.querySelector("#messages .messages-body ul").appendChild(li);
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
function createMsgData(className, msg){
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