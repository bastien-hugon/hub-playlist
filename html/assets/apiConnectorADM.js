var socket = io.connect();
var music = [];

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubePlayerAPIReady() {
	socket.emit('getMusic', null);
}

var player;

function onPlayerReady(){
	player.loadVideoById(music[0], 0, "large");
};

function onPlayerStateChange(event) {
	if (event.data == 0) {
		player.loadVideoById(music[1], 0, "large");
		music.shift();
		console.log(music);
		socket.emit('updateMusic', music);
	}
}

socket.on('getMusic', function(data){
	music = data;
	player = new YT.Player('player', {
		height: '360',
		width: '640',
		videoId: data[0],
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
	updateMusic();
});

socket.on('updateMusic', function (data) {
	console.log(music)
	if (music.length == 0) {
		music = data;
		console.log(music)
		player.loadVideoById(music[0], 0, "large");
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

function updateMusic()
{
	$("#songs").html("");

	music.forEach(song => {
		$("#songs").append("<div>"+song+"</div>");
	});
}