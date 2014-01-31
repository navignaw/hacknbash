(function() {

    window.onload = function() {
        initialize();
    }

    var initialize = function() {
        var canvas = document.getElementById("canvas");
        var stage = new createjs.Stage(canvas);

        var player = new createjs.Shape();
        player.graphics.beginFill("red").drawCircle(0, 0, 40);
        player.x = player.y = 50;
        stage.addChild(player);

        player.addEventListener("click", function(event) {
            console.log("clicked on me!");
        });

        stage.update();
    }

})();