(function() {

	var stage, loader;
	
    window.onload = function() {
        initialize();
    }

    var initialize = function() {
        var canvas = document.getElementById("canvas");
        stage = new createjs.Stage(canvas);

		manifest = [
			{src:"static/graphics/player.png", id:"player"}
			//{src:"assets/sky.png", id:"sky"},
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

		var player = new Player(loader.getResult("player"));
		stage.addChild(player);
        stage.update();
	}
})();