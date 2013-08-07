$(function(){

  require([
    '$api/models',
    '$api/location#Location',
    '$api/search#Search',
    '$api/toplists#Toplist',
    '$views/buttons',
    '$views/list#List',
    '$views/image#Image'
  ], function(models, Location, Search, Toplist, buttons, List, Image) {

    var timeout,
        displaySuggestions,
        setMoodPosition,
        page = 'cover',
        wHeight = $(window).height(),
        fingerColor = '#fff',
        $tracks,
        tracks,
        $moodChooser = $('#mood-chooser'),
        $decideBar = $('#decide-bar'),
        $moodBar = $('#mood-bar'),
        $fingers = $('.finger');

    document.addEventListener("keydown", function(e) {

      if(e.keyCode === 32) {

        document.body.classList.remove('decided');

        $('#tracks').remove();

        $tracks = false;

        page = 'moodChooser';

      }
    }, false);

    displaySuggestions = function(suggestions) {

      $tracksDiv = $('<div id="tracks"></div>');

      console.log(suggestions);

      tracks = suggestions;

      for (var i = 0, l = suggestions.length; i !== l; i++) {

        if(suggestions[i].image && suggestions[i].name && suggestions[i].artists) {

          $tracksDiv.append('<div><span class="track-name">' +
            suggestions[i].name + '</span><div class="background" style="background-image:url(' +
            suggestions[i].image + ')""></div></div>');

        }

      }

      $tracksDiv.appendTo('#container');

      $tracks = $tracksDiv.find('> div');

    };

    setMoodPosition = (function(){
      var $body = $(document.body),
          $colour = $('#colour'),
          $valance = $('#valence'),
          $energy = $('#energy'),
          height = $body.height(),
          width = $body.width(),
          left = $body.position().left,
          right = width + left,
          top = $body.position().top,
          bottom = height + top,
          left,
          top,
          valancy,
          energy;

      return function(posX, posY){

        var trackIndex, $track;

        left = valancy = (posX - left) / width;

        top = (posY - top) / height;

        if(posX > left && posX < right && posY > top && posY < bottom) {

          if(page === 'trackList' && $tracks) {

            trackIndex = Math.floor(left*10) + (Math.floor(top*7) * 10);

            $tracks.filter('.active').removeClass('active');

            $track = $tracks[trackIndex];

            if($track) $track.classList.add('active');

          }

          if(energy === undefined || Math.abs(energy - (1 - ((posY - top) / height))) > 0.05 || Math.abs(valancy - ((posX - left) / width) > 0.05)) {

            valancy = (posX - left) / width;

            energy = 1 - top;

            clearTimeout(timeout);

            $decideBar.css({'transition-duration': '0, 0','transition-delay': '0, 0', 'width': 0, 'background-color': 'red' });

            _.defer(function(){ $decideBar.css({
              'transition-property': 'width, background-color',
              'transition-duration': '2000ms, 200ms',
              'transition-timing-function': 'ease, ease',
              'transition-delay': '0, 1800ms',
              'width': '100%',
              'background-color': '#00DA00'
              });
            });

            timeout = setTimeout(function(){

              if(page === 'moodChooser') {

                console.log('sending', valancy, energy);

                app.buildSuggestions(valancy, energy, displaySuggestions);

                page = 'trackList';

                document.body.classList.add('decided');

                $decideBar.css({'transition-duration': '0, 0','transition-delay': '0, 0', 'width': 0, 'background-color': 'red' });

              } else if(page === 'trackList') {

                trackIndex = Math.floor(left*10) + (Math.floor(top*7) * 10);

                if(tracks[trackIndex].uri) models.player.playTrack(tracks[trackIndex]);

                $decideBar.css({'transition-duration': '0, 0','transition-delay': '0, 0', 'width': 0, 'background-color': 'red' });


              }

              clearTimeout(timeout);

            }, 2000);

          }

          if(page === 'moodChooser') {

            if(energy < 0.3) {
              if(valancy < 0.3) $moodChooser[0].className = 'icon-sad';
              else if(valancy > 0.7) $moodChooser[0].className = 'icon-happy';
              else $moodChooser[0].className = 'icon-tongue';
            } else if(energy > 0.7) {
              if(valancy < 0.3) $moodChooser[0].className = 'icon-angry';
              else if(valancy > 0.7) $moodChooser[0].className = 'icon-laugh';
              else $moodChooser[0].className = 'icon-wink';
            } else {
              if(valancy < 0.3) $moodChooser[0].className = 'icon-confused';
              else if(valancy > 0.7) $moodChooser[0].className = 'icon-cool';
              else $moodChooser[0].className = '';
            }

            fingerColor = 'hsl(' + (234 + 360 - Math.round(valancy * 200)) + ',' + (10 + Math.round(energy * 70)) + '%, 50%)';

          }

        }
      }

    }());

    Leap.loop(function(frame) {

      for (var pointableId = 0, pointableCount = 5; pointableId != pointableCount; pointableId++) {

        if(!frame.pointables[pointableId]) {

          if(pointableId === 0) {
            clearTimeout(timeout);
            $moodChooser.attr('class', '');
            $decideBar.css({'transition-duration': '0, 0','transition-delay': '0, 0', 'width': 0, 'background-color': 'red' });
            if($tracks) $tracks.filter('.active').removeClass('active');
          }

          $($fingers[pointableId]).css('opacity', '0');

        } else {

        var pointable = frame.pointables[pointableId];
          var posX = (pointable.stabilizedTipPosition[0]*3) + 400;
          var posY = wHeight-(pointable.stabilizedTipPosition[1]*3) + 200;

          if(pointableId === 0) {
            setMoodPosition(posX, posY);
            if(document.body.classList[0] === 'cover') {
              document.body.classList.remove('cover');
              page = 'moodChooser';
            }
          }

          $moodBar.css('background-color', fingerColor);

          $($fingers[pointableId]).css({opacity:'1',left:posX,top:posY,'background-color':fingerColor});

        }

      }


    });

  });

});