var app = {

	initSpotify: function() {

	},

	getUserToplist: function() {
		require(['$api/toplists'], function(toplists) {

			var list = toplists.Toplist.forCurrentUser();
			list.tracks.snapshot().done(function(tracks) {
			  for (var i = 0; i < tracks.length; i++)
			    app.processTest(tracks.get(i));
			});

		});
	},

	playSpotifyPlaylist: function(playlistURI) {

		require(['$api/models'], function(models) {

		  var playlist = models.Playlist.fromURI(playlistURI);
		  models.player.playContext(playlist);

		});

	},

	parseTasteProfile: function(callback) {

		require(['$api/playlist'], function(playlist) {

			var tasteProfile = playlist.createTemporary("temp");
			for (var i = 0; i < callback.length; i++)
			{
				//callback något
				//var st = callback.i.blah
				st = st.replace("spotify-WW","spotify");
				tasteProfile.tracks.add(models.Track.fromURI(st));

			}
		}

	},

	buildSuggestions: function(energy, valence) {
		$.getJSON('http://developer.echonest.com/api/v4/song/search' +
			'?api_key=FILDTEOIK2HBORODV' +
			'&format=json' +
			'&results=1' +
			'&artist=radiohead' +
			'&bucket=id:spotify-WW&bucket=tracks' +
			'&limit=true' +
			'&max_energy=' + energy +
			'&max_valence=' + valence, function(data) {
		  
			console.log(data);
		});
	},

	processTest: function(wat)
	{
		console.log(wat);
	}
};

$(function() {
	app.initSpotify();
	app.getUserToplist();
	app.buildSuggestions(0.5, 0.5);
});