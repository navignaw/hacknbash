var Critter = function (x, y, filename, image) {
	// TODO: generate critter image based on filetype

	var spriteSheet = new createjs.SpriteSheet({
		"images": [image],
		"frames": {width:32, height:32, count:14},
		"animations": {
			// start, end, next, speed
			"stop": [0,0,"stop",1.5],
			"goleft": [0,7,"stop",1],
			"goright": [8,13,"stop",1]
		}
	});

	var critter = new createjs.Sprite(spriteSheet, "stop");
	critter.framerate = 6;
	critter.x = x;
	critter.y = y;
	critter.velocity = {x: 0, y: 0};

	var name = new createjs.Text(filename, "10px Cambria", "#000000");

	name.textAlign = "center";
	name.x = critter.x + 16;
	name.y = critter.y - 12;
	

	function think() {
		var move = Math.random() < 0.8;
		if (!move) {
			//I dun wanna move
			critter.velocity = {x:0, y:0};
		} else if (critter.velocity.x == 0 && critter.velocity.y == 0) {
			//I wanna start movin'
			critter.velocity.x = Math.random() - 0.5;
			critter.velocity.y = Math.random() - 0.5;
		}
	}
		
		
	var update = function() {
		if (critter.paused) {
			if (critter.velocity.x > 0)
				critter.gotoAndPlay("goright");
			else if (critter.velocity.x < 0)
				critter.gotoAndPlay("goleft");
		}

		critter.x += critter.velocity.x;
		critter.y += critter.velocity.y;
		name.x = critter.x + 16;
		name.y = critter.y - 12;
		
		think();
		stayInBounds();
	}

	function stayInBounds() {
		if (critter.x < 0) {
			critter.x = 0;
		} else if (critter.x > $("#canvas")[0].width * 0.63) {
			critter.x = $("#canvas")[0].width * 0.63;
		}

		if (critter.y < 0) {
			critter.y = 0;
		} else if (critter.y > $("#canvas")[0].height * 0.6) {
			critter.y = $("#canvas")[0].height * 0.6;
		}
	}

	return {
		"name": name,
		"sprite": critter,
		"update": update
	};
}