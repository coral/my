var sp, models, views;

var app = {
	initSpotify: function() {
		sp = getSpotifyApi();
		models = sp.require('$api/models');
		views = sp.require('$api/views');
	},

	animateCanvas: function() {

	}

};

$(function() {
	app.initSpotify();
});