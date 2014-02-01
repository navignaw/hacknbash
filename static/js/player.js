var Player = function (image) {
	var spriteSheet = new createjs.SpriteSheet({
		"images": [image],
		"frames": {width:32, height:32, count:4, regX: 0, regY:0},
		"animations": {
			// start, end, next, speed
			//"stop": [1,1,"stop",1.5],
			"walk": [0,3,"walk",1.5]
			//swingSword: [9,12,"walk"]
		}
	});
	var player = new createjs.Sprite(spriteSheet, "walk");
	player.framerate = 6;
	//console.log(player);
	
	var toolbelt = new Array("hand", "sword", "hammer", "scanner");
	var moveDist = 1;
	
	player.addEventListener(document.onkeydown, handleDown);
	function handleDown(event) {
		//do some case of what the pressed key is.
		//walk in some direction accordingly
		player.gotoAndPlay("walk");
	}
	
	//console.log(player);
	return player;
}