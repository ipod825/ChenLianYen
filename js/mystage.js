function MyStage(canvas){
	Stage.call(this,canvas);
	this.currentMap = null;
}


MyStageProtoType={

setCurrentMap : function(map){
	this.removeAllChildren();
	this.addChild(map.background);
	this.currentMap=map
}

}

MyStage.prototype = new Stage(); 
for (var obj in MyStageProtoType) { 
	MyStage.prototype[obj] = MyStageProtoType[obj]; 
} 
