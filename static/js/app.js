(function() {

	var stage, loader, player;
	
    window.onload = function() {
        initialize();
    }

    var initialize = function() {
        var canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth - 50;
		canvas.height = window.innerHeight - 50;
        stage = new createjs.Stage(canvas);
        stage.scaleX = stage.scaleY = 1.5;

		manifest = [
			{src:"static/graphics/robo.png", id:"player"},
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
		createjs.Ticker.addEventListener("tick", update);
	}
	
	function update(event) {
		player.update();
		stage.update(event);
	}
})();