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

socket.on('newLocationMessage',  function(message){
  var li=jQuery('<li></li>');
  var a =jQuery('<a target="_blank">my current location</a>');
  li.text(`${message.from}:  `);
  a.attr('href',message.url);
  li.append(a);

jQuery('#messages').append(li);
});










socket.on('disconnect',  function(){
  console.log('disconnected from server');
});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();

  var messageTextBox=jQuery('[name=message]');
  socket.emit('createMessage',  {
    from:'User',
    text:messageTextBox.val()
  },function(){
    //console.log('got it',data);
    messageTextBox.val('');
  });
})



var locatioButton =jQuery('#send-location');
locatioButton.on('click',function(){
  if (!navigator.geolocation) {
    return alert('geolocation not suppported by browser');
  }
  locatioButton.attr('disabled','disabled').text('Sending location.....');

  navigator.geolocation.getCurrentPosition(function(position){
    locatioButton.removeAttr('disabled').text('Send location');//this one is not usefull
    socket.emit('createLocationMessage', {
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    });
    //locatioButton.removeAttr('disabled').text('Sending location.....');

  },function () {
    locatioButton.removeAttr('disabled').text('Send location');
    alert('unable to get geolocation');
  });

});
