var fingers = {};
var wHeight = $(window).height();
Leap.loop(function(frame) {

	var fingerIds = {};

        for (var pointableId = 0, pointableCount = frame.pointables.length; pointableId != pointableCount; pointableId++) {
          var pointable = frame.pointables[pointableId];
          var posX = (pointable.stabilizedTipPosition[0]*3)+400;
          var posY = (wHeight-(pointable.stabilizedTipPosition[1]*3))+200;
          var posZ = (pointable.stabilizedTipPosition[2]*3)-400;
          var dirX = -(pointable.direction[0]*90);
          var dirY = -(pointable.direction[1]*90);
          var dirZ = (pointable.direction[2]*90);
          var finger = fingers[pointable.id];
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