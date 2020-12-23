const path =require('path');
const express=require('express');
const socketIO=require('socket.io');
const http =require('http');
const {generateMessage,generateLocationMessage} =require('./utils/message');
const {isRealString} =require('./utils/validation');
const {Users} =require('./utils/users');

const publicPath=path.join(__dirname,'..','public');
console.log(publicPath);

const port =process.env.PORT||3000
const app=express();
var server=http.createServer(app);

//  var server=app.listen(port,()=>{
//   console.log(`app is running on port ${port}`);
// })
var io=socketIO(server);
var users=new Users();
app.use(express.static(publicPath));


io.on('connection',  (socket)=>{
  console.log('new user connected');

  socket.on('join',(params,callback)=>{
    if (!isRealString(params.name) || !isRealString(params.room)) {
       return callback('name and room and required');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    io.to(params.room).emit('updateUserList',users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin','welcome to chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined the room`));
    callback();
  });

  socket.on('createMessage',  function(createMessage,callback){
    console.log('create message', createMessage);
    io.emit('newMessage', generateMessage(createMessage.from,createMessage.text));
    callback('this is from server');
    // socket.broadcast.emit('newMessage', generateMessage(createMessage.from,createMessage.text));
    // callback('this is from server');

    // socket.broadcast.emit('newMessage', {
    //   from:createMessage.from,
    //   text:createMessage.text,
    //   createdAt:new Date().getTime()
    // });
  });

  socket.on('createLocationMessage',  (coords)=>{
      io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude,coords.longitude));
  });

  socket.on('disconnect',  ()=>{
    console.log('user was disconnected');
    var user= users.removeUser(socket.id);
    if (user) {

      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));

    }
  });

});

server.listen(port,()=>{
 console.log(`app is running on port ${port}`);
})
