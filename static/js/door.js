var Portal = function (x, y, dirs, image) {

    var spriteSheet = new createjs.SpriteSheet({
        "images": [image],
        "frames": {width:32, height:32, count:4, regX: 0, regY:0},
        "animations": {
            // start, end, next, speed
            "stop": [0,0,"stop",1],
            "animate": [0,3,"animate",1]
        }
    });
    var port = new createjs.Sprite(spriteSheet, "animate");
    port.x = x;
    port.y = y;
    port.gotoAndPlay("animate");
    port.framerate = 6;
    var targetDir = ""

    function enter() {
        console.log("door entered");
        displayDirWindow();
    }

    function displayDirWindow() {
        $("#canvas").fadeOut();
        console.log("fade?");
        for (var i = 0; i < dirs.length; i++) {
            $("#dirDiv").append(dirs[i]);
        }
        $("#dirDiv").fadeIn();
        $("#dirSelected").click(function () {
            targetDir = $("#dirDiv option:selected");
            console.log(targetDir.text());
            $("#dirDiv").fadeOut();
            $("#canvas").fadeIn();
        });
    }

    return {
        "enter": enter,
        "sprite": port,
        "targetDir": targetDir
    };
}