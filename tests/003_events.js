console.log('-= started =-')

let events = require('events');

var myEmitter = new events.EventEmitter();



myEmitter.on('someEvent', function(msg){
	console.log(msg)
})


setTimeout(function(){
	myEmitter.emit('someEvent', 'Hello there!')
}, 2000)


