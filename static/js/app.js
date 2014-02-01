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
        canvas = $("#canvas")[0];
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
        loader.addEventListener("complete", function() { loadMap() });
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

    function logout() {
        console.log("Logging out!");

        $.ajax({
            url: URL + "logout",
            type: "post",
            success: function(json) {
                console.log("logout successful: " + json['success']);
            },
            error: function(xhr, status, error) {
                console.log("oops, ajax call broke. halp");
            }
        });
    }

    /* (Re)load map upon entering portal */
	function loadMap(directory) {
        var type;
        var data = {};
        if (directory) {
            console.log("cd to " + directory);
            data['directory'] = directory;
            type = "post";
        } else {
            console.log("Loading home map...");
            type = "get";
        }

        $.ajax({
            url: URL + "directory",
            type: type,
            data: data,
            success: function(json) {
                if (json['success'])
                    buildMap(json);
                else
                    console.log("oops, json broke. halp");
            },
            error: function(xhr, status, error) {
                console.log("oops, ajax call broke. halp");
            }
        });
    }

    /* Builds map given json fields: "dirs", "files", and "success" */
    function buildMap(json) {
        //TODO: get rid of loader
        //document.getElementById("loader").className = "";

        console.log("building map");
        console.log(json);

        stage.clear();

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

        var upPortal = new Portal(canvas.width/2, 0, [".."], loader.getResult("portal"));
        var downPortal = new Portal(canvas.width/2, canvas.height-16, dirs, loader.getResult("portal"));
        stage.addChild(upPortal.sprite, downPortal.sprite);

        stage.update();

        // Start game timer
        if (!createjs.Ticker.hasEventListener("tick")) {
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", update);
        }
        
        upPortal.enter();
	}
	
	function update(event) {
		player.update();
    //if collision, enter door
		stage.update(event);
	}

    /* More ajax commands */
    function makeDirectory(directory) {
        console.log("making directory: ", directory);

        $.ajax({
            url: URL + "directory/" + directory,
            type: "post",
            success: function(json) {
                console.log("mkdir successful: " + json['success']);
            },
            error: function(xhr, status, error) {
                console.log("oops, ajax call broke. halp");
            }
        });
    }

    function removeDirectory(directory) {
        console.log("removing directory: ", directory);

        $.ajax({
            url: URL + "directory/" + directory,
            type: "delete",
            success: function(json) {
                console.log("rm -rf successful: " + json['success']);
            },
            error: function(xhr, status, error) {
                console.log("oops, ajax call broke. halp");
            }
        });
    }

    function getFile(file) {
        console.log("downloading file: ", file);

        $.ajax({
            url: URL + "file/" + file,
            type: "get",
            success: function(json) {
                console.log("download successful: " + json['success']);
            },
            error: function(xhr, status, error) {
                console.log("oops, ajax call broke. halp");
            }
        });
    }

    function removeFile(file) {
        console.log("removing file: ", file);

        $.ajax({
            url: URL + "file/" + file,
            type: "delete",
            success: function(json) {
                console.log("rm successful: " + json['success']);
            },
            error: function(xhr, status, error) {
                console.log("oops, ajax call broke. halp");
            }
        });
    }

})();
