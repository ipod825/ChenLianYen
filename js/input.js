KEYCODE_SPACE = 32;
KEYCODE_UP = 38;
KEYCODE_LEFT = 37;
KEYCODE_RIGHT = 39;
KEYCODE_W = 87;
KEYCODE_A = 65;
KEYCODE_D = 68;
function Input(Rpg){
	this.Rpg = Rpg;
}

Input.prototype.handleKeyDown = function (e) {
	this.handleKeyPress(e);
};

Input.prototype.handleKeyPress= function (e) {
	switch (e.keyCode) {
		case KEYCODE_A: 
		case KEYCODE_LEFT:
		case KEYCODE_D: 
		case KEYCODE_RIGHT:
		case KEYCODE_W:
		alert(e.keyCode);
	}
};

Input.prototype.handleKeyUp = function (e) {
	switch (e.keyCode) {
		case KEYCODE_A: 
		case KEYCODE_LEFT: 
		case KEYCODE_D: 
		case KEYCODE_RIGHT:
		case KEYCODE_W:
		alert(e.keyCode);
	}
};
