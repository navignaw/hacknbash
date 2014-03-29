var Keyboard = (function() {
	
	var keyDownCallbacks = {};
	var keyUpCallbacks = {};

	document.onkeyup = function(event) {
		for (var name in keyUpCallbacks) {
			keyUpCallbacks[name](event.which);
		}
	};

	document.onkeydown = function(event) {
		for (var name in keyDownCallbacks) {
			keyDownCallbacks[name](event.which);
		}
	};

	return {
		addKeyDown: function(name, callback) {
			keyDownCallbacks[name] = callback;
		},

		addKeyUp: function(name, callback) {
			keyUpCallbacks[name] = callback;
		},

		removeKeyDown: function(name) {
			delete keyDownCallbacks[name];
		},

		removeKeyUp: function(name) {
			delete keyDownCallbacks[name];
		}
	};
})();