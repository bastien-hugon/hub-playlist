var socket = io.connect();
var music = [];
var player;

// ROLES: 0 => Normal, 1 => Player, 2 => Admin

var tag = document.createElement('script');
var firstScriptTag = document.getElementsByTagName('script')[0];

tag.src = "https://www.youtube.com/player_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubePlayerAPIReady() {
	socket.emit('getMusic', null);
}

function onPlayerReady(){
	player.loadVideoById(music[0], 0, "large");
}

function onPlayerStateChange(event) {
	if (event.data == 0) {
		player.loadVideoById(music[1], 0, "large");
		music.shift();
		socket.emit('updateMusic', music);
	}
}

socket.on('getMusic', function(data){
	music = data;
	player = new YT.Player('player', {
		height: '480',
		width: '100%',
		videoId: data[0],
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
	updateMusic();
});

socket.on('nextMusic', function(data){
	if (ROLE == 1) {
		player.loadVideoById(music[0], 0, "large");
		player.playVideo();
	}
});

socket.on('updateMusic', function (data) {
	if (music.length == 0 && ROLE == 1) {
		music = data;
		player.loadVideoById(music[0], 0, "large");
		player.playVideo();
	}
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

$('#next').click(function(e){
	e.preventDefault();
	music.shift();
	socket.emit('updateMusic', music);
	socket.emit('nextMusic', null);
})

$('#restart').click(function(e){
	e.preventDefault();
	socket.emit('restart', null);
});

$('#play').click(function(e){
	e.preventDefault();
	socket.emit('play', null);
});

socket.on('play', function(){
	if (ROLE == 1)
		player.playVideo();
});

$('#pause').click(function(e){
	e.preventDefault();
	socket.emit('pause', null);
});

socket.on('pause', function(){
	if (ROLE == 1)
		player.pauseVideo();
});

$('#volume-input').on('change', function () {
	socket.emit('setVolume', $(this).val());
});

socket.on('setVolume', function(data){
	if (ROLE == 1)
		player.setVolume(data);
});