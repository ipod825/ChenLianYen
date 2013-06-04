FREE=0;
BLOCK=1;

function Map(name){
	this.prop;
	this.name=name;
	this.tileSize=32;
	this.image;		//the background image
	this.width;		//number of tiles per row
	this.height;	//number of tiles per column
	this.logger.setLogLevel("verbose");

}

Map.prototype = {

	tag : "[Map]: ",
	logger : new ConsoleLogger(),

	setProp : function(prop){
		this.prop=prop;
		this.imageName=this.prop.tilesets[0].image;
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

		objs=this.prop.layers[1].objects;
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
				if(this.getTile(i,j)){
					var shape = new createjs.Shape();
					shape.graphics.beginStroke("f30000").drawRect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
					this.image.getStage().addChild(shape);

				}
			}
		}
	},

	isPassable : function(obj, pos){
		p = this.toTilePoint(new Point(pos.x-this.image.x, pos.y-this.image.y));
		return (this.getTile(p.x,p.y)===obj || this.getTile(p.x, p.y)==FREE );
	},

	resetObjectPosition : function(obj,newPos){
		newx=this.toTileIndex(newPos.x);
		newy=this.toTileIndex(newPos.y);
		if(obj.posOnMap.x!=newx || obj.posOnMap.y!=newy){
			try{
				this.setTile(obj.posOnMap.y,obj.posOnMap.x,FREE);

				//oldx=obj.posOnMap.x;
				//oldy=obj.posOnMap.y;
				//var shape = new createjs.Shape();
				//shape.graphics.beginStroke("230000").drawRect(oldx*this.tileSize, oldy*this.tileSize, this.tileSize, this.tileSize);
				//this.image.getStage().addChild(shape);
			}
			catch(e){}
			obj.posOnMap=new Point(newx,newy);
			this.setTile(newy,newx,obj);
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

	findPath : function(beg, end){
		var graph = new Graph(this.tiles);
		var start = graph.nodes[beg.x][beg.y];
		var end = graph.nodes[end.x][end.y];
		path = astar.search(graph.nodes, start, end);
		return path;
	},

	isSamePosOnMap : function(p1,p2){
		return(this.sameTileIndex(p1.x,p2.x) && this.sameTileIndex(p1.y,p2.y));
	},

	toTileRectangle: function (r){
		return new Rectangle(this.toTileIndex(r.x),
			this.toTileIndex(r.y),
			this.toTileIndex(r.width),
			this.toTileIndex(r.height));

	},

	setImage: function(img){
		this.image=new Bitmap(img);
		this.initCell(img.height, img.width);
	},
}
