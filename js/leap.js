$(function(){
  var fingerIds,
      fingers = {},
      wHeight = $(window).height();

  var setMoodPosition = (function(){
    var $colour = $('#colour'),
        $moodChooser = $('#mood-chooser'),
        $valance = $('#valence'),
        $energy = $('#energy'),
        height = $moodChooser.height(),
        width = $moodChooser.width(),
        left = $moodChooser.position().left,
        right = width + left,
        top = $moodChooser.position().top,
        bottom = height + top;
        
Firmin.rotate3d($moodChooser[0], {
    x:     0.5,
    z:     0.3,
    angle: 60
});

    return function(posX, posY){

      var valancy = (posX - left) / width,
          energy = 1 - ((posY - top) / height);

      if(posX > left && posX < right && posY > top && posY < bottom) {

        $valance.text('valance: ' + valancy);
        $energy.text('energy: ' + energy);

        $colour.css('color', 'hsl(' + (234 + 360 - Math.round(valancy * 200)) + ',' + Math.round(energy * 80) + '%, 50%)');

      }
    }

  }());

  Leap.loop(function(frame) {

    fingerIds = {};

    for (var pointableId = 0, pointableCount = frame.pointables.length; pointableId != pointableCount; pointableId++) {
      var pointable = frame.pointables[pointableId];
      var posX = (pointable.stabilizedTipPosition[0]*3)+400;
      var posY = (wHeight-(pointable.stabilizedTipPosition[1]*3))+200;
      var posZ = (pointable.stabilizedTipPosition[2]*3)-400;
      var dirX = -(pointable.direction[0]*90);
      var dirY = -(pointable.direction[1]*90);
      var dirZ = (pointable.direction[2]*90);
      var finger = fingers[pointable.id];

      if(pointableId === 0) setMoodPosition(posX, posY);

      if (!finger) {
        var fingerDiv = document.getElementById("finger").cloneNode(true);
            fingerDiv.setAttribute('id',pointable.id);
            fingerDiv.style.backgroundColor='#'+Math.floor(Math.random()*16777215).toString(16);
            document.getElementById('container').appendChild(fingerDiv);
            fingers[pointable.id] = pointable.id;
      } else {
        var fingerDiv =  document.getElementById(pointable.id);
        if (typeof(fingerDiv) != 'undefined' && fingerDiv != null) {
          $(fingerDiv).css({left:posX,top:posY});
          //moveFinger(fingerDiv, posX, posY, posZ, dirX, dirY, dirZ);

        }
      }
      fingerIds[pointable.id] = true;
    }

    for (fingerId in fingers) {
      if (!fingerIds[fingerId]) {

        var fingerDiv =  document.getElementById(fingers[fingerId]);
        fingerDiv.parentNode.removeChild(fingerDiv);

        delete fingers[fingerId];
      }
    }


  });

});