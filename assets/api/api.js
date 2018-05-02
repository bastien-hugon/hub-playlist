var sys = require('sys')
var exec = require('child_process').exec;
var crypto = require('crypto');
/**
 * API Socket.IO 
 */
var music = [];
io.on('connection', function (socket) {

	socket.on('pwd', function(pass){
		var hash = crypto.createHash('sha256').update(pass).digest('base64');
		socket.emit('pwd', hash == "BgMEpx4tNo19/i1I+qUFURv392zFmyFiQ0jEj2XHDbA=");
	});

	socket.on('pause', function(){
		io.emit('pause', true);
	});

	socket.on('play', function(){
		io.emit('play', true);
	});

	socket.on('setVolume', function(data){
		io.emit('setVolume', data);
	});

	socket.on('getMusic', function(data){
		socket.emit('getMusic', music);
	});

	socket.on('nextMusic', function(data){
		io.emit('updateMusic', music);
		io.emit('nextMusic', music);
	});

	socket.on('updateMusic', function(data){
		music = data;
		io.emit('updateMusic', music);
	});

	socket.on('addMusic', function(data){

		tmp = data.split('/')[3].split('watch?v=')[1];
		music.push(tmp);
		io.emit('updateMusic', music);
	});

	socket.on('restart', function(){
		function puts(error, stdout, stderr) { sys.puts(stdout) }
		exec("reboot", puts);
	});

});