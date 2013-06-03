//TYPE definition
PLAYER = 1;

//DIRECTION definition(same as keycode for convience)
DIR_LEFT	= KEYCODE_LEFT;
DIR_UP 		= KEYCODE_UP;
DIR_RIGHT	= KEYCODE_RIGHT;
DIR_DOWN	= KEYCODE_DOWN;
DIRSTR = ["left","up","right","down"];
DIRUNIT=[{x:-1,y:0},{x:0,y:-1},{x:1,y:0},{x:0,y:1}];

/*
 * Class: Character
 *     This is base class of all movable objects on the map. It can be a
 *     player, a monster, or an NPC.
 */
var Character = function(type,name){

	this.type = type;       // Identifier
	this.name = name;       // Name of Character:w
	this.image = null;      // The image displayed on map
	this.prop = null;      
	this.dir = DIR_RIGHT;   // The direction of character
	this.moving=false;		// whether the character is moving
	this.dir = DIR_RIGHT;   // The direction of character
	this.dirChange = false;

	this.frequency = 1;     // Animation frequency
	this.step = 2;          // Velocity of moving for every frame

	this.target = null;     // The targeting position or object
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

	setSpeedAndAnimation : function(vX,vY){
		this.vX=vX;
		this.vY=vY;
		this.moving=(this.vX!=0 || this.vY!=0);
		prefix=this.moving?"walk":"idle";
		this.gotoAndPlay(prefix+DIRSTR[this.dir-DIR_LEFT]);
	},

	/*
	 * Function: setTarget
	 *     This function is the public interface for setting the character's
	 *     target. When client click on the map, the stage class should set 
	 *     the character's target with this function
	 *
	 * Parameters:
	 *     _target - the input target pass by other to set
	 */
	setTarget : function(_target)
	{
		// Check input target
		if(!_target)
		{
			this.logger.error(this.tag, "setTarget: input target not exist");
			return;
		}
		// Target valid
		this.target = _target;
	},

	setDirection : function(dir){
		// This function is called as long as the direction key is pressed.
		// For performance concern, we reset its speed and animation only if the character change direction or it starts to move
		if(this.dir != dir || !this.moving){
			this.dir = dir;
			this.moving = true;
			dirIndex = this.dir-DIR_LEFT;
			vX=DIRUNIT[dirIndex].x*this.step;
			vY=DIRUNIT[dirIndex].y*this.step;
			this.setSpeedAndAnimation(vX,vY);
		}
	},

	setProp : function(prop){
		this.prop=prop;
		this.x=prop.x;
		this.y=prop.y;
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
		this.setSpeedAndAnimation(0,0);

		// Start frame
		this.currentFrame=8;
	},

	/* 
	 * Function: tick
	 *     The main tick function, which is executed every loop
	 */
	tick : function(){
		this.move();
	},

	/* 
	 * Function: move
	 * The move function which trigger animation based on direction
	 */
	move : function(){
		if(!this.moving)
			return;

		//Test if the new position can be passed
		newx=this.x+this.vX;
		newy=this.y+this.vY;
		if(!this.parent.isPassable(newx,newy))
			return;
		
		if(this.type==PLAYER){
			if(!this.parent.moveOtherObjs(this, this.vX, this.vY)){
				this.x = newx;
				this.y = newy;
			}
		}
		else{
			this.x = newx;
			this.y = newy;
		}
	}

};

// Character inherits BitmapAnimation
Character.prototype = new BitmapAnimation(); 
// Assign the members in the prototype object into the character prototype
for (var obj in CharacterProtoType) { 
	Character.prototype[obj] = CharacterProtoType[obj]; 
} 
