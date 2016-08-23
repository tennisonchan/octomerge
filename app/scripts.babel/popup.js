'use strict';

console.log('\'Allo \'Allo! Popup');


$('<iframe/>', {
  id: 'octomerge-iframe',
  src: ENV.HOST
})
.append('<p/>', {
  text: 'Your browser does not support iframes.'
})
.appendTo('body');