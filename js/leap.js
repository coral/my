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

    displaySuggestions = function(suggestions) {

      $tracksDiv = $('<div id="tracks"></div>');

      console.log(suggestions);

      tracks = suggestions;

      models.player.playTrack(suggestions[0]);

      for (var i = 0, l = suggestions.length; i !== l; i++) {

        if(suggestions[i].image && suggestions[i].name && suggestions[i].artists) {

          $tracksDiv.append('<div><span class="track-name">' +
            suggestions[i].name + '</span><br><span class="artist-name">' +
            suggestions[i].artists[0].name + '</span><div class="background" style="background-image:url(' +
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

        var trackIndex;

        if(posX > left && posX < right && posY > top && posY < bottom) {

          if(energy === undefined || Math.abs(energy - (1 - ((posY - top) / height))) > 0.01 || Math.abs(valancy - ((posX - left) / width) > 0.01)) {

            clearTimeout(timeout);

            $decideBar.css({'-webkit-transition': 'width 0', 'width': 0 });


            if(page === 'trackList') {

              trackIndex = Math.floor(left*10) + (Math.floor(top*10) * 10);

              $tracks.removeClass('active')[trackIndex].classList.add('active');

            }

            _.defer(function(){ $decideBar.css({'-webkit-transition': 'width 2000ms', 'width': '100%' }); });

            timeout = setTimeout(function(){


              if(page === 'moodChooser') {

                console.log('sending', valancy, energy);

                app.buildSuggestions(valancy, energy, displaySuggestions);

                page = 'trackList';

                document.body.classList.add('decided');

                $decideBar.css({'-webkit-transition': 'width 0', 'width': 0 });

              } else if(page === 'trackList') {

                $tracks.removeClass('active');

                models.player.playTrack(tracks[trackIndex]);

                $decideBar.css({'-webkit-transition': 'width 0', 'width': 0 });

              }

              clearTimeout(timeout);

            }, 2000);

          }

          left = valancy = (posX - left) / width;

          top = (posY - top) / height;

          valancy = (posX - left) / width;

          energy = 1 - top;

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
            $decideBar.css({'-webkit-transition': 'width 0', 'width': 0 });
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