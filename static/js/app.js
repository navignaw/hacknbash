(function() {

	var canvas, stage, loader, manifest, player;
    var upPortal, downPortal;
    var critters;
	var noTool, lightsaber, brain;

    var DIRECTION = {
        UP: 8,
        DOWN: 2,
        LEFT: 4,
        RIGHT: 6
    };

    var URL = "http://localhost:5000/";
    var UPDOOR_COLLIDING = false;
    var DOWNDOOR_COLLIDING = false;
    var USERNAME = "estherw";
    var PASSWORD = "Iknowyou'rereadingthis^2";
    var username, password;

    var SKIP_LOGIN = true;
	
    $(document).ready(function() {
        if (SKIP_LOGIN)
            login(USERNAME, PASSWORD);

        $("#submit").click(function() {
            username = $("#username").val();
            password = $("#password").val();
            login(username, password);
        });
    });

    var setup = function() {
        canvas = $("#canvas")[0];
		canvas.width = window.innerWidth - 50;
		canvas.height = window.innerHeight - 50;
        stage = new createjs.Stage(canvas);
        stage.scaleX = stage.scaleY = 1.5;

		manifest = [
            {src:"static/graphics/newrobo.png", id:"player"},
            {src:"static/graphics/biggrass.png", id:"grass"},
            {src:"static/graphics/file_default.png", id:"critter"},
            {src:"static/graphics/portal.png", id:"portal"},
            {src:"static/graphics/no_item.png", id:"none"},
            {src:"static/graphics/lightsaber.png", id:"lightsaber"},
			{src:"static/graphics/brain.png", id:"brain"},
            
			//{src:"assets/ground.png", id:"ground"},
            //{src:"assets/parallaxHill1.png", id:"hill"},
            //{src:"assets/parallaxHill2.png", id:"hill2"}
		];

        // Load graphics
        loader = new createjs.LoadQueue(false);
        loader.addEventListener("complete", function() { loadMap() });
        loader.loadManifest(manifest);
        console.log("Loading graphics...");
    }

    function login(username, password) {
        console.log("Logging in!");

        var error = function(xhr, status, error) {
            console.log("oops, ajax call broke. halp");
            $("#password").val('');
        }

        $.ajax({
            url: URL + "login",
            type: "post",
            data: {"username": username, "password": password},
            success: function(json) {
                console.log("login successful: " + json['success']);
                if (json['success']) {
                    $(".login").slideUp();
                    setup();
                } else {
                    error();
                }
            },
            error: error
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

        console.log(data)

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

        //stage.clear();
        stage.removeAllChildren();
        //console.log("Number of children:");
        //console.log(stage.getNumChildren());

        // Generate background and player
        var background = new Background(loader.getResult("grass"));
        // Generate portals and critters on stage
        var dirs = json['dirs'];
        console.log(dirs)
        var files = json['files'];

        stage.addChild(background);

        upPortal = new Portal(canvas.width / 4, 0, [".."], loader.getResult("portal"));
        stage.addChild(upPortal.sprite, upPortal.name);

        if (dirs.length != 0) {
            downPortal = new Portal(canvas.width / 4, canvas.height / 2, dirs, loader.getResult("portal"));
            stage.addChild(downPortal.sprite, downPortal.name);
        }
		
        if (!player)
            player = new Player(loader.getResult("player"));

        stage.addChild(player.sprite);

        critters = new Array();
		for (var i = 0; i < files.length; i++) {
            var randomX = Math.random() * canvas.width / 2;
            var randomY = Math.random() * canvas.height / 2;
            var critter = new Critter(randomX, randomY, files[i], loader.getResult("critter"));
            critters.push(critter);
            stage.addChild(critter.sprite, critter.name);
		}

		noTool = new Inventory("none", loader.getResult("none"));
		lightsaber = new Inventory("lightsaber", loader.getResult("lightsaber"));
		brain = new Inventory("brain", loader.getResult("brain"));
		
		stage.addChild(noTool, lightsaber, brain);
		
        stage.update();

        $("#dirDiv").fadeOut(); 
        $("#canvas").fadeIn();

        // Start game timer
        if (!createjs.Ticker.hasEventListener("tick")) {
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", update);
        }
	}
	
	function update(event) {
		player.update();

        // Check collisions
        if (!UPDOOR_COLLIDING) {
            if (ndgmr.checkRectCollision(player.sprite, upPortal.sprite)) {
              upPortal.enter();
              $("#dirSelected").on("click", function () {
                  $("#dirSelected").off();
                  loadMap(upPortal.goClickHandler());
              });
            }
        }
        UPDOOR_COLLIDING = ndgmr.checkRectCollision(player.sprite, upPortal.sprite);

        if (!DOWNDOOR_COLLIDING && downPortal) {
            if (ndgmr.checkRectCollision(player.sprite, downPortal.sprite)) {
              downPortal.enter();
              $("#dirSelected").on("click", function () {
                  $("#dirSelected").off();
                  loadMap(downPortal.goClickHandler());
              });
            }
        }
        if (downPortal) {
            DOWNDOOR_COLLIDING = ndgmr.checkRectCollision(player.sprite, downPortal.sprite);
        }
		
		//light up appropriate tool slot in inventory
		if(player.tools.equippedTool === "none") {
			noTool.gotoAndPlay("selected");
			lightsaber.gotoAndPlay("unselected");
			brain.gotoAndPlay("unselected");
		}
		else if(player.tools.equippedTool === "lightsaber") {
			noTool.gotoAndPlay("unselected");
			lighsaber.gotoAndPlay("selected");
			brain.gotoAndPlay("unselected");
		}
		else if(player.tools.equippedTool === "brain") {
			noTool.gotoAndPlay("unselected");
			lighsaber.gotoAndPlay("unselected");
			brain.gotoAndPlay("selected");
		}
			
        $.each(critters, function(index, critter) {
            critter.update();
			
            if (player.tools.usingTool && player.tools.equippedTool === "lightsaber") {
                if (ndgmr.checkPixelCollision(player.sprite, critter.sprite) && facing(player.sprite, critter.sprite)) {
                    stage.removeChild(critter.sprite);
                    stage.removeChild(critter.name);
                    removeFile(critter.name.text);
                }
            }
			
			if (player.tools.usingTool && player.tools.equippedTool === "brain") {
                if (ndgmr.checkPixelCollision(player.sprite, critter.sprite) && facing(player.sprite, critter.sprite)) {
                    //potentially do an animation to indicate success?
					getFile(critter.name.text);
                }
            }
        });

		stage.update(event);
	}

    function facing(player, critter) {
        switch (player.direction) {
            case DIRECTION.UP:
                return critter.y <= player.y;
                break;

            case DIRECTION.DOWN:
                return critter.y >= player.y;
                break;

            case DIRECTION.LEFT:
                return critter.x <= player.x;
                break;

            case DIRECTION.RIGHT:
                return critter.x >= player.x;
                break;
        }
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
