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

		manifest = [
			{src:"static/graphics/robo_down.png", id:"player"},
			{src:"static/graphics/grass.png", id:"grass"},
			{src:"static/graphics/file_default.png", id:"critter"},
			{src:"static/graphics/portal.png", id:"portal"}
			//{src:"assets/parallaxHill2.png", id:"hill2"}
		];

		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete", handleComplete);
		loader.loadManifest(manifest);
    }

	//j is a json with "dirs", "files", and "success"
	/*function loadMap(j) {
		//want to reload map upon entering a portal. Use this function
		stage.Clear();
		var dirs = j["dirs"];
		var files = j["files"];
		var critters = new Array();
		var portals = new Array();
		for each(var i in files) {
			critters.add(new Critter(loader.getResult("critter"));
		}
		for each(var i in dirs) {
			portals.add(new Portal(loader.getResult("portal"));
		}
		stage.addChild(player.sprite);
		//generate portals and critters on stage
		
		
		//console.log("Oops, loadMap failed. Bad json!");
		}
	}
	*/

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