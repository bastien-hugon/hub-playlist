var sys = require('sys')
var exec = require('child_process').exec;
var crypto = require('crypto');
/**
 * API Socket.IO 
 */
var music = [];
var history = [];
var title = "NO EVENT";

io.on('connection', function (socket) {

	socket.on('pwd', function(pass){
		var hash = crypto.createHash('sha256').update(pass).digest('base64');
		socket.emit('pwd', hash == "AI58QVGNUtZINunDzzHF8KhXqndjw0o8+PqJPI+sxWk=");
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
		io.emit('nextMusic', music);
		io.emit('updateMusic', music);
	});

	socket.on('updateMusic', function(data){
		music = data;
		io.emit('updateMusic', music);
	});

	socket.on('addMusic', function(data){
		tmp = data.split('/')[3].split('watch?v=')[1];
		music.push(tmp);
		history.push(tmp);
		io.emit('updateMusic', music);
	});

	socket.on('getTitle', function(){
		socket.emit('changeTitle', title);
	});

	socket.on('setTitle', function(data){
		title = data;
		io.emit('changeTitle', title);
	});

	socket.on('restart', function(){
		function puts(error, stdout, stderr) { sys.puts(stdout) };
		exec("reboot", puts);
	});

});