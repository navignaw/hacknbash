(function() {

	var canvas, stage, loader, manifest, player;
    var upPortal, downPortal;
    var critters;

    // TODO: un-hardcode
    var URL = "http://localhost:5000/";
    var USERNAME = "estherw";
    var PASSWORD = "Iknowyou'rereadingthis^2";
    var UPDOOR_COLLIDING = false;
    var DOWNDOOR_COLLIDING = false;
	//var USERNAME = "estherw";
	//var PASSWORD = "Iknowyou'rereadingthis^2";
	var username, password;
	
    $(document).ready(function() {
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
            {src:"static/graphics/portal.png", id:"portal"}
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
            $("#username").val('');
            $("#password").val('');
        }

        $.ajax({
            url: URL + "login",
            type: "post",
            data: {"username": username, "password": password},
            success: function(json) {
                console.log("login successful: " + json['success']);
                if (json['success']) {
                    $("#loginForm").hide();
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

        stage.clear();

        // Generate background and player
        var background = new Background(loader.getResult("grass"));
        // Generate portals and critters on stage
        var dirs = json['dirs'];
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


        stage.update();

        // Start game timer
        if (!createjs.Ticker.hasEventListener("tick")) {
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", update);
        }
	}
	
	function update(event) {
		player.update();

        for (var i = 0; i < critters.length; i++) {
            critters[i].update();
        }

        // Check collisions
        if (!UPDOOR_COLLIDING) {
            if (ndgmr.checkRectCollision(player.sprite, upPortal.sprite)) {
              upPortal.enter();
              $("#dirSelected").click(function () {
                  loadMap(upPortal.goClickHandler());
              });
            }
        }
        UPDOOR_COLLIDING = ndgmr.checkRectCollision(player.sprite, upPortal.sprite);

        if (!DOWNDOOR_COLLIDING && downPortal) {
            if (ndgmr.checkRectCollision(player.sprite, downPortal.sprite)) {
              downPortal.enter();
              $("#dirSelected").click(function () {
                  loadMap(downPortal.goClickHandler());
              });
            }
        }
        if (downPortal) {
            DOWNDOOR_COLLIDING = ndgmr.checkRectCollision(player.sprite, downPortal.sprite);
        }
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
