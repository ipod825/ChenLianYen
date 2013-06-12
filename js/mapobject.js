function MapObject(type, name){
	this.type=type;
	this.name=name;
	this.posOnMap=null;
	this.numFrameX;
	this.numFrameY;
	this.images={};
	this.suffix="none";
	this.animation={};

}

MapObjectPrototype={
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

}

MapObject.prototype = new BitmapAnimation();
for (var obj in MapObjectPrototype) { 
	MapObject.prototype[obj] = MapObjectPrototype[obj]; 
} 

