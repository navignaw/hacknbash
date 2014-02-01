var Player = function (image) {

	var KEYCODE_UP = 38;
	var KEYCODE_LEFT = 37;
	var KEYCODE_RIGHT = 39;
	var KEYCODE_DOWN = 40;

	var DIRECTION = {
		UP: 0,
		DOWN: 1,
		LEFT: 2,
		RIGHT: 3
	};

	var MOVE_SPEED = 2;

	var spriteSheet = new createjs.SpriteSheet({
		"images": [image],
		"frames": {width:32, height:32, count:16, regX:0, regY:0},
		"animations": {
			// start, end, next, speed
			"stop": [1, 1, "stop", 1.5],
			"walk_down": [0, 3, "walk_down", 1],
			"walk_left": [4, 7, "walk_left", 1],
			"walk_right": [8, 11, "walk_right", 1],
			"walk_up": [12, 15, "walk_up", 1]
			//swingSword: [16, 19, "walk"]
		}
	});

	var player = new createjs.Sprite(spriteSheet, "stop");
	player.framerate = 4;
	player.velocity = {x: 0, y: 0};
	player.direction = DIRECTION.DOWN;
	
	var toolbelt = ["hand", "sword", "hammer", "scanner"];
	

	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	function handleKeyDown(event) {
		switch (event.keyCode) {
			case KEYCODE_UP:
				player.velocity.y = -MOVE_SPEED;
				break;

			case KEYCODE_DOWN:
				player.velocity.y = MOVE_SPEED;
				break;
			
			case KEYCODE_LEFT:
				player.velocity.x = -MOVE_SPEED;
				break;
			
			case KEYCODE_RIGHT:
				player.velocity.x = MOVE_SPEED;
				break;
		}
	}
		
	function handleKeyUp(event) {
		switch (event.keyCode) {
			case KEYCODE_UP:
				player.velocity.y = 0;
				player.gotoAndStop("stop");
				break;

			case KEYCODE_DOWN:
				player.velocity.y = 0;
				player.gotoAndStop("stop");
				break;
			
			case KEYCODE_LEFT:
				player.velocity.x = 0;
				player.gotoAndStop("stop");
				break;
			
			case KEYCODE_RIGHT:
				player.velocity.x = 0;
				player.gotoAndStop("stop");
				break;
		}
	}
		
	var update = function() {

		if (player.velocity.x || player.velocity.y) {
			if (player.velocity.x < 0)
				player.direction = DIRECTION.LEFT;
			else if (player.velocity.x > 0)
				player.direction = DIRECTION.RIGHT;
			else if (player.velocity.y < 0)
				player.direction = DIRECTION.UP;
			else if (player.velocity.y > 0)
				player.direction = DIRECTION.DOWN;

			switch (player.direction) {
				case DIRECTION.UP:
					if (player.currentAnimation !== "walk_up")
						player.gotoAndPlay("walk_up");
					break;

				case DIRECTION.DOWN:
					if (player.currentAnimation !== "walk_down")
						player.gotoAndPlay("walk_down");
					break;

				case DIRECTION.LEFT:
					if (player.currentAnimation !== "walk_left")
						player.gotoAndPlay("walk_left");
					break;

				case DIRECTION.RIGHT:
					if (player.currentAnimation !== "walk_right")
						player.gotoAndPlay("walk_right");
					break;
			}
		}

		player.x += player.velocity.x;
		player.y += player.velocity.y;
	}

	return {
		"sprite": player,
		"toolbelt": toolbelt,
		"update": update
	};
}