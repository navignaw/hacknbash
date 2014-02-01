var Player = function (image) {

	var KEYCODE_UP = 38;
	var KEYCODE_LEFT = 37;
	var KEYCODE_RIGHT = 39;
	var KEYCODE_DOWN = 40;
	var KEYCODE_SPACE = 32;
	var KEYCODE_1 = 49;
	var KEYCODE_2 = 50;
	var KEYCODE_3 = 51;

	

	var MOVE_SPEED = 2;var DIRECTION = {
		UP: 8,
		DOWN: 2,
		LEFT: 4,
		RIGHT: 6
	};

	var spriteSheet = new createjs.SpriteSheet({
		"images": [image],
		"frames": {width:32, height:32, count:24, regX:0, regY:0},
		"animations": {
			// start, end, next, speed
			"walk_down": [0, 3, "walk_down", 1],
			"stop_down": [1, 1, "stop_down", 1],
			"walk_left": [4, 7, "walk_left", 1],
			"stop_left": [5, 5, "stop_left", 1],
			"walk_right": [8, 11, "walk_right", 1],
			"stop_right": [9, 9, "stop_right", 1],
			"walk_up": [12, 15, "walk_up", 1],
			"stop_up": [13, 13, "stop_up", 1],
			"lightsaber_down": [16, 17, "stop_down", 1],
			"lightsaber_left": [18, 19, "stop_left", 1],
			"lightsaber_right": [20, 21, "stop_right", 1],
			"lightsaber_up": [22, 23, "stop_up", 1],
			
			//don't forget to change count to 31.
			/*
			"brain_down": [24, 25, "stop_down", 1],
			"brain_left": [26, 27, "stop_left", 1],
			"brain_right": [28, 29, "stop_right", 1],
			"brain_up": [30, 31, "stop_up", 1],
			*/
		}
	});

	var player = new createjs.Sprite(spriteSheet, "stop_down");
	player.framerate = 4;
	player.velocity = {x: 0, y: 0};
	player.direction = DIRECTION.DOWN;
	
	var tools = {
		toolbelt: ["none", "lightsaber","brain"],//, "hammer"],
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
			case KEYCODE_3:
				console.log("changing tools: ", tools.toolbelt[2]);
				tools.equippedTool = tools.toolbelt[2];
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

		if (tools.usingTool && tools.equippedTool == tools.toolbelt[1]) {
			switch (player.direction) {
				case DIRECTION.UP:
					if (player.currentAnimation !== "lightsaber_up")
						player.gotoAndPlay("lightsaber_up");
					break;

				case DIRECTION.DOWN:
					if (player.currentAnimation !== "lightsaber_down")
						player.gotoAndPlay("lightsaber_down");
					break;

				case DIRECTION.LEFT:
					if (player.currentAnimation !== "lightsaber_left")
						player.gotoAndPlay("lightsaber_left");
					break;
				case DIRECTION.RIGHT:
					if (player.currentAnimation !== "lightsaber_right")
						player.gotoAndPlay("lightsaber_right");
					break
			}
		}

		/*else if (tools.usingTool && tools.equippedTool == tools.toolbelt[2]) {
			switch (player.direction) {
				case DIRECTION.UP:
					if (player.currentAnimation !== "brain_up")
						player.gotoAndPlay("brain_up");
					break;

				case DIRECTION.DOWN:
					if (player.currentAnimation !== "brain_down")
						player.gotoAndPlay("brain_down");
					break;

				case DIRECTION.LEFT:
					if (player.currentAnimation !== "brain_left")
						player.gotoAndPlay("brain_left");
					break;
				case DIRECTION.RIGHT:
					if (player.currentAnimation !== "brain_right")
						player.gotoAndPlay("brain_right");
					break
			}
		} */

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