var Player = function (image) {
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
	//console.log(player);
	
	var toolbelt = new Array("hand", "sword", "hammer", "scanner");
	var moveDist = 1;
	
	//var tickRate = 30;
	var walkingDown = false;
	var walkingUp = false;
	var walkingLeft = false;
	var walkingRight = false;
	
	function handleKeyDown(event) {
			switch(event.which){
				//down
				case 40:
					player.gotoAndPlay("walk");
					walkingDown = true;
					break;
				//up
				case 38:
					player.gotoAndPlay("walk");
					walkingUp = true;
					break;
				//left
				case 37:
					player.gotoAndPlay("walk");
					walkingLeft = true;
					break;
				//right
				case 39:
					player.gotoAndPlay("walk");
					walkingRight = true;
					break;
			}
		}
		
		function handleKeyUp(event) {
			switch(event.which){
				//down
				case 40:
					walkingDown = false;
					break;
				//up
				case 38:
					walkingUp = false;
					break;
				//left
				case 37:
					walkingLeft = false;
					break;
				//right
				case 39:
					walkingRight = false;
					break;
			}
		}
		
		document.onkeydown = handleKeyDown;
		document.onkeyup = handleKeyUp;
		
	var tick = function (){
		if(walkingDown) {
			player.y += .1;
		}
		else if(walkingUp) {
			player.y -= .1;
		}
		else if(walkingLeft) {
			player.y -= .1;
		}
		else if(walkingRight) {
			player.y += .1;
		}
	}
		console.log(player.x);
		console.log(player.y);
	return {"sprite":player, "tick":tick};
}