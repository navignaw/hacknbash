var Portal = function (x, y, dirs, path_to_graphics) {

	var spriteSheet = new createjs.SpriteSheet({
		"images": ["static/graphics/portal.png"],
		"frames": {width:32, height:32, count:4, regX: 0, regY:0},
		"animations": {
			// start, end, next, speed
			"animate": [0,3,"stop",1.5],
		}
	});
	var port = new createjs.Sprite(spriteSheet, "animate");
  port.x = x;
  port.y = y;
	port.framerate = 6;
  var targetDir = ""
  
	function enter() {
    console.log("door entered");
    displayDirWindow();
	}

  function displayDirWindow() {
    $("#canvas").fadeOut();
    console.log("fade?");
    for (var i=0; i < dirs.length; i++) {
      $("#dirDiv").append(dirs[i]);
    }
    $("#dirDiv").fadeIn();
    $("#dirSelected").click(function () {
      targetDir = $("#dirDiv option:selected");
      console.log(targetDir.text());
      $("#dirDiv").fadeOut();
      $("#canvas").fadeIn();
    })
  } 

	return {
    "enter": enter,
    "sprite": port,
		"targetDir": targetDir
	};
}
