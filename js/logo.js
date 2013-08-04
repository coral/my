var my_logo;
var width = $(window).width();
var height = $(window).height();
var frames, length;
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
	}
	view.zoom = event.count / 300 + 0.1;
}