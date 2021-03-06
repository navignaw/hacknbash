(function() {

	var canvas, stage, loader, manifest, player;
    var upPortal, downPortal;
    var critters;
	var lightsaber, disk, cat;

    var DIRECTION = {
        UP: 8,
        DOWN: 2,
        LEFT: 4,
        RIGHT: 6
    };

    var SKIP_LOGIN = false;

    var username, password, host;
    var loadingMap = false;

    $(document).ready(function() {
        $("#username").focus();
        $("#login-form").submit(function(e) {
            e.preventDefault();
            $("#login-error").hide();
            $("#username").prop('disabled', true);
            $("#password").prop('disabled', true);
            $("#host").prop('disabled', true);
            $("#login-btn").prop({value: 'Logging in...', disabled: true});
            username = $("#username").val();
            password = $("#password").val();
            host = $("#host").val();
            login(username, password, host);
        });
    });

    /* Set up canvas, preload graphics and map */
    var setup = function() {
        $("#canvas").show();
        canvas = $("#canvas")[0];
		canvas.width = window.innerWidth - 50;
		canvas.height = window.innerHeight - 50;
        stage = new createjs.Stage(canvas);
        stage.scaleX = stage.scaleY = 1.5;

		manifest = [
            {src:"static/graphics/newrobo.png", id:"player"},
            {src:"static/graphics/biggrass.png", id:"grass"},
            {src:"static/graphics/bigsand.png", id:"sand"},
            {src:"static/graphics/file_default.png", id:"critter"},
            {src:"static/graphics/portal.png", id:"portal"},
            {src:"static/graphics/disk.png", id:"disk"},
            {src:"static/graphics/lightsaber.png", id:"lightsaber"},
			{src:"static/graphics/cat.png", id:"cat"},
			
			{src:"static/sound/lightsaber.mp3", id:"lightsaber_sound"},
			{src:"static/sound/floppy_disk.mp3", id:"floppy_disk"},
			{src:"static/sound/meow.mp3", id:"meow"}
		];

        // Load graphics
        loader = new createjs.LoadQueue(false);
        createjs.Sound.alternateExtensions = ["mp3"];
        loader.installPlugin(createjs.Sound);
        loader.addEventListener("complete", function() { loadMap() });
        loader.loadManifest(manifest);
        //console.log("Loading graphics and sound...");
    }

    function login(username, password, host) {
        //console.log("Logging in!");

        var error = function(xhr, status, error) {
            console.log("error logging in!", error);
            $("#login-error").show();
            $("#username").prop('disabled', false);
            $("#password").prop('disabled', false);
            $("#host").prop('disabled', false);
            $("#login-btn").prop({value: 'Login', disabled: false});
            $("#password").val('');
        }

        $.ajax({
            url: "/login",
            type: "post",
            data: {"username": username, "password": password, "host": host},
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
        //console.log("Logging out!");

        $.ajax({
            url: "/logout",
            type: "post",
            success: function(json) {
                console.log("logout successful: " + json['success']);
            },
            error: function(xhr, status, error) {
                console.log("error logging out!", error);
            }
        });
    }

    /* (Re)load map upon entering portal */
	function loadMap(directory) {
        var type;
        var data = {};
        if (directory) {
            //console.log("cd to " + directory);
            data['directory'] = directory;
            type = "post";
        } else {
            //console.log("Loading home map...");
            type = "get";
        }

        $.ajax({
            url: "/directory",
            type: type,
            data: data,
            success: function(json) {
                if (json['success'])
                    buildMap(json);
                else
                    console.log("oops, json broke. halp");
            },
            error: function(xhr, status, error) {
                console.log("error loading directory!", error);
            }
        });
    }

    /* Builds map given json fields: "dirs", "files", and "success" */
    function buildMap(json) {
        //TODO: get rid of loader
        //$("#loader").hide();

        stage.removeAllChildren();

        // Generate random background, portals, and critters
        var backgrounds = [loader.getResult("grass"), loader.getResult("sand")];
        var background = new Background(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
        
        var dirs = json['dirs'];
        var files = json['files'];
        var wd = json['pwd'];

        stage.addChild(background);

        var wdText = new createjs.Text(wd, "14px Cambria", "#000000");
        //rect.graphics.beginFill("white").drawRect(x-5, y-5, msg.lineWidth+10, msg.lineHeight+10);
        wdText.x = 0;
        wdText.y = canvas.height-20;
        stage.addChild(wdText);

        upPortal = new Portal(canvas.width / 3, 0, [".."], loader.getResult("portal"));
        stage.addChild(upPortal.sprite, upPortal.name);

        if (dirs.length !== 0) {
            downPortal = new Portal(canvas.width / 3, canvas.height / 1.8, dirs, loader.getResult("portal"));
            stage.addChild(downPortal.sprite, downPortal.name);
        }
		
        if (!player)
            player = new Player(loader.getResult("player"));
        player.sprite.x = canvas.width / 3;
        player.sprite.y = canvas.height / 3.2;

        stage.addChild(player.sprite);

        critters = [];
		$.each(files, function(index, file) {
            var randomX = Math.random() * canvas.width / 2;
            var randomY = Math.random() * canvas.height / 2;
            var critter = new Critter(randomX, randomY, file, loader.getResult("critter"));
            critters.push(critter);
            stage.addChild(critter.sprite, critter.name);
		});

        disk = new Inventory("disk", loader.getResult("disk"));
		lightsaber = new Inventory("lightsaber", loader.getResult("lightsaber"));
		cat = new Inventory("cat", loader.getResult("cat"));
		
		stage.addChild(disk, lightsaber, cat);
		
        stage.update();

        $("#dirDiv").fadeOut(); 
        $("#canvas").fadeIn();
        loadingMap = false;

        // Start game timer
        if (!createjs.Ticker.hasEventListener("tick")) {
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", update);
        }
	}
	
	function update(event) {
        if (loadingMap)
            return;

        player.update();

        // Check collisions
        if (ndgmr.checkRectCollision(player.sprite, upPortal.sprite)) {
            loadingMap = true;
            upPortal.enter(true);
            loadMap("..");
        }

        if (downPortal) {
            if (ndgmr.checkRectCollision(player.sprite, downPortal.sprite)) {
                loadingMap = true;
                downPortal.enter();
                $("#dirSelected").on("click", function() {
                    $("#dirSelected").off();
                    loadMap(downPortal.goClickHandler());
              });
            }
        }
		
		//light up appropriate tool slot in inventory
        if (player.tools.equippedTool === "disk") {
            disk.gotoAndPlay("selected");
            lightsaber.gotoAndPlay("unselected");
			cat.gotoAndPlay("unselected");
        }
		else if (player.tools.equippedTool === "lightsaber") {
            disk.gotoAndPlay("unselected");
			lightsaber.gotoAndPlay("selected");
			cat.gotoAndPlay("unselected");
		}
		else if (player.tools.equippedTool === "cat") {
			disk.gotoAndPlay("unselected");
			lightsaber.gotoAndPlay("unselected");
			cat.gotoAndPlay("selected");
		}
			
        $.each(critters, function(index, critter) {
            critter.update();
			
            if (player.tools.usingTool && player.tools.equippedTool === "disk") {
                if (ndgmr.checkPixelCollision(player.sprite, critter.sprite) && facing(player.sprite, critter.sprite)) {
                    //potentially do an animation to indicate success?
                    popUpText(player.sprite.x, player.sprite.y, "downloading");
                    downloadFile(critter.name.text);
                    player.tools.usingTool = false;
                }
            }
            else if (player.tools.usingTool && player.tools.equippedTool === "lightsaber") {
                if (ndgmr.checkPixelCollision(player.sprite, critter.sprite) && facing(player.sprite, critter.sprite)) {
                    popUpText(player.sprite.x, player.sprite.y, "rm");
                    stage.removeChild(critter.sprite);
                    stage.removeChild(critter.name);
                    removeFile(critter.name.text);
                    player.tools.usingTool = false;
                }
            }
			else if (player.tools.usingTool && player.tools.equippedTool === "cat") {
                if (ndgmr.checkPixelCollision(player.sprite, critter.sprite) && facing(player.sprite, critter.sprite)) {
                    popUpText(player.sprite.x, player.sprite.y, "cat");
					catFile(critter.name.text);
                    player.tools.usingTool = false;
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
            url: "/directory/" + directory,
            type: "post",
            success: function(json) {
                console.log("mkdir successful: " + json['success']);
            },
            error: function(xhr, status, error) {
                console.log("error making directory!", error);
            }
        });
    }

    function removeDirectory(directory) {
        console.log("removing directory: ", directory);

        $.ajax({
            url: "/directory/" + directory,
            type: "delete",
            success: function(json) {
                console.log("rm -rf successful: " + json['success']);
            },
            error: function(xhr, status, error) {
                console.log("error removing directory!", error);
            }
        });
    }

    function downloadFile(file) {
        console.log("downloading file: ", file);

        $.ajax({
            url: "/file/" + file,
            type: "get",
            success: function(json) {
                console.log("download successful: " + json['success']);
            },
            error: function(xhr, status, error) {
                console.log("error downloading file!", error);
            }
        });
    }

    function catFile(file) {
        $.ajax({
            url: "/file/" + file + "/view",
            type: "get",
            success: function(json) {
                console.log("cat successful!");
				catEvent(json['text']);
            },
            error: function(xhr, status, error) {
                console.log("error reading file!", error);
            }
        });
    }

    function removeFile(file) {
        console.log("removing file: ", file);

        $.ajax({
            url: "/file/" + file,
            type: "delete",
            success: function(json) {
                console.log("rm successful: " + json['success']);
            },
            error: function(xhr, status, error) {
                console.log("error removing file!", error);
            }
        });
    }

    function popUpText(x, y, s) {
        var msg = new createjs.Text(s, "12px bold Prime", "#2111D1");
        msg.x = x;
        msg.y = y - 10;
        msg.outline = 1;

        createjs.Tween.get(msg, {loop:false}).to({alpha:0, y:msg.y-10}, 2000, createjs.Ease.get(1))
            .call(function() { stage.removeChild(msg); });
        
        stage.addChild(msg);
    }
  
    function catEvent(s) {
        $("#catDiv #catText").val(s);
        stage.filters = [new createjs.ColorFilter(0.3, 0.3, 0.3, 1, 60, 60, 60)];
        stage.cache(-50, -50, canvas.width, canvas.height);
        $("#catDiv").show();

        var hideCatDiv = function() {
            $("#catDiv").hide();
            stage.filters = [];
            stage.uncache();
            Keyboard.removeKeyDown("catDiv");
        };

        Keyboard.addKeyDown("catDiv", hideCatDiv);
        $("#catDiv").click(hideCatDiv);
    }

})();
