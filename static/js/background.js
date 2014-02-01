//make a tileset

var Background = function(image) {
	var grass = new createjs.Sprite();
	grass.graphics.beginBitmapFill(image).drawRect(0,0,window.innerWidth,window.innerHeight);
	return grass;
}