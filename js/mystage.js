FREE=0;
BLOCK=1;

function MyStage(canvas, sourceManager, player){
	Stage.call(this,canvas);
//	this.center= this.pointOnMap(width/2,height/2);	//The center of the screen
	this.center= new Point(canvas.width/2,canvas.height/2);	//The center of the screen
	this.viewBox=new MyRectangle(0,0,canvas.width,canvas.height);	//The bounding box of the screen
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


	/* APIs */

	/*
	 * Add child to the stage and record the information on the tiles
	 * Paramters:
	 * 	child : The object to be added to the stage
	 */
	addChild : function(child){
		if(child.posOnMap)
			this.setPosOnMap(child, child.getPos());
		Stage.prototype.addChild.call(this,child);
	},

	/*
	 * Answer if a tile is passable
	 * Paramters:
	 * 	obj : The object who queries
	 * 	pos : The queried position in pixel unit
	 * Return : bool
	 */
	isPassable : function(obj, pos){
		if(obj.dir==DIR_DOWN)
			p = this.relPointOnMap(new Point(pos.x,pos.y+16));
		else
			p = this.relPointOnMap(pos);
		if(p.equal(obj.posOnMap))
			return true;
		return ( this.getTile(p.x, p.y)==FREE );
	},

	/*
	 * Calculate the path between the begging and endding point
	 * Paramters:
	 * 	beg: The starting point of the path
	 * 	end: The ending point of the path
	 * Return : Path between beg and end
	 */
	findPath : function(beg, end){
		var graph = new Graph(this.tiles);
		var start = graph.nodes[beg.x][beg.y];
		var end = graph.nodes[end.x][end.y];
		path = astar.search(graph.nodes, start, end);
		path.unshift(start);
		return path;
	},

	/*
	 * Set the target for the player when user click on the canvas
	 * Paramters:
	 * 	p: The position in pixel unit
	 */
	setTarget : function(p){
		p=this.relPointOnMap(p);
		obj=this.objectOnPos(p);
		this.player.setTarget({"obj":obj,"pos":p});
	},

	/*
	 * Update the tiles when an object move
	 * Paramters:
	 * 	obj : The object who queries
	 * 	newP : The new position of the obj
	 */
	setPosOnMap : function(obj,newP){
		newP=this.relPointOnMap(newP);
		if(obj.posOnMap.x !== newP.x || obj.posOnMap.y != newP.y){
			try{
				this.setTile(obj.posOnMap.x,obj.posOnMap.y,FREE);
			}
			catch(e){}
			this.setTile(newP.x,newP.y,obj);
			obj.posOnMap=newP;
		}
	},

	/*
	 * Keeps the player moving in the center of the screen by  moving other objects in the reverse direction of the player.  This function might do nothing and return false in some conditions.
	 * Paramters:
	 * 	target : The target to keep in the center 
	 * 	vX, vY : The offset in x and y direction
	 * Return : bool
	 */
	moveOtherObjs: function(target, vX, vY){
		//We move other objects in x or y direction when the target is at the center of the moving axis
		//if(vX!=0 && (target.posOnMap.x!=this.center.x))
		//	return false;
		//if(vY!=0 && (target.posOnMap.y!=this.center.y))
		//	return false;

		//Do nothing if the target is not at the center of x(y) axis when it's moing on x(y) axis
		if(vX!=0 && !this.sameTileIndex(target.x, this.center.x))
			return false;
		if(vY!=0 && !this.sameTileIndex(target.y, this.center.y))
			return false;

		//Do nothing if the viewBox is out of (intersect with) the background box
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

	/* Internal use */

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

	roundIndexOnMap : function(index){
		return Math.round(index/TILE_SIZE);
	},

	indexOnMap : function(index){
		return Math.floor(index/TILE_SIZE);
	},

	pointOnMap : function(p,y){
		if(y)
			return new Point(this.indexOnMap(p), this.indexOnMap(y));
		else
			return new Point(this.indexOnMap(p.x), this.indexOnMap(p.y));
	},

	relPointOnMap : function(p){
		bgp=new Point(this.bg.x, this.bg.y);
		rel=this.localToLocal(p.x,p.y,this.bg);
		return this.pointOnMap(rel);
		//return this.pointOnMap(this.localToLocal(p.x,p.y,this.bg));
	},


	rectangleOnMap : function (r){
		return new Rectangle(this.roundIndexOnMap(r.x),
			this.roundIndexOnMap(r.y),
			this.roundIndexOnMap(r.width),
			this.roundIndexOnMap(r.height));

	},

	sameTileIndex :function(x1, x2){
		return (this.indexOnMap(Math.abs(x1-x2))==0);
	},

	/*	Init part */
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
				if(this.getTile(i,j)){
					var shape = new createjs.Shape();
					shape.graphics.beginStroke("f30000").drawRect(i*TILE_SIZE, j*TILE_SIZE, TILE_SIZE, TILE_SIZE);
					this.addChild(shape);
				}
			}
		}
	},
}

MyStage.prototype = new Stage(); 
for (var obj in MyStageProtoType) { 
	MyStage.prototype[obj] = MyStageProtoType[obj]; 
} 
