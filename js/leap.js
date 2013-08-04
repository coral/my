var cb = {

	initCanvas: function() {
		cb.paper = Raphael("viz", 640, 480);
	},

	initLeap: function() {
		// Leap controller initialization options
		var controllerOptions = { enableGestures: true };
		var controller = new Leap.Controller(controllerOptions);
		cb.controller = controller;

		cb.frameHandlerRef = controller.on('animationFrame', cb.gotFrame);
		controller.connect();
	},

	gotFrame: function(frame) {
		if (! frame.hands.length) return;

		var paper = cb.paper;
		var paperWidth = $("#viz").width();
		var paperHeight = $("#viz").height();
		paper.clear();

		// draw fingers
		for (var i = 0; i < frame.hands.length; i++) {
			var hand = frame.hands[i];
			for (var i = 0; i < hand.pointables.length; i++) {
				var pointable = hand.pointables[i];

				var pos = pointable.tipPosition;
				var pointX = pos.x + 200;
				var pointY = 400 - pos.y;
				var pointRadius = (pos.z + 200) / 10;

				var circle = paper.circle(pointX, pointY, pointRadius);
				circle.attr("stroke", "#00c");
			}
		}
	}
};

$(function() {
	cb.initCanvas();
	cb.initLeap();
});

