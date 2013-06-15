function Animation(owner, img, start, length, numFrameX, numFrameY){
		this.owner= owner;
		frequency=1;

		frameWidth = img.width/numFrameX;
		frameHeight = img.height/numFrameY;
		frameSeq =[];
		for(var i=0;i<length;++i)
			frameSeq.push(start+i);
		a = {
			play:   {frames: frameSeq , next: false, frequency:frequency*2}
		}
		var spriteSheet = new SpriteSheet({
			images: [img], //image to use
			frames: { width: frameWidth, height: frameHeight, regX: 0, regY: 0},
			animations:a
		});
		this.regX=frameWidth/2;
		this.regY=frameHeight/2;
		this.initialize(spriteSheet);
}

AnimationPrototype ={
	tag : "[Animation]: ",
	logger : new ConsoleLogger(),

	play : function(pos, hideOwner){
		this.x = pos.x;
		this.y = pos.y;
		if(hideOwner)
			this.owner.visible = false;;
		this.owner.parent.addChild(this);
		this.gotoAndPlay("play");
		Ticker.addListener(this);
	},
	tick : function(){
		if(this.paused){
			Ticker.removeListener(this);
			this.parent.removeChild(this);
			this.owner.visible = true;
		}
	},
}


Animation.prototype = new BitmapAnimation();
for (var obj in AnimationPrototype) { 
	Animation.prototype[obj] = AnimationPrototype[obj]; 
} 

