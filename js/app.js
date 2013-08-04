var app = {
      function moveFinger(Finger, posX, posY, posZ, dirX, dirY, dirZ) {
        Finger.style.webkitTransform = "translateX("+posX+"px) translateY("+posY+"px) translateZ("+posZ+"px) rotateX("+dirX+"deg) rotateY(0deg) rotateZ("+dirZ+"deg)";
      }
      
	initLeap: function() {
		// Leap controller initialization options
		var controllerOptions = { enableGestures: true };
		var controller = new Leap.Controller(controllerOptions);
		app.controller = controller;

		app.frameHandlerRef = controller.on('animationFrame', app.gotFrame);
		controller.connect();
	},

	gotFrame: function(frame) {
		if (! frame.hands.length) return;


		// draw fingers
		for (var i = 0; i < frame.hands.length; i++) {
			var hand = frame.hands[i];
			for (var i = 0; i < hand.pointables.length; i++) {
				var pointable = hand.pointables[i];

				var pos = pointable.tipPosition;
				console.log(pos);
				var pointX = pos.x + 200;
				var pointY = 400 - pos.y;
				var pointRadius = (pos.z + 200) / 10;

			}
		}
	}
};

$(function() {
	app.initLeap();
});

