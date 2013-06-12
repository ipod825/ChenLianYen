function MapObject(type, name){
	this.type=type;
	this.name=name;
	this.posOnMap = new Point(-1,-1);
	this.numFrameX;
	this.numFrameY;
	this.images={};
	this.suffix="none";
	this.animation={};
}

MapObjectPrototype={

	setProp : function(prop){
		this.prop=prop;
		initP = this.tileCenter(new Point(prop.x,prop.y));
		this.x=initP.x;
		this.y=initP.y;
	},

	addImage: function(imgName, img){
		this.images[imgName]=img;
	},

	resetImage: function(suffix){
		if(!suffix)
			suffix="";
		else
			suffix="_"+suffix; if(this.suffix==suffix) return; else this.suffix==suffix;

		img=this.images[this.name+suffix];
		frameWidth=img.width/this.numFrameX;
		frameHeight=img.height/this.numFrameY;
		this.regX=frameWidth/2;
		this.regY=frameHeight/2;
		var spriteSheet = new SpriteSheet({
			// The large image used to define frames
			images: [img], //image to use
			// Frame size definition
			frames: { width: frameWidth, height: frameHeight, regX: 0, regY: 0},
			//frames: { width: 100, height: 100, regX: 50, regY: 50},
			// The definition of every animation it takes and the transition relation
			animations: this.animations
		});
		// Set sprite sheet to bitmap animation
		this.initialize(spriteSheet);
	},

	tileCenter : function(p){
		return p.scalarMinus(0.5).scalarMult(TILE_SIZE);
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

