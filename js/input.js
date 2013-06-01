KEYCODE_SPACE = 32;
KEYCODE_UP = 38;
KEYCODE_LEFT = 37;
KEYCODE_RIGHT = 39;
KEYCODE_DOWN= 40;
function Input(rpg){
	this.rpg = rpg;
	this.player = rpg.player;
}

//Note: this function is called by the browser
Input.prototype.handleKeyDown = function (e) {
	switch (e.keyCode) {
		case KEYCODE_UP:
		case KEYCODE_DOWN:
		case KEYCODE_LEFT:
		case KEYCODE_RIGHT:
			this.player.setDirection(e.keyCode);
			break;
		default:
			//alert(e.keyCode);
			break;
	}
};

//Note: this function is not actually called by the browser
Input.prototype.handleKeyPress= function (e) {
};

Input.prototype.handleKeyUp = function (e) {
	this.player.setSpeedAndAnimation(0,0);
};
