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

		require(['$api/models'], function(models) {

			var tasteProfilePromise = models.Playlist.createTemporary("temp").done(adder);
			function adder(tasteProfile) {
				var songs = callback.response.songs;
				tasteProfile.load("tracks").done(tracksLoaded)
				function tracksLoaded()
				{
					for (var i = 0; i < songs.length; i++)
					{
						var st = songs[i].tracks[0].foreign_id;
						st = st.replace("spotify-WW","spotify");

						tasteProfile.tracks.add(models.Track.fromURI(st));
						

					}
					
				}
			}
			
		});

	},

	buildSuggestions: function(minenergy, maxenergy, minvalence, maxvalence) {
		$.getJSON('http://developer.echonest.com/api/v4/song/' +
			'search?api_key=7XGOU94ICDTSF1A2I' +
			'&format=json' + 
			'&results=10' +
			'&max_energy=' + maxenergy +
			'&min_energy=' + minenergy +
			'&min_valence=' + minvalence +
			'&max_valence=' + maxvalence +
			'&bucket=id:spotify-WW&bucket=tracks&limit=true'
			, function(data) {
		  
			app.parseTasteProfile(data);
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
	app.buildSuggestions(0.5, 0.8, 0.5, 0.8);
});