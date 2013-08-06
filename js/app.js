var minenergy, maxenergy, minvalence, maxvalence;

var app = {

	buildSuggestions: function(energy, valence, cb) {
		
		if(energy <= 0.1) {
			minenergy = energy;
		} else {
			minenergy = energy - 0.1;
		}

		if(energy >= 0.9) {
			maxenergy = energy;
		} else {
			maxenergy = energy + 0.1;
		}

		if(valence <= 0.1) {
			minvalence = valence;
		} else {
			minvalence = valence - 0.1;
		}

		if(valence >= 0.9) {
			maxvalencez = valence;
		} else {
			maxvalencez = valence + 0.1;
		}


		require(['$api/toplists'], function(toplists) {
			var an = new Array();
			var list = toplists.Toplist.forCurrentUser();
			list.artists.snapshot().done(function(artist) {
			  	for (var i = 0; i < 4; i++){
					an.push(artist.get(i).name);
				}
				app.queryEchonest(an, cb);
			});

		});
	},

	playSpotifyPlaylist: function(playlistURI) {

		require(['$api/models'], function(models) {

			var playlist = models.Playlist.fromURI(playlistURI);
			models.player.playContext(playlist);

		});

	},

	parseTasteProfile: function(callback, cb) {

		require(['$api/models'], function(models) {

			var tasteProfilePromise = models.Playlist.createTemporary("temp").done(adder);
			function adder(tasteProfile) {
				var songs = callback.response.songs;
				tasteProfile.load("tracks").done(tracksLoaded);
				function tracksLoaded()
				{
					for (var i = 0; i < songs.length; i++)
					{
						var st = songs[i].tracks[0].foreign_id;
						st = st.replace("spotify-WW","spotify");
						tasteProfile.tracks.add(models.Track.fromURI(st));

					}

					tasteProfile.tracks.snapshot(0, 100).done(function(t){
            app.presentSongs(t, cb);
          });

				}
			}

		});

	},

	presentSongs: function(t, cb) {
		console.log(t.toArray());
		cb(t.toArray());
	},

	fetchBiometrics: function(cb) {
		$.getJSON('http://77.80.253.74/files/oa/f.php', function(data) {
				cb(data);
		});
	},

	queryEchonest: function(artists, cb) {
		var add;
		for(var i = 0; i < artists.length; i++)
		{
			if (add != null)
			{
				add = add + "&artist=" + artists[i];
			} else {
				add = "&artist=" + artists[i];
			}

		}

		app.fetchBiometrics(function(biometrics){
			console.log(biometrics);
			$.getJSON('http://developer.echonest.com/api/v4/playlist/' +
				'static?api_key=7XGOU94ICDTSF1A2I' +
				add +
				'&format=json' +
				'&results=10' +
				'&type=artist-radio' +
				'&max_energy=' + maxenergy +
				'&min_energy=' + minenergy +
				'&min_valence=' + minvalence +
				'&max_valence=' + maxvalence +
				'&bucket=id:spotify-WW&bucket=tracks&limit=true'
				, function(data) {
					app.parseTasteProfile(data, cb);
			});
		});
	}
};

$(function() {
	app.buildSuggestions(0.8, 0.9);
});