var Player = function (image) {

	var KEYCODE_UP = 38;
	var KEYCODE_LEFT = 37;
	var KEYCODE_RIGHT = 39;
	var KEYCODE_DOWN = 40;
	var KEYCODE_SPACE = 32;
	var KEYCODE_1 = 49;
	var KEYCODE_2 = 50;

	var DIRECTION = {
		UP: 8,
		DOWN: 2,
		LEFT: 4,
		RIGHT: 6
	};

	var MOVE_SPEED = 2;

	var spriteSheet = new createjs.SpriteSheet({
		"images": [image],
		"frames": {width:32, height:32, count:16, regX:0, regY:0},
		"animations": {
			// start, end, next, speed
			"walk_down": [0, 3, "walk_down", 1],
			"stop_down": [1, 1, "stop_down", 1],
			"walk_left": [4, 7, "walk_left", 1],
			"stop_left": [5, 5, "stop_left", 1],
			"walk_right": [8, 11, "walk_right", 1],
			"stop_right": [9, 9, "stop_right", 1],
			"walk_up": [12, 15, "walk_up", 1],
			"stop_up": [13, 13, "stop_up", 1]
			//swingSword: [16, 19, "walk"]
		}
	});

	var player = new createjs.Sprite(spriteSheet, "stop_down");
	player.framerate = 4;
	player.velocity = {x: 0, y: 0};
	player.direction = DIRECTION.DOWN;
	
	var tools = {
		toolbelt: ["none", "lightsaber"],//, "hammer", "scanner"],
		equippedTool: "none",
		usingTool: false
	};
	

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

			case KEYCODE_SPACE:
				tools.usingTool = true;
				break;
		}
	}
		
	function handleKeyUp(event) {
		switch (event.keyCode) {
			case KEYCODE_UP:
				player.velocity.y = 0;
				player.gotoAndStop("stop_up");
				break;

			case KEYCODE_DOWN:
				player.velocity.y = 0;
				player.gotoAndStop("stop_down");
				break;
			
			case KEYCODE_LEFT:
				player.velocity.x = 0;
				player.gotoAndStop("stop_left");
				break;
			
			case KEYCODE_RIGHT:
				player.velocity.x = 0;
				player.gotoAndStop("stop_right");
				break;

			case KEYCODE_SPACE:
				tools.usingTool = false;
				break;

			case KEYCODE_1:
				console.log("changing tools: ", tools.toolbelt[0]);
				tools.equippedTool = tools.toolbelt[0];
				break;

			case KEYCODE_2:
				console.log("changing tools: ", tools.toolbelt[1]);
				tools.equippedTool = tools.toolbelt[1];
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

		// Add swinging weapon animation
		if (tools.usingTool) {

		}


		player.x += player.velocity.x;
		player.y += player.velocity.y;

		stayInBounds();
	}

	function stayInBounds() {
		if (player.x < 0) {
			player.x = 0;
		} else if (player.x > $("#canvas")[0].width * 0.63) {
			player.x = $("#canvas")[0].width * 0.63;
		}

		if (player.y < 0) {
			player.y = 0;
		} else if (player.y > $("#canvas")[0].height * 0.6) {
			player.y = $("#canvas")[0].height * 0.6;
		}
	}

	return {
		"sprite": player,
		"tools": tools,
		"update": update
	};
}