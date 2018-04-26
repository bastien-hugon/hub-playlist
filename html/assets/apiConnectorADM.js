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

function updateMusic()
{
	$("#songs").html("");

	var i = 0;
	var renders = []
	music.forEach(song => {
		var index = i;
		$.get("https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id="+ song +"&key=AIzaSyBWS5aaowzg3iRSV0KaDIhlO__KAjcY2hc", function(data){
			console.log(data)
			if (!index)
				render  = '<div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin uk-background-secondary" uk-grid>';
			else
				render  = '<div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>';
			render +=	'<div class="uk-card-media-left uk-cover-container">';
			url = (data.items[0].snippet.thumbnails.standard !== undefined) ? (data.items[0].snippet.thumbnails.standard.url) : (data.items[0].snippet.thumbnails.default.url);
			render +=		'<img src="'+url+'" alt="" uk-cover>';
			//render +=		'<canvas width="600" height="400"></canvas>';
			render +=	'</div>';
			render +=	'<div>';
			render +=	'<div class="uk-card-body">';
			if (!index) {
				render +=		'<h4 style="color: white"><strong>Now Playing:</strong><br>';
				render +=		data.items[0].snippet.channelTitle+'</h4>';
			} else {
				render +=		'<h4>'+data.items[0].snippet.channelTitle+'</h4>';
			}
			render +=		'<p>'+data.items[0].snippet.title+'</p>';
			render +=		'</div>';
			render +=	'</div>'
			render +='</div>';
			if (!index)
				render +='<hr class="uk-divider-icon">';
			
			renders[index] = render;
		});
		i++;
	});
	setTimeout(() => {
		renders.forEach(render => {
			$("#songs").append(render);
		})
	}, 200);
}

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
