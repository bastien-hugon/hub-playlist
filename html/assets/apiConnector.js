var socket = io.connect();
var music = [];

socket.on('updateMusic', function (data) {
	music = data;
	updateMusic();
});

$('#addMusic').click(function(e){
	e.preventDefault();
	if ($("#song").val() != "" && $("#song").val() != null)
		socket.emit('addMusic', $("#song").val());
	$("#song").val('');
	UIkit.modal('#addSong').hide();
});

socket.emit('getMusic', null);
socket.on('getMusic', function(data){
	music = data;
	updateMusic();
})