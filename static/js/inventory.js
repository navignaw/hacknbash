var Inventory = function(name, image){
	var tool;
	var spriteSheet = new createjs.SpriteSheet({
		"images": [image],
		"frames": {width:32, height:32, count:2, regX:0, regY:0},
		"animations": {
			// start, end, next, speed
			"selected": [0, 0, "selected", 1],
			"unselected": [1, 1, "unselected", 1]
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
