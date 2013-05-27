function MyStage(canvas, sourceManager){
	Stage.call(this,canvas);
	this.sourceManager = sourceManager;
	this.currentMap = null;
}


MyStageProtoType={

setCurrentMap : function(mapName){
	this .currentMap = this.sourceManager.loadMap(mapName)
	this.removeAllChildren();
	this.addChild(this.currentMap.image);
}


}


MyStage.prototype = new Stage(); 
for (var obj in MyStageProtoType) { 
	MyStage.prototype[obj] = MyStageProtoType[obj]; 
} 
