KEYCODE_SPACE = 32;
KEYCODE_UP = 38;
KEYCODE_LEFT = 37;
KEYCODE_RIGHT = 39;
KEYCODE_DOWN= 40;
KEYCODE_A = 65;
KEYCODE_ATTACK = KEYCODE_A;
function Input(rpg){
	this.rpg = rpg;
	this.logger=new ConsoleLogger();
	this.logger.setLogLevel("none");
}

Input.prototype={
handleClick : function(e){
	//this.player.setTarget(this.stage)
	//alert(e);
	//if(e.toElement.id=="rpgDiv")
		this.rpg.setTarget(new Point(e.offsetX, e.offsetY));
//		this.stage.setTarget(new Point(e.stageX, e.stageY));
},

//Note: this function is called by the browser
handleKeyDown : function (e) {
	switch (e.keyCode) {
		case KEYCODE_UP:
		case KEYCODE_DOWN:
		case KEYCODE_LEFT:
		case KEYCODE_RIGHT:
			this.rpg.player.setDirection(e.keyCode);
			break;
		case KEYCODE_ATTACK:
			this.rpg.player.attack();
			break;
		default:
			//alert(e.keyCode);
			break;
	}
},

//Note: this function is not actually called by the browser
handleKeyPress : function (e) {
},

handleKeyUp : function (e) {
	this.rpg.player.setSpeedAndAnimation(0,0);
},

}
