var sys = require('sys')
var exec = require('child_process').exec;

/**
 * API Socket.IO 
 */
var music = [];
io.on('connection', function (socket) {

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