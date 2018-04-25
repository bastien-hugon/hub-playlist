/**
 * API Socket.IO 
 */
var music = [];
io.on('connection', function (socket) {

	socket.on('getMusic', function(data){
		socket.emit('getMusic', music);
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
});