function MyStage(canvas, sourceManager, player){
	Stage.call(this,canvas);
	width=$(canvas).width();
	height=$(canvas).height();
	this.center=new Point(width/2,height/2);		//The center of the screen
	this.viewBox=new MyRectangle(0,0,width,height);	//The bounding box of the screen
	this.bgBox;
	this.sourceManager = sourceManager;
	this.currentMap = null;
	this.player=player;
}


MyStageProtoType={

	setCurrentMap : function(mapName){
		this.currentMap = this.sourceManager.loadMap(mapName)
		this.removeAllChildren();
		bg=this.currentMap.image;
		this.addChild(bg);
		this.bgBox=new MyRectangle(bg.x, bg.y, bg.image.width, bg.image.height);
	},

	//Check if a tile is movable. The unit of pos is in pixel.
	//The object itself is passed to check the case that the object is just moving in the same tile(different pixel)
	isPassable : function(obj, pos){
		return this.currentMap.isPassable(obj, pos);
	},

	//Update the tiles when an object move
	resetObjectPosition : function(obj,newP){
		this.currentMap.resetObjectPosition(obj,newP);
	},

	//This function is for the player moving, which keeps the player in the center of the screen.
	moveOtherObjs: function(target, vX, vY){

		//We move other objects in x or y direction when the target is at the center of the moving axis
		if(vX!=0 && !this.currentMap.sameTileIndex(target.x, this.center.x))
			return false;
		if(vY!=0 && !this.currentMap.sameTileIndex(target.y, this.center.y))
			return false;

		//We do not move other objects if the viewBox is out of (intersect with) the background box
		if(this.viewBox.intersect(this.bgBox.move(-vX,-vY))){
			this.bgBox.move(vX,vY);
			return false;
		}

		//Move all objs except the target in the reverse direction
		kids=this.children;
		for(var i=0; i<kids.length;++i){
			if(kids[i]==target)
				continue;
			kids[i].x-=target.vX;
			kids[i].y-=target.vY;
		}
		return true;
	},

	setTarget : function(p){
		obj=this.currentMap.objectOnPos(p);
		this.player.setTarget({"obj":obj,"pos":p});
	}

}


MyStage.prototype = new Stage(); 
for (var obj in MyStageProtoType) { 
	MyStage.prototype[obj] = MyStageProtoType[obj]; 
} 
