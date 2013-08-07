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
        wHeight = $(window).height(),
        fingerColor = '#fff',
        $moodChooser = $('#mood-chooser'),
        $decideBar = $('#decide-bar'),
        $moodBar = $('#mood-bar'),
        $fingers = $('.finger');

    displaySuggestions = function(suggestions) {

      console.log(suggestions);

      models.Track.fromURI(suggestions[0].uri).load('name').done(function(track) {
        console.log(track.uri + ': ' + track.name.decodeForText());
        document.getElementById('track-list').innerHTML = track.name.decodeForHtml();
      });

    };

    var setMoodPosition = (function(){
      var $colour = $('#colour'),
          $valance = $('#valence'),
          $energy = $('#energy'),
          height = $moodChooser.height(),
          width = $moodChooser.width(),
          left = $moodChooser.position().left,
          right = width + left,
          top = $moodChooser.position().top,
          bottom = height + top,
          valancy,
          energy;

      return function(posX, posY){

        if(posX > left && posX < right && posY > top && posY < bottom) {


          if(energy === undefined || Math.abs(energy - (1 - ((posY - top) / height))) > 0.01 || Math.abs(valancy - ((posX - left) / width) > 0.01)) {

            clearTimeout(timeout);

            $decideBar.css({'-webkit-transition': 'width 0', 'width': 0 });

            _.defer(function(){ $decideBar.css({'-webkit-transition': 'width 2000ms', 'width': '100%' }); });

            timeout = setTimeout(function(){

              document.body.classList.add('decided');

              console.log('sending', valancy, energy);

              app.buildSuggestions(valancy, energy, displaySuggestions);

            }, 2000);

          }

          valancy = (posX - left) / width;

          energy = 1 - ((posY - top) / height);

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
          if(document.body.classList[0] === 'cover') document.body.classList.remove('cover');
        }

        $moodBar.css('background-color', fingerColor);

        $($fingers[pointableId]).css({opacity:'1',left:posX,top:posY,'background-color':fingerColor});

        }

      }


    });

  });

});