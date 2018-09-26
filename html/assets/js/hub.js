function updateMusic() {

	$("#hubsong").html("");
	if (music[0]) {
		$.get("https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id="+ music[0] +"&key=AIzaSyBWS5aaowzg3iRSV0KaDIhlO__KAjcY2hc", {async: false}, function(data){
			url = (data.items[0].snippet.thumbnails.standard !== undefined) ? (data.items[0].snippet.thumbnails.standard.url) : (data.items[0].snippet.thumbnails.default.url);

			html = '<div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s" uk-grid>'
			html +=	'<div class="uk-card-media-left uk-cover-container">'
			html +=	'	<img src="'+url+'" alt="" uk-cover>'
			html +=	'</div>'
			html +=	'<div>'
			html +=	'	<div class="uk-card-body">'
			html +=	'	<br><h3><strong>Now Playing:</strong><br>'+data.items[0].snippet.channelTitle+'</h3>'
			html +=	'		<p>'+data.items[0].snippet.title+'</p><br>'
			html +=	'	</div>'
			html +=	'</div>'
			html += '</div>'
			$("#hubsong").append(html);
		});
	} else {

		html = '<div class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s" uk-grid>'
		html += '	<div class="uk-card-media-left uk-cover-container">'
		html += '	<img src="https://steamcdn-a.akamaihd.net/steam/apps/532200/header.jpg" alt="" uk-cover>'
		html += '		</div>'
		html += '		<div>'
		html += '		<div class="uk-card-body">'
		html += '			<br><h3><strong>Now Playing:</strong><br> Nothing</h3>'
		html += '			<p>Let\'s add a music now !</p><br>'
		html += '		</div>'
		html += '	</div>'
		html += '</div>'
		$("#hubsong").append(html);

	}
}