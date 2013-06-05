//TYPE definition
//PLAYER = 1;
PLAYER = "player";

DIR_LEFT	= KEYCODE_LEFT;
DIR_UP 		= KEYCODE_UP;
DIR_RIGHT	= KEYCODE_RIGHT;
DIR_DOWN	= KEYCODE_DOWN;

//DIRECTION definition(same as keycode for convience)
DIRSTR = ["left","up","right","down"];
DIRUNIT=[{x:-1,y:0},{x:0,y:-1},{x:1,y:0},{x:0,y:1}];

/*
 * Class: Character
 *     This is base class of all movable objects on the map. It can be a
 *     player, a monster, or an NPC.
 * 
 * Parameters:
 *     type - the identifier of the player
 *     name - the name of the player
 *     stage - (optional) the stage reference
 */
var Character = function(type, name, stage){
	// For debuggging
	this.logger.setLogLevel("all");
	this.logger.verbose(this.tag, "Character: +++START+++ type = " + type 
	                    + ", name = " + name + ", stage = " + stage);

	// Check input parameters
	if(!type)
	{ this.logger.error(this.tag, "Character: type undefined"); }
	if(!name)
	{ this.logger.error(this.tag, "Character: name undefined"); }
	if(!stage)
	{ this.logger.debug(this.tag, "Character: stage undefined"); }

	// Identity related variables
	this.name = name;       // Name of Character
	this.type = type;       // Identifier

	// Display related variables
	this.image = null;      // The image displayed on map
	this.prop = null;      

	// Animation related variables
	this.posOnMap = new Point(-1,-1);
	this.dirChange = false; // Flag set when direction changes
	this.dir = DIR_RIGHT;   // The direction of character
	this.moving = false;    // Whether the character is moving
	this.targetMet = true;  // Default targetMet is true
	this.pathToTarget;
	this.frequency = 1;     // Animation frequency
	this.step = 2;          // Velocity of moving for every frame

	// Memeber objects and reference
	this.bag = [];                 // Items hold by character
	this.target = null;            // The targeting position or object
	//this.stage = this.getStage();  // reference of stage for dropping item
 
};

// The prototype defined as an object
var CharacterProtoType = { 

	// For debugging
	tag : "[Character]: ",
	logger : new ConsoleLogger(),

	/*
	 * Function: dropItem
	 *     This function let player dropp the item choose by client. Usually
	 *     this function is invoked by UI when user choose the itme to drop
	 *
	 * Parameters:
	 *     item - the item to drop chosen by client
	 */
	dropItem : function(item)
	{
		this.logger.verbose(this.tag, "dropItem: +++START+++ item.type = "
		                    + item.type + ", item.number = " + item.number);
		var removeIndex = this.bag.indexOf(item);
		this.splice(removeIndex, 1);
		var stage = this.getStage();
		if(!stage)
		{ this.logger.error(this.tag, "dropItem: getStage() return undefined"); }
		else
		{ this.stage.AddObject(item); }
	},

	/*
	 * Function: setSpeedAnaAnimation
	 *     This function set the animation related members in character
	 *
	 * Parameters:
	 *     vX - the velocity of the character in x direction
	 *     vY - the velocity of the character in y direction
	 */
	setSpeedAndAnimation : function(vX,vY)
	{
		//this.logger.verbose(this.tag, "setSpeedAndAnimation: +++START+++ "
		//                    + "vX = " + vX + ", vY = " + vY);
		this.vX=vX;
		this.vY=vY;
		this.moving = (this.vX!=0 || this.vY!=0);
		if(this.moving)
		{
			prefix = "walk";
			targetMet = false;
		}
		else
		{
			prefix = "idle";
			targetMet = true;
		}
		//prefix = this.moving? "walk" : "idle";
		this.gotoAndPlay(prefix + DIRSTR[this.dir-DIR_LEFT]);
	},

	/*
	 * Function: setTarget
	 *     This function is the public interface for setting the character's
	 *     target. When client click on the map, the stage class should set 
	 *     the character's target with this function
	 *
	 * Parameters:
	 *     target - the input target pass by other to set
	 */
	setTarget : function(target)
	{
		this.logger.verbose(this.tag, "setTarget: +++START+++ target = " + target);
		// Check input target
		if(!target)
		{
			this.target = null;
			this.targetMet = true;
			this.logger.error(this.tag, "setTarget: input target not exist");
			return;
		}
		// Target valid
		this.target = target;
		this.targetMet = false;
		this.pathToTarget = this.getStage().findPath(this.posOnMap, this.target.pos);
		this.pathToTarget.unshift(this.posOnMap);
	},

	setDirection : function(dir){
		// This function is called as long as the direction key is pressed.
		// For performance concern, we reset its speed and animation only if 
		// the character change direction or it starts to move
		//this.logger.verbose(this.tag, "setDirection: +++START+++ direction = " + dir);
		this.target = null;
		this.targetMet = false;
		if(this.dir != dir || !this.moving){
			this.dir = dir;
			this.moving = true;
			var dirIndex = this.dir - DIR_LEFT;
			var vX = DIRUNIT[dirIndex].x * this.step;
			var vY = DIRUNIT[dirIndex].y * this.step;
			this.setSpeedAndAnimation(vX,vY);
		}
	},

	decideDirection : function(){
		if(this.posOnMap.x ==  this.pathToTarget[0].x && this.posOnMap.y == this.pathToTarget[0].y){
			this.pathToTarget.shift();
			if(this.pathToTarget.length==0){
				this.targetMet = true;
				this.setSpeedAndAnimation(0,0);
				return;
			}
			diffx = this.pathToTarget[0].x-this.posOnMap.x;
			diffy = this.pathToTarget[0].y-this.posOnMap.y;
			var newDir;
			if(diffx==0)
				newDir=(diffy>0)?DIR_DOWN:DIR_UP;
			else
				newDir=(diffx>0)?DIR_RIGHT:DIR_LEFT;
			this.setDirection(newDir);
		}
	},

	setProp : function(prop){
		this.prop=prop;
		this.x=prop.x;
		this.y=prop.y;
	},

	initPosOnMap : function(){
		this.resetPosition(new Point(this.x, this.y));
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
				walkdown:   {frames:[0,  0,  1,  1,  1,  2,  2,  3,  3,  3], 
				             next: "walkdown", frequency:this.frequency},
				walkleft:   {frames:[4,  4,  5,  5,  5,  6,  6,  7,  7,  7], 
				             next: "walkleft", frequency:this.frequency},
				walkright:  {frames:[8,  8,  9,  9,  9,  10, 10, 11, 11, 11], 
				             next: "walkright", frequency:this.frequency},
				walkup:     {frames:[12, 12, 13, 13, 13, 14, 14, 15, 15, 15], 
				             next: "walkup", frequency:this.frequency},
				idledown:    [0,  0,  false],
				idleleft:    [4,  4,  false],
				idleright:   [8,  8,  false],
				idleup:      [12, 12, false]
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
		// TODO
		// This part still reports some error, but it may be resulted from that
		// the main loop is not controllable by object out of easel library
		if(!this.moving && this.targetMet)
		{ /* no need to move */ }
		else if(!this.moving && !this.targetMet)
		{ 
			// abnormal state but does happen
			this.logger.error(this.tag, "tick: not moving but target is not reached"); 
			this.move();
		}
		else if(this.moving && this.targetMet)
		{ 
			// abnormal state but does happen
			this.logger.error(this.tag, "tick: moving and target is reached"); 
			this.move();
		}
		else
		{
			this.move();
		}
	},

	/* 
	 * Function: move
	 * The move function which trigger animation based on direction
	 */
	move : function(){

		// Test if the new position can be passed
		var newP = new Point(this.x + this.vX, this.y + this.vY);
		if(!this.getStage().isPassable(this, newP))
			return;

		// Move the player or the background depending on the position
		if(this.type === PLAYER){
			if(!this.getStage().moveOtherObjs(this, this.vX, this.vY)){
				this.resetPosition(newP);
			}
		}
		else{
			this.resetPosition(newP);
		}

		if(!(this.target))
		{
			// Character is not targeting anything, just moving with keyboard
			// In this case, the targetMet should be true while not moving
			// and false while moving
			this.targetMet = true;
			return;
		}
		else 
		{
			// Still targeting something
			if(this.posOnMap == this.target.pos)
			{
				// Character is targeting something and reaches it
				this.targetMet = true;
				this.setSpeedAndAnimation(0,0);
				return;
			}
			else{
				// Character is targeting something but not reaches it
				this.decideDirection();
			}
		}

	},

	// Notify the stage to matain its tiles
	resetPosition : function(newP){
		this.x = newP.x;
		this.y = newP.y;
		this.getStage().resetObjectPosition(this,newP);
	},

	// Return the current position
	getPos : function(){
		return new Point(this.x, this.y);
	},

};

// Character inherits BitmapAnimation
Character.prototype = new BitmapAnimation(); 
// Assign the members in the prototype object into the character prototype
for (var obj in CharacterProtoType) { 
	Character.prototype[obj] = CharacterProtoType[obj]; 
} 
