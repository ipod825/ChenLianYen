function MyStage(canvas, sourceManager){
	Stage.call(this,canvas);
	width=$(canvas).width();
	height=$(canvas).height();
	this.center=new Point(width/2,height/2);		//The center of the screen
	this.viewBox=new MyRectangle(0,0,width,height);	//The bounding box of the screen
	this.sourceManager = sourceManager;
	this.currentMap = null;
	this.bg=null;	//The background object
}


MyStageProtoType={

setCurrentMap : function(mapName){
	this.currentMap = this.sourceManager.loadMap(mapName)
	this.removeAllChildren();
	this.bg=this.currentMap.image;
	this.addChild(this.bg);
},

isPassable : function(x,y){
	return this.currentMap.isPassable(x,y);
},

//This function is for the player moving, which keeps the player in the center of the screen.
moveOtherObjs: function(target, vX, vY){

	//We move other objects in x or y direction when the target is at the center of the moving axis
	if(vX!=0 && Math.abs(target.x-this.center.x)>target.step)
		return false;
	if(vY!=0 && Math.abs(target.y-this.center.y)>4)
		return false;

	//We do not move other objects if the viewBox is out of (intersect with) the background box
	bgBox=new MyRectangle(this.bg.x, this.bg.y, this.bg.image.width, this.bg.image.height);
	if(this.viewBox.intersect(bgBox.move(-vX,-vY)))
		return false;
		
	//Move all objs except the target in the reverse direction
	kids=this.children;
	for(i=0; i<kids.length;++i){
		if(kids[i]==target)
			continue;
		kids[i].x-=target.vX;
		kids[i].y-=target.vY;
	}
	return true;
},

}


MyStage.prototype = new Stage(); 
for (var obj in MyStageProtoType) { 
	MyStage.prototype[obj] = MyStageProtoType[obj]; 
} 
