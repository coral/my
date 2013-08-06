var sp, models, views;

var app = {

	initSpotify: function() {
		sp = getSpotifyApi();
		models = sp.require('$api/models');
		views = sp.require('$api/views');
	},

	buildSuggestions: function() {
		$.getJSON('http://developer.echonest.com/api/v4/song/search' +
			'?api_key=FILDTEOIK2HBORODV' +
			'&format=json' +
			'&results=1' +
			'&artist=radiohead' +
			'&bucket=id:spotify-WW&bucket=tracks' +
			'&limit=true' +
			'&max_energy=.9' +
			'&max_valence=.1', function(data) {
		  
			console.log(data);
		});
	}
};

$(function() {
	app.initSpotify();
	app.buildSuggestions();
});