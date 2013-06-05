FREE=0;
BLOCK=1;

function MyStage(canvas, sourceManager, player){
	Stage.call(this,canvas);
	width=$(canvas).width();
	height=$(canvas).height();
	this.center=new Point(width/2,height/2);		//The center of the screen
	this.viewBox=new MyRectangle(0,0,width,height);	//The bounding box of the screen
	this.bgBox;
	this.currentMap;
	this.bg;
	this.sourceManager = sourceManager;
	this.width;		//number of tiles per row
	this.height;	//number of tiles per column
	this.tiles;
	this.tileSize=TILE_SIE;
	this.player=player;
}


MyStageProtoType={

	setCurrentMap : function(mapName){
		this.currentMap = this.sourceManager.loadMap(mapName)
		this.removeAllChildren();
		this.bg=this.currentMap.image;
		bgWidth=this.bg.image.width;
		bgHeight=this.bg.image.height;
		this.addChild(this.bg);
		this.bgBox=new MyRectangle(this.bg.x, this.bg.y, bgWidth, bgHeight);
		this.initCell(bgWidth, bgHeight);
	},

	//Check if a tile is movable. The unit of pos is in pixel.
	//The object itself is passed to check the case that the object is just moving in the same tile(different pixel)
	isPassable : function(obj, pos){
		p = this.toTilePoint(new Point(pos.x-this.bg.x, pos.y-this.bg.y));
		return (this.getTile(p.x,p.y)===obj || this.getTile(p.x, p.y)==FREE );
	},

	isSamePos: function(p1,p2){
		return(this.sameTileIndex(p1.x,p2.x) && this.sameTileIndex(p1.y,p2.y));
	},

	posOnMap : function(p){
		return this.toTilePoint(p);
	},

	findPath : function(beg, end){
		var graph = new Graph(this.tiles);
		var start = graph.nodes[beg.x][beg.y];
		var end = graph.nodes[end.x][end.y];
		path = astar.search(graph.nodes, start, end);
		path.unshift(start);
		return path;
	},

	//Update the tiles when an object move
	resetObjectPosition : function(obj,newPos){
		newP=this.toTilePoint(new Point(newPos.x-this.bg.x, newPos.y-this.bg.y));
		if(obj.posOnMap.x != newP){
			try{
				this.setTile(obj.posOnMap.x,obj.posOnMap.y,FREE);

				//oldx=obj.posOnMap.x;
				//oldy=obj.posOnMap.y;
				//var shape = new createjs.Shape();
				//shape.graphics.beginStroke("230000").drawRect(oldx*this.tileSize, oldy*this.tileSize, this.tileSize, this.tileSize);
				//this.image.getStage().addChild(shape);
			}
			catch(e){}
			obj.posOnMap=newP;
			this.setTile(newP.x,newP.y,obj);
		}

	},

	//This function is for the player moving, which keeps the player in the center of the screen.
	moveOtherObjs: function(target, vX, vY){

		//We move other objects in x or y direction when the target is at the center of the moving axis
		if(vX!=0 && !this.sameTileIndex(target.x, this.center.x))
			return false;
		if(vY!=0 && !this.sameTileIndex(target.y, this.center.y))
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
		obj=this.objectOnPos(p);
		this.player.setTarget({"obj":obj,"pos":this.toTilePoint(p)});
	},

	initCell : function(pixHeight, pixWidth){
		this.height = this.toTileIndex(pixHeight);
		this.width = this.toTileIndex(pixWidth);
		this.tiles = new Array(this.width);
		for(var i=0; i<this.width; ++i){
			this.tiles[i]=new Array(this.height);
			for(var j=0;j<this.height;++j){
				this.setTile(i,j,FREE);
			}
		}

		objs=this.currentMap.prop.layers[1].objects;
		for(var i=0; i<objs.length; ++i){
			this.setArea(this.toTileRectangle(objs[i]), BLOCK);
		}
	},

	setArea: function(area, type){
		for(var i=area.x;i<area.x+area.width;++i){
			for(var j=area.y;j<area.y+area.height;++j){
				this.setTile(i,j,type);
			}
		}
	},

	checkCell : function(){
		for(var i=0;i<this.width;++i){
			for(var j=0;j<this.height;++j){
				//if(this.getTile(i,j)){
					var shape = new createjs.Shape();
					shape.graphics.beginStroke("f30000").drawRect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
					this.addChild(shape);

				//}
			}
		}
	},



	objectOnPos: function(pos){
		p = this.toTilePoint(pos);
		obj=this.getTile(p.x,p.y);
		if(obj<=BLOCK)
			obj=null;
		return obj;
	},

	getTile : function(x,y){
		return this.tiles[x][y];
	},

	setTile : function(x,y,value){
		this.tiles[x][y]=value;
	},

	toTileIndex : function(index){
		return Math.round(index/this.tileSize);
	},

	toTilePoint : function(p){
		return new Point(this.toTileIndex(p.x), this.toTileIndex(p.y));
	},

	sameTileIndex :function(x1, x2){
		return (this.toTileIndex(Math.abs(x1-x2))==0);
	},



	toTileRectangle: function (r){
		return new Rectangle(this.toTileIndex(r.x),
			this.toTileIndex(r.y),
			this.toTileIndex(r.width),
			this.toTileIndex(r.height));

	},

}


MyStage.prototype = new Stage(); 
for (var obj in MyStageProtoType) { 
	MyStage.prototype[obj] = MyStageProtoType[obj]; 
} 
