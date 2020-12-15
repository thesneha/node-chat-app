 const moment =require('moment');

 var date=moment();
 console.log(date.format());
 console.log(date.format('MMM'));
 date.add(1,'year');
 console.log(date.format('MMM YYYY'));
 console.log(date.format('LT'));
  console.log(date.format('h:mm a'));




// console.log(new Date().getDate());
// console.log(new Date().getMonth());
