var Inventory = function(name, image){
	var tool;
	var spriteSheet = new createjs.SpriteSheet({
		"images": [image],
		"frames": {width:32, height:32, count:2, regX:0, regY:0},
		"animations": {
			// start, end, next, speed
			"unselected": [0, 0, "unselected", 1],
			"selected": [1, 1, "selected", 1]
		}
	});
	if (name === "disk"){
		tool = new createjs.Sprite(spriteSheet, "selected");
		tool.x = 0;
		tool.y = 0;
	}
	else if (name === "lightsaber") {
		tool = new createjs.Sprite(spriteSheet, "unselected");
		tool.x = 32;
		tool.y = 0;
	}
	return tool;
}
	