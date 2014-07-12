var Portal = function (x, y, dirs, image) {

    var spriteSheet = new createjs.SpriteSheet({
        "images": [image],
        "frames": {width:32, height:32, count:4, regX: 0, regY:0},
        "animations": {
            // start, end, next, speed
            "animate": [0,3,"animate",1]
        }
    });
    var port = new createjs.Sprite(spriteSheet, "animate");
    port.x = x;
    port.y = y;
    port.gotoAndPlay("animate");
    port.framerate = 6;
    var targetDir = "";
 
    function isTop() {
        if (dirs[0] == "..") {
            return true;
        }
        return false;
    } 

    var name = new createjs.Text(function () {
      if (isTop()) { return ".."; } else { return "cd" }}(),"12px Prime","#000000");

    name.textAlign = "center";
    name.x = port.x+16;
    if (isTop()) { name.y = port.y+12;} else { name.y = port.y+13;}

    function enter(hide) {
        //console.log("door entered");
        if (!hide)
            displayDirWindow();
    }

    function goClickHandler() {
        targetDir = $("#dirDiv option:selected").text();
        $("#dirDiv").fadeOut();
        $("#canvas").fadeIn();
        $("#nextDirs").empty();
        return targetDir;
    }

    function displayDirWindow() {
        $("#canvas").fadeOut();
        for (var i = 0; i < dirs.length; i++) {
            $("#nextDirs").append("<option value='1'>"+dirs[i]+"</option>");
        }
        $("#dirDiv").fadeIn();
        //$("#dirSelected").click();
        //clear out contents of the select box
    }

    return {
        "name": name,
        "enter": enter,
        "sprite": port,
        "goClickHandler": goClickHandler
    };
}
