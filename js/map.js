FREE=0;
BLOCK=1;

function Map(name){
	this.prop;
	this.name=name;
	this.tileSize=32;
	this.cell;
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
	this.tiles = new Array(this.height);
	for(var i=0; i<this.height; ++i){
		this.tiles[i]=new Array(this.width);
		for(var j=0;j<this.width;++j){
			this.tiles[i][j]=FREE;
		}
	}

	objs=this.prop.layers[1].objects;
	for(var i=0; i<objs.length; ++i){
		r=this.getBlockRect(objs[i]);
		this.configureBlock(r.y,r.x,r.height,r.width,BLOCK);
	}
},

getBlockRect : function (o){
	return new Rectangle(this.toTileIndex(o.x),
						this.toTileIndex(o.y),
						this.toTileIndex(o.width),
						this.toTileIndex(o.height));
			
},

configureBlock : function(r, c, height, width, type){
	for(var i=r;i<r+height;++i){
		for(var j=c;j<c+width;++j){
			this.tiles[i][j]=type;
		}
	}
},

checkCell : function(){
	for(var i=0;i<this.height;++i){
		for(var j=0;j<this.width;++j){
			if(this.tiles[i][j]){
				var shape = new createjs.Shape();
				shape.graphics.beginStroke("f30000").drawRect(j*this.tileSize, i*this.tileSize, this.tileSize, this.tileSize);
				this.image.getStage().addChild(shape);
			
			}
		}
	}
},

isPassable : function(c,r){
	tiler=this.toTileIndex(r-this.image.y);
	tilec=this.toTileIndex(c-this.image.x);
	return (this.tiles[tiler][tilec]==FREE);
},

toTileIndex : function(index){
	return Math.round(index/this.tileSize);
},

setImage: function(img){
	this.image=new Bitmap(img);
	this.initCell(img.height, img.width);
},



}
