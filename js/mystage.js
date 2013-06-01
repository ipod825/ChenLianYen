function MyStage(canvas, sourceManager){
	Stage.call(this,canvas);
	width=$(canvas).width();
	height=$(canvas).height();
	this.center=new Point(width/2,height/2);
	this.sourceManager = sourceManager;
	this.currentMap = null;
	this.background=null;
}


MyStageProtoType={

setCurrentMap : function(mapName){
	this.currentMap = this.sourceManager.loadMap(mapName)
	this.removeAllChildren();
	this.background=this.currentMap.image;
	this.addChild(this.background);
},

//move all other objects in the reverse direction according to center
moveCenter : function(vX, vY){
	this.background.x-=vX;
	this.background.y-=vY;
},

}


MyStage.prototype = new Stage(); 
for (var obj in MyStageProtoType) { 
	MyStage.prototype[obj] = MyStageProtoType[obj]; 
} 
