var socket= io();

socket.on('connect',  function(){
  console.log('new user connected');

  // socket.emit('createMessage',  {
  //   from:'sneha',
  //   text:'hey this mail is for avani'
  // });
});

socket.on('newMessage',  function(newMessage){
  console.log('new message', newMessage);
});

socket.on('disconnect',  function(){
  console.log('disconnected from server');
});

// socket.on('newMessage',  function(welcomeMessage){
//   console.log('welcome to the chat app',welcomeMessage);
// });
//
// socket.on('newMessage',  function(welcomeMessage){
//   console.log('new member joined ',welcomeMessage);
// });
