//make a tileset

var Background = function(image) {
	var background = new createjs.Shape();
	background.graphics.beginBitmapFill(image).drawRect(0,0,window.innerWidth,window.innerHeight);
	return background;
}