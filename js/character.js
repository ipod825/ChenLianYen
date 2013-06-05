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
	this.logger.setLogLevel("verbose");

	// Check input parameters
	if(!type)
	{ this.logger.error(this.tag, "Charcter: type undefined"); }
	if(!name)
	{ this.logger.error(this.tag, "Charcter: name undefined"); }
	if(!stage)
	{ this.logger.debug(this.tag, "Charcter: stage undefined"); }

	// Identity related variables
	this.name = name;       // Name of Character
	this.type = type;       // Identifier

	// Display related variables
	this.image = null;      // The image displayed on map
	this.prop = null;      

	// Animation related variables
	this.dirChange = false; // flag set when direction changes
	this.dir = DIR_RIGHT;   // The direction of character
	this.moving = false;    // whether the character is moving
	this.targetMet = true;
	this.pathToTarget;
	this.frequency = 1;     // Animation frequency
	this.step = 2;          // Velocity of moving for every frame
	this.posOnMap = new Point(-1,-1);

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
	dropItem : function(item){
		// TODO 
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
	setSpeedAndAnimation : function(vX,vY){
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
		// Check input target
		if(!target)
		{
			this.logger.error(this.tag, "setTarget: input target not exist");
			return;
		}
		// Target valid
		this.target = target;
		this.targetMet=false;
		this.pathToTarget = this.getStage().findPath(this.posOnMap, this.target.pos);
		this.pathToTarget.unshift(this.posOnMap);
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

	decideDirection : function(){
		if(this.posOnMap.x ==  this.pathToTarget[0].x && this.posOnMap.y == this.pathToTarget[0].y){
			this.pathToTarget.shift();
			if(this.pathToTarget.length==0){
				this.targetMet=true;
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
		if(!this.moving){
			if(this.targetMet)
				return;
		}

		if(!this.targetMet){
			if(this.posOnMap== this.target.pos){
				this.targetMet=true;
				this.setSpeedAndAnimation(0,0);
				return;
			}
			else{
				this.decideDirection();
			}
		}

		//Test if the new position can be passed
		newP = new Point(this.x + this.vX, this.y + this.vY);
		if(!this.getStage().isPassable(this, newP))
			return;
		
		if(this.type === PLAYER){
			if(!this.getStage().moveOtherObjs(this, this.vX, this.vY)){
				this.resetPosition(newP);
			}
		}
		else{
			this.resetPosition(newP);
		}
	},

	//notify the stage to matain its tiles
	resetPosition : function(newP){
		this.x = newP.x;
		this.y = newP.y;
		this.getStage().resetObjectPosition(this,newP);
	},

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
