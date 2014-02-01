(function() {

	var canvas, stage, loader, manifest, player;

    // TODO: un-hardcode
    var URL = "http://localhost:5000/";
    var USERNAME = "estherw";
    var PASSWORD = "Iknowyou'rereadingthis^2";
	
    $(document).ready(function() {
        initialize();
    });

    var initialize = function() {
        canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth - 50;
		canvas.height = window.innerHeight - 50;
        stage = new createjs.Stage(canvas);
        stage.scaleX = stage.scaleY = 1.5;

		manifest = [
            {src:"static/graphics/robo.png", id:"player"},
            {src:"static/graphics/grass.png", id:"grass"},
            {src:"static/graphics/file_default.png", id:"critter"},
            {src:"static/graphics/portal.png", id:"portal"}
            //{src:"assets/ground.png", id:"ground"},
            //{src:"assets/parallaxHill1.png", id:"hill"},
            //{src:"assets/parallaxHill2.png", id:"hill2"}
		];

        login(USERNAME, PASSWORD);

        // Load graphics
        loader = new createjs.LoadQueue(false);
        loader.addEventListener("complete", loadMap);
        loader.loadManifest(manifest);

        console.log("Loading graphics...");

    }

    // TODO: login screen
    function login(username, password) {
        console.log("Logging in!");

        $.ajax({
            url: URL + "login",
            type: "post",
            data: {"username": username, "password": password},
            success: function(json) {
                console.log("login successful: " + json['success']);
            },
            error: function(xhr, status, error) {
                console.log("oops, ajax call broke. halp");
            }
        });
    }

    /* Reload map upon entering portal */
	function loadMap() {

        console.log("Graphics loaded!");
        console.log("Calling SFTP...");

        // TODO: do async call
        $.ajax({
            url: URL + "directory",
            type: "get",
            success: function(json) {
                buildMap(json);
            },
            error: function(xhr, status, error) {
                console.log("oops, ajax call broke. halp");
            }
        });
    }

    // json fields: "dirs", "files", and "success"
    function buildMap(json) {
        //TODO: get rid of loader
        //document.getElementById("loader").className = "";

        console.log("building map");
        console.log(json);

        stage.clear();

        if (!json['success']) {
            console.log("oops, json broke. halp");
            return false;
        }

        // Generate background and player
        var background = new Background(loader.getResult("grass"));

        if (!player)
            player = new Player(loader.getResult("player"));

        stage.addChild(background, player.sprite);

        // Generate portals and critters on stage
        var dirs = json['dirs'];
        var files = json['files'];

		for (var file in files) {
            if (files.hasOwnProperty(file)) {
                // TODO: generate critter image based on filetype
                //var critter = new Critter(file, loader.getResult("critter"));
                //stage.addChild(critter);
            }
		}

        //var upPortal = new Portal([".."], laoder.getResult("portal"));
        //var downPortal = new Portal(dirs, loader.getResult("portal"));
        //stage.addChild(upPortal, downPortal);

        stage.update();

        // Start game timer
        if (!createjs.Ticker.hasEventListener("tick")) {
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", update);
        }
	}
	
	function update(event) {
		player.update();
		stage.update(event);
	}

})();