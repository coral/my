var sp, models, views;

var app = {

	initSpotify: function() {
		sp = getSpotifyApi();
		models = sp.require('$api/models');
		views = sp.require('$api/views');
	},

	buildSuggestions: function() {
		$.getJSON('ajax/test.json', function(data) {
		  var items = [];
		 
		  $.each(data, function(key, val) {
		    items.push('<li id="' + key + '">' + val + '</li>');
		  });
		 
		  $('<ul/>', {
		    'class': 'my-new-list',
		    html: items.join('')
		  }).appendTo('body');
		});
	}
};

$(function() {
	app.initSpotify();
	app.buildSuggestions();
});