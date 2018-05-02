var socket = io.connect();
var music = [];

//var password = prompt("Admin Password:");

//socket.emit('pwd', password);

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubePlayerAPIReady() {
	socket.emit('getMusic', null);
}

var player;

//socket.on('pwd', function(data){
//	console.log(data);
//	if (data == true) {

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
			player.loadVideoById(music[0], 0, "large");
			updateMusic();
		});

		socket.on('updateMusic', function (data) {
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
			player.playVideo();
		});

		$('#pause').click(function(e){
			e.preventDefault();
			socket.emit('pause', null);
		});

		socket.on('pause', function(){
			player.pauseVideo();
		});

		$('#volume-input').on('change', function () {
			socket.emit('setVolume', $(this).val());
		});

		socket.on('setVolume', function(data){
			player.setVolume(data);
		});

