//TYPE definition
//PLAYER = 1;
PLAYER = "Player";

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
 */
var Character = function(type, name){
	// For debuggging
	this.logger.setLogLevel("all");
	this.logger.verbose(this.tag, "Character: +++START+++ type = " + type + ", name = " + name);

	// Check input parameters
	if(!type)
	{ this.logger.error(this.tag, "Character: type undefined"); }
	if(!name)
	{ this.logger.error(this.tag, "Character: name undefined"); }

	// Identity related variables
	this.name = name;       // Name of Character
	this.type = type;       // Identifier

	// Display related variables
	this.prop = null;      

	// Animation related variables
	this.displayObject = null;
	this.dirChange = false; // Flag set when direction changes
	this.dir = DIR_RIGHT;   // The direction of character
	this.moving = false;    // Whether the character is moving
	this.targetMet = true; 	// Default targetMet is true 
	this.pathToTarget;
	this.frequency = 1;     // Animation frequency
	this.step = 2;          // Velocity of moving for every frame
	this.numFrameX = 4;
	this.numFrameY = 4;
	this.suffix = "none";

	// Memeber objects and reference
	this.bag = [];                 // Items hold by character
	this.target = null;            // The targeting position or object
	//this.stage = this.getStage();  // reference of stage for dropping item
	this.animations={
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
};

// The prototype defined as an object
var CharacterProtoType = { 

	// For debugging
	tag : "[Character]: ",
	logger : new ConsoleLogger(),

	/*
	 * Function: addItem
	 *     This function add item to the bag of the character
	 * 
	 * Parameters: 
	 *     item - The item to add into bag
	 */
	addItem : function(item)
	{
		if(!item)
		{ this.logger.error(this.tag, "addItem: input item undefined"); }
		else
		{ this.bag.push(item); }
	},

	/*
	 * Function: dropItem
	 *     This function let player dropp the item choose by client. Usually
	 *     this function is invoked by UI when user choose the itme to drop
	 *
	 * Parameters:
	 *     item - the item to drop chosen by client
	 */
	dropItem : function(item){
		this.logger.verbose(this.tag, "dropItem: +++START+++ item.type = "
		                    + item.type + ", item.number = " + item.number);
		var removeIndex = this.bag.indexOf(item);
		this.splice(removeIndex, 1);
		var stage = this.getStage();
		if(!stage)
		{ this.logger.error(this.tag, "dropItem: getStage() return undefined"); }
		else
		{ this.stage.addChild(item); }
	},

	/*
	 * Function: setSpeedAnaAnimation
	 *     This function set the animation related members in character
	 *
	 * Parameters:
	 *     vX - the velocity of the character in x direction
	 *     vY - the velocity of the character in y direction
	 */
	setSpeedAndAnimation : function(vX,vY){
		//this.logger.verbose(this.tag, "setSpeedAndAnimation: +++START+++ "
		//                    + "vX = " + vX + ", vY = " + vY);
		this.vX=vX;
		this.vY=vY;
		this.moving = (this.vX!=0 || this.vY!=0);
		prefix = this.moving? "walk" : "idle";
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
			this.logger.error(this.tag, "setTarget: input target not exist");
			return;
		}
		// Target valid
		this.target = target;
		this.targetMet=false;
		this.pathToTarget = this.parent.findPath(this.posOnMap, this.target.pos);
	},

	setDirection : function(dir){
		//this.logger.verbose(this.tag, "setTarget: +++START+++ dirrection = " + dir);
		// This function is called as long as the direction key is pressed.
		// For performance concern, we reset its speed and animation only if the character change direction or it starts to move
		target = null;
		targetMet = false;
		if(this.dir != dir || !this.moving){
			this.dir = dir;
			this.moving = true;
			dirIndex = this.dir - DIR_LEFT;
			vX=DIRUNIT[dirIndex].x*this.step;
			vY=DIRUNIT[dirIndex].y*this.step;
			this.setSpeedAndAnimation(vX,vY);
		}
	},

	decideDirection : function(){
		if(this.posOnMap.x ==  this.pathToTarget[0].x && this.posOnMap.y == this.pathToTarget[0].y){
			this.pathToTarget.shift();
			if(this.pathToTarget.length==0){
				this.targetMet=true;
				this.setSpeedAndAnimation(0,0);
				this.logger.log("targetMet");
				return;
			}
			this.logger.log("Current:"+this.posOnMap+"tmpTarget:"+new Point(this.pathToTarget[0].x,this.pathToTarget[0].y)+"finalTaarget:"+this.pathToTarget[this.pathToTarget.length-1]);
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
		MapObject.prototype.setProp.call(this,prop);
		if(prop.dir=="down")
			this.dir=DIR_DOWN;
		else if(prop.dir=="up")
			this.dir=DIR_UP;
		else if(prop.dir=="left")
			this.dir=DIR_LEFT;
		else if(prop.dir=="right")
			this.dir=DIR_RIGHT;
	},

	/* 
	 * Function: tick
	 *     The main tick function, which is executed every loop
	 */
	tick : function(){
		if(!this.moving && this.targetMet){ /* no need to move */ }
		else
			this.move();
	},

	/* 
	 * Function: move
	 * The move function which trigger animation based on direction
	 */
	move : function(){
		if(!this.targetMet){
			this.decideDirection();
		}

		// Test if the new position can be passed
		var newP = new Point(this.x + this.vX, this.y + this.vY);
		if(!this.parent.isPassable(this, newP))
			return;

		if(this.type === PLAYER){
			//Keep the player moving at center if possible, otherwise, move it as usual
			if(this.parent.moveOtherObjs(this, this.vX, this.vY))
				this.setPosition(this.getPos());	//renew the posOnMap
			else
				this.setPosition(newP);				//fail to move in the center, move as usual
		}
		else{
			this.setPosition(newP);
		}
	},
};

// Character inherits BitmapAnimation
Character.prototype = new MapObject(); 
// Assign the members in the prototype object into the character prototype
for (var obj in CharacterProtoType) { 
	Character.prototype[obj] = CharacterProtoType[obj]; 
} 

