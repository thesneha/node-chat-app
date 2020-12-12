var socket= io();

socket.on('connect',  function(){
  console.log('new user connected');

  socket.emit('createMessage',  {
    to:'avani',
    text:'hey this mail is for avani'
  });
});

socket.on('newMessage',  function(newMessage){
  console.log('new email', newMessage);
});

socket.on('disconnect',  function(){
  console.log('disconnected from server');
});
