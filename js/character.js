//TYPE definition
//PLAYER = 1;
//PLAYER = "Player";

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
var Character = function(_rpg){
	// For debugging
	this.logger.verbose(this.tag, "Character: +++START+++ ");

	// Call parent constructor
	MapObject.call(this, _rpg);

	// Animation related variables
	this.dirChange = false; // Flag set when direction changes
	this.dir = DIR_RIGHT;   // The direction of character
	this.moving = false;    // Whether the character is moving
	this.pathToTarget;
	this.frequency = 1;     // Animation frequency
	this.step = 3;          // Velocity of moving for every frame
	this.numFrameX = 4;
	this.numFrameY = 4;

	// Memeber objects and reference
	this.bag = {};                 // Items hold by character
	this.target = null;            // The targeting position or object
	//this.stage = this.getStage();  // reference of stage for dropping item
	this.animations={
		down:   {frames:[0,  0,  1,  1,  1,  2,  2,  3,  3,  3], 
					 next: "down", frequency:this.frequency},
		left:   {frames:[4,  4,  5,  5,  5,  6,  6,  7,  7,  7], 
					 next: "left", frequency:this.frequency},
		right:  {frames:[8,  8,  9,  9,  9,  10, 10, 11, 11, 11], 
					 next: "right", frequency:this.frequency},
		up:     {frames:[12, 12, 13, 13, 13, 14, 14, 15, 15, 15], 
					 next: "up", frequency:this.frequency},
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
	addItem : function(_item)
	{
		this.logger.verbose(this.tag, "addItem: +++START+++ _item.type = "
		                    + _item.type + ", _item.number = " + _item.number);
		if(_item && _item.type)
		{ 
			if(this.bag[_item.type])
			{
				this.bag[_item.type].number += _item.number;
			}
		}
		else
		{ 
			this.logger.error(this.tag, "addItem: input _item undefined"); 
		}
	},

	/*
	 * Function: dropItem
	 *     This function let player dropp the item choose by client. Usually
	 *     this function is invoked by UI when user choose the itme to drop
	 *
	 * Parameters:
	 *     item - the item to drop chosen by client
	 */
	dropItem : function(_item){
		this.logger.verbose(this.tag, "dropItem: +++START+++ _item.type = "
		                    + _item.type + ", _item.number = " + _item.number);
		if(_item && _item.type)
		{
			var stage = this.parent;
			if(stage)
			{ 
				stage.addChild(_item); 
				this.bag[_item.type] = null;
			}
			else
			{ 
				this.logger.error(this.tag, "dropItem: getStage() return undefined"); 
			}
		}
		else
		{
			this.logger.error(this.tag, "dropItem: _item or _item.type undefined");
		}
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
		prefix = this.moving? "" : "idle";
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
		this.pathToTarget = this.parent.findPath(this.posOnMap, this.target.pos);
	},

	setDirection : function(dir){
		//this.logger.verbose(this.tag, "setTarget: +++START+++ dirrection = " + dir);
		// This function is called as long as the direction key is pressed.
		// For performance concern, we reset its speed and animation only if the character 
		// change direction or it starts to move
		target = null;
		if(this.dir != dir || !this.moving){
			this.dir = dir;
			this.moving = true;
			dirIndex = this.dir - DIR_LEFT;
			vX=DIRUNIT[dirIndex].x*this.step;
			vY=DIRUNIT[dirIndex].y*this.step;
			this.setSpeedAndAnimation(vX,vY);
		}
	},

	moveTowardTarget: function(){
		if(this.target.posChanged()){
			this.target.updatePos();
			this.setTarget(this.target);
		}
		if(this.pathToTarget.length==0)
			return;
		if(this.posOnMap.equal(this.pathToTarget[0])){
			this.pathToTarget.shift();
			if(this.pathToTarget.length==0){
				//this.target = null;
				this.setSpeedAndAnimation(0,0);
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

	freeMove : function(){
	
	},

	searchTarget : function(){
	
	},

	setProp : function(prop){
		MapObject.prototype.setProp.call(this, prop);

		switch(prop.dir) {
			case "down":
				this.dir = DIR_DOWN;
				break;
			case "up":
				this.dir = DIR_UP;
				break;
			case "left":
				this.dir = DIR_LEFT;
				break;
			case "right":
				this.dir = DIR_DOWN;
				break;
			default:
				this.logger.error(this.log, "setProp: Undefined direction detected");
		}
	},

	/* 
	 * Function: tick
	 *     The main tick function, which is executed every loop
	 */
	tick : function(){
		if(!this.target){	//player doesn't need to do this
			this.searchTarget();
		}

		if(!this.moving && !this.target){ /* no need to move */ }
		else {
			this.move();
		}
	},

	/* 
	 * Function: move
	 * The move function which trigger animation based on direction
	 */
	move : function(){
		if(this.target)
			this.moveTowardTarget();
		else
			this.freeMove();

		// Test if the new position can be passed
		var newP = new Point(this.x + this.vX, this.y + this.vY);
		obj=this.parent.isPassable(this, newP);
		if(obj==BLOCK)
			return;
		else if(obj.type==ITEM){
			this.pickItem(obj);
			this.resetImage(obj.name);
			this.parent.removeChild(obj);
		}
		else if(obj.type==MONSTER){
			return;
		}

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
// Initialize prototype members
// For debuggging
Character.prototype.logger.setLogLevel("all");
