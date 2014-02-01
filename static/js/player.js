var Player = function (image) {
	var spriteSheet = new createjs.SpriteSheet({
		"images": [image],
		"frames": {width:32, height:32, regX: 16, regY:16},
		"animations": {
			// start, end, next, speed
			"walk": [0,0]
			//swingSword: [9,12,"walk"]
		}
	});
	var player = new createjs.Sprite(spriteSheet, "walk");
	//player.setTransform(0,0,0,0);
	console.log(player);
	
	var toolbelt = new Array("hand", "sword", "hammer", "scanner");
	var moveDist = 1;
	
	player.addEventListener("right", handleRight);
	function handleRight(event) {
		player.x += moveDist;
	}
	player.addEventListener("left", handleLeft);
	function handleLeft(event) {
		player.x -= moveDist;
	}
	player.addEventListener("up", handleUp);
	function handleUp(event) {
		player.y += moveDist;
	}
	player.addEventListener("down", handleDown);
	function handleDown(event) {
		player.y -= moveDist;
	}
	
	//console.log(player);
	return player;
}