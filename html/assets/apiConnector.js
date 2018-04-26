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

function updateMusic()
{
	$("#songs").html("");

	var i = 0;
	var renders = []
	music.forEach(song => {
		var index = i;
		$.get("https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id="+ song +"&key=AIzaSyBWS5aaowzg3iRSV0KaDIhlO__KAjcY2hc", function(data){
			if (!index)
				render  = '<div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin uk-background-secondary" uk-grid>';
			else
				render  = '<div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>';
			render +=	'<div class="uk-card-media-left uk-cover-container">';
			render +=		'<img src="'+data.items[0].snippet.thumbnails.standard.url+'" alt="" uk-cover>';
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

socket.emit('getMusic', null);
socket.on('getMusic', function(data){
	music = data;
	updateMusic();
})