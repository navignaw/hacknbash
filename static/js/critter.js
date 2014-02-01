var Critter = function (filename,image) {

	//change to generate originally at random location
	var nextDestX = 100;
	var nextDestY = 100;

	var spriteSheet = new createjs.SpriteSheet({
		"images": [image],
		"frames": {width:32, height:32}, //count:4, regX: nextDestX, regY:nextDestY},
		"animations": {
			// start, end, next, speed
			"stop": [0,0,"stop",1.5],
			"goleft": [0,7,"stop",1],
			"goright": [8,13,"stop",1]
		}
	});

	var critter = new createjs.Sprite(spriteSheet, "stop");
	critter.framerate = 6;
	critter.x = nextDestX;
	critter.y = nextDestY;
	critter.velocity = {x: 0, y: 0};

	var moveDist = 1;

	var name = new createjs.Text(filename,"8px Arial","#000000");

	name.textAlign = "center";
	name.x = critter.x+16;
	name.y = critter.y-12;
	

	function think(){
		var move = (Math.random()<0.9);
		if (!move) {
			//I dun wanna move
			critter.velocity = {x:0, y:0};
		} else if (critter.velocity.x==0 && critter.velocity.y==0) {
			//I wanna start movin'
			critter.velocity.x = Math.floor((Math.random()-0.5));
			critter.velocity.y = Math.floor((Math.random()-0.5));
		} else {
			//Lemme keep movin'
			critter.velocity.x = critter.velocity.x;
			critter.velocity.y = critter.velocity.y;
		}
	}
		
		
	var update = function() {
		if (critter.paused) {
			if (critter.velocity.x>0) { critter.gotoAndPlay("goright"); }
			else if (critter.velocity.x<0) { critter.gotoAndPlay("goleft"); }
		}

		critter.x += critter.velocity.x;
		critter.y += critter.velocity.y;
		name.x = critter.x+16;
		name.y = critter.y-12;
		
		think();
	}

	return {
		"name": name,
		"sprite": critter,
		"update": update
	};
}