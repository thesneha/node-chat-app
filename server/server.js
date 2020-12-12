const path =require('path');
const express=require('express');
const socketIO=require('socket.io');
const http =require('http');

const publicPath=path.join(__dirname,'..','public');
console.log(publicPath);

const port =process.env.PORT||3000
const app=express();
var server=http.createServer(app);



//  var server=app.listen(port,()=>{
//   console.log(`app is running on port ${port}`);
// })
var io=socketIO(server);
app.use(express.static(publicPath));

io.on('connection',  (socket)=>{
  console.log('new user connected');


  socket.emit('newMessage', {
    from:'admin',
    text:'welcome to the chat app',
    createdAt:new Date().getTime()
  } );

  socket.broadcast.emit('newMessage', {
    from:'admin',
    text:'new member joined',
    createdAt:new Date().getTime()
  });


  socket.on('createMessage',  function(createMessage){
    console.log('create message', createMessage);
    io.emit('newMessage', {
      from:createMessage.from,
      text:createMessage.text,
      createdAt:new Date().getTime()
    });

    // socket.broadcast.emit('newMessage', {
    //   from:createMessage.from,
    //   text:createMessage.text,
    //   createdAt:new Date().getTime()
    // });
  });

  socket.on('disconnect',  ()=>{
    console.log('user was disconnected');
  });
});

server.listen(port,()=>{
 console.log(`app is running on port ${port}`);
})
