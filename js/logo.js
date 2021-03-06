var my_logo;
var width = $(window).width();
var height = $(window).height();
var frames, length;
var running = 1;
var removed = 0;
var logo = {
	initCanvas: function() {
		var group = project.importSVG(document.getElementById('my_logo'));
		my_logo = group.children[0];
		my_logo.position.x = (width/2);
		my_logo.position.y = (height/2)-125;
		length = my_logo.length;
		frames = length/60/3;
	},

	animateCanvas: function() {

	}

};

$(function() {
	logo.initCanvas();
});

function onFrame(event) {
	if(frames*event.count <= length) {
		var circle = new Path.Circle(0,100,8);
		circle.strokeColor = "#FF0000";
		circle.fillColor = "#FF0000";
		circle.position.x = my_logo.getLocationAt(frames*event.count).point.x;
		circle.position.y = my_logo.getLocationAt(frames*event.count).point.y;
	} else {
		if(running)
		{
			$('#canvas').delay(1000).transition({ opacity: 0 },1000, 'ease');
			running = 0;
		} else if (running == 0 && removed == 0) {
			setTimeout(function() {
				$('#canvas').remove();
			}, 3000);
		}
	}
	view.zoom = event.count / 300 + 1;
}