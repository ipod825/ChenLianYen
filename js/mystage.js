FREE=0;
BLOCK=1;

function MyStage(canvas, sourceManager, player){
	Stage.call(this,canvas);
	width=$(canvas).width();
	height=$(canvas).height();
//	this.center= this.pointOnMap(width/2,height/2);	//The center of the screen
	this.center= new Point(width/2,height/2);	//The center of the screen
	this.viewBox=new MyRectangle(0,0,width,height);	//The bounding box of the screen
	this.bgBox;
	this.currentMap;
	this.bg;
	this.sourceManager = sourceManager;
	this.tiles;
	this.player=player;
	this.logger.setLogLevel("all");
}


MyStageProtoType={

	tag : "[Mystage]: ",
	logger : new ConsoleLogger(),

	/*	Init part
	 *
	 */
	setCurrentMap : function(mapName){
		this.currentMap = this.sourceManager.loadMap(mapName)
		this.removeAllChildren();
		this.bg=this.currentMap.image;
		bgWidth=this.bg.image.width;
		bgHeight=this.bg.image.height;
		this.addChild(this.bg);
		this.bgBox=new MyRectangle(this.bg.x, this.bg.y, bgWidth, bgHeight);
		this.initTiles(bgWidth, bgHeight);
	},

	initTiles : function(bgWidth, bgHeight){
		width = this.indexOnMap(bgWidth);
		height = this.indexOnMap(bgHeight);
		this.tiles = new Array(width);
		for(var i=0; i<width; ++i){
			this.tiles[i]=new Array(height);
			for(var j=0;j<height;++j){
				this.setTile(i,j,FREE);
			}
		}

		objs=this.currentMap.prop.layers[1].objects;
		for(var i=0; i<objs.length; ++i){
			this.setArea(this.rectangleOnMap(objs[i]), BLOCK);
		}
	},

	setArea : function(area, type){
		for(var i=area.x;i<area.x+area.width;++i){
			for(var j=area.y;j<area.y+area.height;++j){
				this.setTile(i,j,type);
			}
		}
	},


	checkCell : function(){
		for(var i=0;i<this.tiles.length;++i){
			for(var j=0;j<this.tiles[i].length;++j){
				//if(this.getTile(i,j)){
					var shape = new createjs.Shape();
					shape.graphics.beginStroke("f30000").drawRect(i*TILE_SIZE, j*TILE_SIZE, TILE_SIZE, TILE_SIZE);
					this.addChild(shape);
					//var text = new createjs.Text(i+","+j, "10px Arial", "#ff7700");
					//text.x=i*TILE_SIZE;
					//text.y=j*TILE_SIZE;
					//this.addChild(text);
				//}
			}
		}
	},

	/* APIs for object on the map
	 *
	 */

	//Add the object on the canvas and record it in the tiles
	addChildOnMap : function(child){
		this.setPosOnMap(child,new Point(child.x,child.y));
		Stage.prototype.addChild.call(this,child);
	},

	removeChildOnMap : function(child){
		this.setPosOnMap(FREE,new Point(child.x,child.y));
		Stage.prototype.removeChild.call(this,child);
	},

	//Check if a tile is movable. The unit of pos is in pixel.
	//The object itself is passed to check the case that the object is just moving in the same tile(different pixel)
	isPassable : function(obj, pos){
		p = this.relPointOnMap(pos);
		return (this.getTile(p.x,p.y)===obj || this.getTile(p.x, p.y)==FREE );
	},

	//The unit of beg and end are tiles
	findPath : function(beg, end){
		var graph = new Graph(this.tiles);
		var start = graph.nodes[beg.x][beg.y];
		var end = graph.nodes[end.x][end.y];
		path = astar.search(graph.nodes, start, end);
		path.unshift(start);
		return path;
	},

	//The input unit is pixel, the output position unit is tile
	setTarget : function(p){
		p=this.relPointOnMap(p);
		if(this.getTile(p.x,p.y)==BLOCK)
			return;
		obj=this.objectOnPos(p);
		this.player.setTarget({"obj":obj,"pos":p});
	},

	//Update the tiles when an object move
	setPosOnMap : function(obj,newP){
		newP=this.relPointOnMap(newP);
		if(obj.posOnMap.x !== newP.x || obj.posOnMap.y != newP.y){
			try{
				this.setTile(obj.posOnMap.x,obj.posOnMap.y,FREE);
			}
			catch(e){}
			this.setTile(newP.x,newP.y,obj);
			//this.logger.log(obj.posOnMap + " "+ newP);
			obj.posOnMap=newP;
		}
	},

	//This function is for the player moving, which keeps the player in the center of the screen.
	moveOtherObjs: function(target, vX, vY){

		//We move other objects in x or y direction when the target is at the center of the moving axis
		//if(vX!=0 && (target.posOnMap.x!=this.center.x))
		//	return false;
		//if(vY!=0 && (target.posOnMap.y!=this.center.y))
		//	return false;

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
		//renew the target's posOnMap
		this.setPosOnMap(target,new Point(target.x,target.y));
		return true;
	},

	/* Internal use
	 *
	 */

	objectOnPos: function(pos){
		obj=this.getTile(pos.x,pos.y);
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

	indexOnMap : function(index){
		return Math.round(index/TILE_SIZE);
	},

	pointOnMap : function(p,y){
		if(y)
			return new Point(this.indexOnMap(p), this.indexOnMap(y));
		else
			return new Point(this.indexOnMap(p.x), this.indexOnMap(p.y));
	},

	relPointOnMap : function(p){
		return this.pointOnMap(this.localToLocal(p.x,p.y,this.bg));
	},


	rectangleOnMap : function (r){
		return new Rectangle(this.indexOnMap(r.x),
			this.indexOnMap(r.y),
			this.indexOnMap(r.width),
			this.indexOnMap(r.height));

	},

	sameTileIndex :function(x1, x2){
		return (this.indexOnMap(Math.abs(x1-x2))==0);
	},
}

MyStage.prototype = new Stage(); 
for (var obj in MyStageProtoType) { 
	MyStage.prototype[obj] = MyStageProtoType[obj]; 
} 
