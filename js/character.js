//TYPE definition
PLAYER = 1;

//DIRECTION definition(same as keycode for convience)
DIR_UP 		= KEYCODE_UP;
DIR_LEFT	= KEYCODE_LEFT;
DIR_RIGHT	= KEYCODE_RIGHT;
DIR_DOWN	= KEYCODE_DOWN;

/*
 * The constructor of Character class
 */
var Character = function(type,name){

	this.type = type;       // Identifier
	this.name = name;       // Name of Character:w
	this.image = null;      // The image displayed on map
	this.prop = null;      
	this.dir = DIR_RIGHT;   // The direction of character
	this.dirChange = false;

	this.frequency = 1;     // Animation frequency
	this.step = 2;          // Velocity of moving for every frame

	this.bag = [];          // TODO Items hold by character

	this.stage = null;      // TODO reference of stage for dropping item

	// For debuggging
	this.logger.setLogLevel("verbose");
};


// The prototype defined as an object
var CharacterProtoType = { 

	// For debugging
	tag : "[Character]: ",
	logger : new ConsoleLogger(),

	dropItem : function(item){
		// TODO 
		var removeIndex = this.bag.indexOf(item);
		this.splice(removeIndex, 1);
		this.stage.AddObject(item);
	},

	setDirection : function(dir){
		if(this.dir !== dir)
		{
			this.dirChange = true;
			this.dir = dir;
		}
	},

	setProp : function(prop){
		this.prop=prop;
	},

	setImage: function(img){
		this.image=img;
		var spriteSheet = new SpriteSheet({
			// The large image used to define frames
			images: [this.image], //image to use
			// Frame size definition
			frames: { width: 32, height: 48, regX: 0, regY: 0},
			// The definition of every animation it takes and the transition relation
			animations: {
				walkdown: 	{frames:[0,  0,  1,  1,  1,  2,  2,  3,  3,  3], 
				             next: "walkdown", frequency:this.frequency},
				walkleft: 	{frames:[4,  4,  5,  5,  5,  6,  6,  7,  7,  7], 
				             next: "walkleft", frequency:this.frequency},
				walkright: 	{frames:[8,  8,  9,  9,  9,  10, 10, 11, 11, 11], 
				             next: "walkright", frequency:this.frequency},
				walkup: 	{frames:[12, 12, 13, 13, 13, 14, 14, 15, 15, 15], 
				             next: "walkup", frequency:this.frequency},
				idledown: 	 [0,  0,  false],
				idleleft: 	 [4,  4,  false],
				idleright: 	 [8,  8,  false],
				idleup: 	 [12, 12, false]
			}
		});
		// Set sprite sheet to bitmap animation
		this.initialize(spriteSheet);

		// Start at walkright frame
		this.gotoAndPlay("walkright");

		// Start position
		this.x=0;
		this.y=0;

		// Start velocity
		this.vX=this.step;
		this.vY=0;

		// Start frame
		this.currentFrame=8;
	},

	// The main tick function, which is executed every loop
	tick : function(){
		this.move();
	},

	// The move function which trigger animation based on direction
	move : function(){
		if(this.dirChange)
		{
			this.dirChange = false;
			switch (this.dir) {
				case DIR_UP:
					this.vX=0;
					this.vY=-this.step;
					this.gotoAndPlay("walkup");
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
		}
		this.x += this.vX;
		this.y += this.vY;
	},

};

// Character inherits BitmapAnimation
Character.prototype = new BitmapAnimation(); 
// Assign the members in the prototype object into the character prototype
for (var obj in CharacterProtoType) { 
	Character.prototype[obj] = CharacterProtoType[obj]; 
} 
