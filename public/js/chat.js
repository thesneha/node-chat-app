var socket= io();

function scrollToBottom(){
  var messages =jQuery('#messages');
  var newMessage =messages.children('li:last-child');

  var clientHeight =messages.prop('clientHeight');
  var scrollTop =messages.prop('scrollTop');
  var scrollHeight =messages.prop('scrollHeight');
  var newMessageHeight=newMessage.innerHeight();
  var lastMessageHeight=newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
  {
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect',  function(){
  var params= jQuery.deparam(window.location.search);

  socket.emit('join', params , function (err){
    if(err){
      alert(err);
      window.location.href='/';
    }
    else {
      console.log('no error');
    }
  });

  // socket.emit('createMessage',  {
  //   from:'sneha',
  //   text:'hey this mail is for avani'
  // });
});

socket.on('newMessage',  function(newMessage){
  var formattedTime =moment(newMessage.createdAt).format('h:mm a');
  var template= jQuery('#message-template').html();
  var html=Mustache.render(template,{
    text: newMessage.text,
    from:newMessage.from,
    createdAt:formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();

  // var formattedTime =moment(newMessage.createdAt).format('h:mm a');
  // var li=jQuery('<li></li>');
  // li.text(`${newMessage.from} ${formattedTime}: ${newMessage.text}`);
  //  jQuery('#messages').append(li);
});

socket.on('newLocationMessage',  function(message){
  var formattedTime =moment(message.createdAt).format('h:mm a');
  var template= jQuery('#location-message-template').html();
  var html=Mustache.render(template,{
    from:message.from,
    url:message.url,
    createdAt:formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();


  // var li=jQuery('<li></li>');
  // var a =jQuery('<a target="_blank">my current location</a>');
  // li.text(`${message.from} ${formattedTime}:  `);
  // a.attr('href',message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
});


socket.on('updateUserList',function(users){
  //console.log('users list' ,users);

  var ol=jQuery('<ol></ol>');
  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });
   jQuery('#users').html(ol);
  //jQuery('#users').append(ol);

});

socket.on('disconnect',  function(){
  console.log('disconnected from server');
});

jQuery('#message-form').on('submit',function(e){
  e.preventDefault();

  var messageTextBox=jQuery('[name=message]');
  socket.emit('createMessage',  { 
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
