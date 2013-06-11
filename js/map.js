function Map(name){
	this.name = name;
	this.prop;
	//this.images={};
	this.images=[];
	this.tiles=null;
	this.tilesetIndex=[];
	this.layers={};
	this.logger.setLogLevel("verbose");
	this.bg;

}

MapPrototype = {

	tag : "[Map]: ",
	logger : new ConsoleLogger(),

	clone : function(){
		//Container c=Container.prototype.clone.call(this);
		//c.images=this.images;
	},

	setProp : function(prop){
		this.prop=prop;
		layersArr=this.prop.layers;
		for (i=0; i<layersArr.length; ++i)
			this.layers[layersArr[i].name]=layersArr[i];
	},

	getTilesetId: function(index){
		id=0;
		for(i=0;i<this.prop.tilesets.length;++i){
			if(index>this.prop.tilesets[i].firstgid){
				++id;
				continue;
			}
			return id;
		}
		return id-1;
	},

	addImage: function(imgName, img){
		//this.images[imgName]=img;
		this.images.push(img);
	},

	initTiles: function(){
		background=this.layers["Background"];
		this.width = background.width;
		this.height = background.height;
		this.tiles=new Tile(this.width, this.height);

		var spriteSheet = new SpriteSheet({
			// The large image used to define frames
			images: this.images,
			// Frame size definition
			frames: { width: TILE_SIZE, height: TILE_SIZE, regX: 0, regY: 0},
		});

		bmpSeq=new BitmapAnimation(spriteSheet);
		for(var y=0;y<this.height;++y){
			for(var x=0;x<this.width;++x){
				bmpSeq.x=x*TILE_SIZE;
				bmpSeq.y=y*TILE_SIZE;
				bmpSeq.currentFrame=background.data[y*this.width+x]-1;
				this.addChild(bmpSeq);
				bmpSeq = bmpSeq.clone();
			}
		}
		//this.addChild(new Bitmap(img));

		objs=this.layers["Items"].objects;
		for(var i=0; i<objs.length; ++i){
			bmpSeq.x=this.tiles.toTRoundIndex(objs[i].x)*TILE_SIZE;
			bmpSeq.y=this.tiles.toTRoundIndex(objs[i].y)*TILE_SIZE;
			bmpSeq.currentFrame=objs[i].gid-1;
			this.addChild(bmpSeq);
			bmpSeq = bmpSeq.clone();
		}
		
		objs=this.layers["Monsters"].objects;
		for(var i=0; i<objs.length; ++i){
			var gid=objs[i].gid;
			var tilesetId = this.getTilesetId(gid);
			var character = new Character(objs[i].type, objs[i].name);
			objs[i].x=this.tiles.toTRoundIndex(objs[i].x);
			objs[i].y=this.tiles.toTRoundIndex(objs[i].y);
			objs[i].dir=objs[i].properties.dir;
			character.setProp(objs[i]);
			character.addImage(objs[i].name,this.images[tilesetId]);
			character.resetImage();
			this.addChild(character);
		}

		objs=this.layers["Collision"].objects;
		for(var i=0; i<objs.length; ++i){
			this.tiles.setArea(objs[i], BLOCK);
		}
	},

}

Map.prototype= new Container();
for(var obj in MapPrototype){
	Map.prototype[obj]=MapPrototype[obj];
}
