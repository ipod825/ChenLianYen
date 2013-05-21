KEYCODE_SPACE = 32;
KEYCODE_UP = 38;
KEYCODE_LEFT = 37;
KEYCODE_RIGHT = 39;
KEYCODE_DOWN= 40;
function Input(rpg){
	this.rpg = rpg;
	this.player = rpg.player;
}

Input.prototype.handleKeyDown = function (e) {
	this.handleKeyPress(e);
};

Input.prototype.handleKeyPress= function (e) {
	switch (e.keyCode) {
		case KEYCODE_UP:
		case KEYCODE_DOWN:
		case KEYCODE_LEFT:
		case KEYCODE_RIGHT:
			this.player.setDirection(e.keyCode);
	}
	//alert(e.keyCode);
};

Input.prototype.handleKeyUp = function (e) {
	//switch (e.keyCode) {
	//	case KEYCODE_A: 
	//	case KEYCODE_LEFT: 
	//	case KEYCODE_D: 
	//	case KEYCODE_RIGHT:
	//	case KEYCODE_W:
	//	alert(e.keyCode);
	//}
};
