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
  var li=jQuery('<li></li>');
  li.text(`${newMessage.from}: ${newMessage.text}`);

jQuery('#messages').append(li);
});

socket.on('disconnect',  function(){
  console.log('disconnected from server');
});




jQuery('#message-form').on('submit',function(e){
  e.preventDefault();

  socket.emit('createMessage',  {
    from:'User',
    text:jQuery('[name=message]').val()
  },function(){
    //console.log('got it',data);
  });



})
