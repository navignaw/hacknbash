var Player = function (image) {

	var KEYCODE_UP = 38;
	var KEYCODE_LEFT = 37;
	var KEYCODE_RIGHT = 39;
	var KEYCODE_DOWN = 40;

	var spriteSheet = new createjs.SpriteSheet({
		"images": [image],
		"frames": {width:32, height:32, count:4, regX: 0, regY:0},
		"animations": {
			// start, end, next, speed
			"stop": [1,1,"stop",1.5],
			"walk": [0,3,"stop",1]
			//swingSword: [9,12,"walk"]
		}
	});
	var player = new createjs.Sprite(spriteSheet, "stop");
	player.framerate = 6;
	player.velocity = {x: 0, y: 0};
	
	var toolbelt = new Array("hand", "sword", "hammer", "scanner");
	var moveDist = 1;
	

	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	function handleKeyDown(event) {
		switch (event.keyCode) {
			case KEYCODE_DOWN:
				player.velocity.y = 4;
				player.direction
				break;
			
			case KEYCODE_UP:
				player.velocity.y = -4;
				break;
			
			case KEYCODE_LEFT:
				player.velocity.x = -4;
				break;
			
			case KEYCODE_RIGHT:
				player.velocity.x = 4;
				break;
		}
	}
		
	function handleKeyUp(event) {
		switch (event.keyCode) {
			case KEYCODE_DOWN:
				player.velocity.y = 0;
				break;
			
			case KEYCODE_UP:
				player.velocity.y = 0;
				break;
			
			case KEYCODE_LEFT:
				player.velocity.x = 0;
				break;
			
			case KEYCODE_RIGHT:
				player.velocity.x = 0;
				break;
		}
	}
		
	var update = function() {
		if (player.paused && (player.velocity.x || player.velocity.y))
			player.gotoAndPlay("walk");

		player.x += player.velocity.x;
		player.y += player.velocity.y;
	}

	return {
		"sprite": player,
		"toolbelt": toolbelt,
		"update": update
	};
}