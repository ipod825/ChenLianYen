//TYPE definition
PLAYER = 1;

//DIRECTION definition(same as keycode for convience)
DIR_UP 		= KEYCODE_UP;
DIR_LEFT	= KEYCODE_LEFT;
DIR_RIGHT	= KEYCODE_RIGHT;
DIR_DOWN	= KEYCODE_DOWN;


function Character(type,name){
	this.type = type;
	this.name = name;
	this.image;
	this.prop;
	this.dir=DIR_RIGHT;
	this.frequency=4;
	this.step=4;
}


CharacterProtoType = { 

setDirection : function(dir){
	this.dir=dir;

},

setProp : function(prop){
	this.prop=prop;
},

setImage: function(img){
	this.image=img;
	var spriteSheet = new SpriteSheet({
		images: [this.image], //image to use
		frames: { width: 32, height: 48, regX: 0, regY: 0},
		animations: {
			walkdown: 	{frames:[0, 3, "down", 4], frequency:this.frequency},
			walkleft: 	{frames:[4, 7, "left", 4], frequency:this.frequency},
			walkright: 	{frames:[8, 11, "right", 4], frequency:this.frequency},
			walkup: 	{frames:[12, 15, "up", 4], frequency:this.frequency},
			idledown: 	 [0, 0],
			idleleft: 	 [4, 4],
			idleright: 	 [8, 8],
			idleup: 	 [12,12]
		}
	});
	this.initialize(spriteSheet);
	this.gotoAndPlay("right");
	this.x=0;
	this.y=0;
	this.vX=this.step;
	this.vY=0;
	this.currentFrame=8;
},

tick : function(){
	this.move();
},

move : function(){
	switch (this.dir) {
		case DIR_UP:
			this.gotoAndPlay("walkup");
			this.vX=0;
			this.vY=-this.step;
			break;
		case DIR_DOWN:
			this.vX=0;
			this.vY=this.step;
			this.gotoAndPlay("walkdown");
			break;
		case DIR_LEFT:
			this.vX=-this.step;
			this.vY=0;
			this.gotoAndPlay("walkleft");
			break;
		case DIR_RIGHT:
			this.vX=this.step;
			this.vY=0;
			this.gotoAndPlay("walkright");
			break;
	}
	this.x += this.vX;
	this.y += this.vY;

},



}


Character.prototype = new BitmapAnimation(); 
for (var obj in CharacterProtoType) { 
	Character.prototype[obj] = CharacterProtoType[obj]; 
} 
