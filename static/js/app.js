(function() {

	var stage, loader, player;
	var tickRate = 30;
	
    window.onload = function() {
        initialize();
    }

    var initialize = function() {
        var canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
        stage = new createjs.Stage(canvas);

		manifest = [
			{src:"static/graphics/robo_down.png", id:"player"},
			{src:"static/graphics/grass_tile.png", id:"grass"}
			//{src:"assets/ground.png", id:"ground"},
			//{src:"assets/parallaxHill1.png", id:"hill"},
			//{src:"assets/parallaxHill2.png", id:"hill2"}
		];

		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete", handleComplete);
		loader.loadManifest(manifest);
    }

	function handleComplete() {
		document.getElementById("loader").className = "";     

		var background = new Background(loader.getResult("grass"));
		player = new Player(loader.getResult("player"));
		stage.addChild(background, player.sprite);
        stage.update();
		
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.addEventListener("tick", tick);
	}
	
	function tick(event) {
		player.tick();
		stage.update(event);
		setTimeout(tick, tickRate);
	}
})();