PLAYER = "Player";
MONSTER = "Monster";
NPC = "Npc";
ITEM = "Item";

function MapObject(){
	this.type=null;
	this.name=null;
	this.prop=null;
	this.posOnMap = new Point(-1,-1);
	// Display related variables
	this.numFrameX;
	this.numFrameY;
	this.images={};
	this.spriteSheets={};
	this.suffix=null;
	this.animations={};
}

MapObjectPrototype={

	//All dirived class can use this function to initial attributes with information recored in the map
	//    //Attributes that does not belong to the class will not be assigned
	//Attributes belongs to only the derived class will still be assigned
	setProp : function(prop){
		this.prop=prop;
		initP = toTPoint(new Point(this.prop.x, this.prop.y));
		center = this.tileCenter(initP);
		this.prop.x=center.x;
		this.prop.y=center.y;

		for (var p in this.prop) { 
			if(p in this)
				this[p] = this.prop[p]; 
		} 
	},

	addImage: function(imgName, img){
		this.images[imgName]=img;
	},

	addAttackAnimation : function(imgName, img){
		//for(var i=0;i<4;++i){
		//	this.addAnimation(imgName+DIRSTR[i], img, i*this.numFrameX, this.numFrameX, this.numFrameX, this.numFrameY);
		//}
		i=0;
		this.addAnimation(imgName+"down", img, i, this.numFrameX, this.numFrameX, this.numFrameY);
		i+=4;
		this.addAnimation(imgName+"left", img, i, this.numFrameX, this.numFrameX, this.numFrameY);
		i+=4;
		this.addAnimation(imgName+"right", img, i, this.numFrameX, this.numFrameX, this.numFrameY);
		i+=4;
		this.addAnimation(imgName+"up", img, i, this.numFrameX, this.numFrameX, this.numFrameY);
		i+=4;
	},

	addAnimation : function(name, img, start, length, numFrameX, numFrameY){
		animation = new Animation(this, img, start, length, numFrameX, numFrameY);
		this.animations[name]=animation;
	},

	playAnimation : function(suffix){
		suffix = (!suffix)?"":"_"+suffix;
		name = this.name+suffix;
		dirIndex = this.dir-DIR_LEFT;
		bitmap = this.animations[name+DIRSTR[dirIndex]];

		pos = new Point(this.x, this.y);
		this.parent.addChild(bitmap);
		bitmap.play(pos, true);
	},

	resetImage: function(suffix){
		suffix = (!suffix)?"":"_"+suffix;

		if(this.suffix && this.suffix==suffix) 
			return; 
		else this.suffix==suffix;

		img = this.images[this.name];
		frameWidth = img.width/this.numFrameX;
		frameHeight = img.height/this.numFrameY;

		var spriteSheet = new SpriteSheet({
			images: [img], //image to use
			frames: { width: frameWidth, height: frameHeight, regX: 0, regY: 0},
			animations: this.animations
		});
		this.regX=frameWidth/2;
		this.regY=frameHeight/2;
		this.spriteSheet = spriteSheet;
		//this.initialize(spriteSheet);
	},

	tileCenter : function(p){
		return p.scalarPlus(0.5).scalarMult(TILE_SIZE);
	},

	//notify the stage to matain its tiles
	setPosition : function(newP){
		this.x = newP.x;
		this.y = newP.y;
		this.parent.setPosOnTile(this,newP);
	},

	getPos : function(){
		return new Point(this.x, this.y);
	},

}

MapObject.prototype = new BitmapAnimation();
for (var obj in MapObjectPrototype) { 
	MapObject.prototype[obj] = MapObjectPrototype[obj]; 
} 

