require(['$api/models', '$views/image#Image'], function(models, Image) {
 
});

var controller = new Leap.Controller({enableGestures: true});
      controller.loop(function(frame) {
        latestFrame = frame;
        document.getElementById('out').innerHTML =  "<div>"+ latestFrame.dump()+"</div>";
      });
      controller.on('ready', function() {
          console.log("ready");
      });