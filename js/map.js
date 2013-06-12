FREE=0;
BLOCK=1;

function Map(name, cw, ch){
	this.name = name;
	this.center= new Point(cw/2,ch/2);	//The center of the screen
	this.viewBox=new MyRectangle(0,0,cw,ch);	//The bounding box of the screen
	this.prop;
	this.images={};
	this.tiles=null;
	this.layers={};
	this.characters=[];
	this.player;
	this.logger.setLogLevel("verbose");

}

MapPrototype = {

	tag : "[Map]: ",
	logger : new ConsoleLogger(),

	/* APIS*/

	/* Get the object on the pos 
	 * Paramters:
	 * 	pos: The position in pixel unit
	 */
	targetOnPos: function(pos){
		p=this.relPointOnTile(pos);
		obj=this.tiles.get(p.x,p.y);
		if(obj<=BLOCK)
			obj=null;
		target={"obj":obj,"pos":p};
		return target;
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
			p = this.relPointOnTile(new Point(pos.x,pos.y+16));
		else
			p = this.relPointOnTile(pos);
		if(p.equal(obj.posOnMap))
			return true;
		return ( this.tiles.get(p.x, p.y)==FREE );
	},


	/*
	 * Add child to the stage and record the information on the tiles
	 * Paramters:
	 * 	child : The object to be added to the stage
	 */
	addChild : function(child){
		if(child.posOnMap)
			this.setPosOnTile(child, child.getPos());
		Container.prototype.addChild.call(this,child);
	},

	/*
	 * Calculate the path between the begging and endding point
	 * Paramters:
	 * 	beg: The starting point of the path
	 * 	end: The ending point of the path
	 * Return : Path between beg and end
	 */
	findPath : function(beg, end){
		var graph = new Graph(this.tiles.grid);
		var start = graph.nodes[beg.x][beg.y];
		var end = graph.nodes[end.x][end.y];
		path = astar.search(graph.nodes, start, end);
		path.unshift(start);
		return path;
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
		if(vX!=0 && !this.sameTileIndex(target.x+this.x, this.center.x))
			return false;
		if(vY!=0 && !this.sameTileIndex(target.y+this.y, this.center.y))
			return false;

		//Do nothing if the viewBox is out of (intersect with) the background box
		if(this.viewBox.intersect(this.bgBox.move(-vX,-vY))){
			this.bgBox.move(vX,vY);
			return false;
		}

		this.x-=target.vX;
		this.y-=target.vY;
		target.x+=target.vX;
		target.y+=target.vY;
		return true;
	},

	/*
	 * Update the tiles when an object move
	 * Paramters:
	 * 	obj : The object who queries
	 * 	newP : The new position of the obj
	 */
	setPosOnTile : function(obj,newP){
		newP=this.relPointOnTile(newP);
		if(obj.posOnMap.x !== newP.x || obj.posOnMap.y != newP.y){
			try{
				this.tiles.set(obj.posOnMap.x,obj.posOnMap.y,FREE);
			}
			catch(e){}
			this.tiles.set(newP.x,newP.y,obj);
			obj.posOnMap=newP;
		}
	},


	/* Initial processes*/

	/* Rcord all images related to this map, called when a image has been ready
	 * Paramters:
	 * 	imgName: the name of the image
	 * 	img: the img object to be recorded
	 */
	addImage: function(imgName, img){
		this.images[imgName]=img;
	},

	/* Init the map tiles when the map json file is ready
	 * Paramters:
	 * 	prop: json object
	 */
	setProp : function(prop){
		this.prop=prop;
		layersArr=this.prop.layers;
		for (i=0; i<layersArr.length; ++i)
			this.layers[layersArr[i].name]=layersArr[i];
		this.initTiles();
	},

	initTiles : function(){
		background=this.layers["Background"];
		this.width = background.width;
		this.height = background.height;
		this.bgBox=new MyRectangle(0, 0, this.width*TILE_SIZE, this.height*TILE_SIZE);
		this.tiles=new Tile(this.width, this.height);

		objs=this.layers["Collision"].objects;
		for(var i=0; i<objs.length; ++i){
			this.tiles.setArea(objs[i], BLOCK);
		}
	
	},

	/* Put everything(background tiles, characters, items) in to the container, called when all images for this map are ready.
	 */
	initGraphics: function(){
		imgs=objToArray(this.images);
		var spriteSheet = new SpriteSheet({
			// The large image used to define frames
			images: imgs,
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

		objs=this.layers["Items"].objects;
		for(var i=0; i<objs.length; ++i){
			bmpSeq.x=this.tiles.toTRoundIndex(objs[i].x)*TILE_SIZE;
			bmpSeq.y=this.tiles.toTRoundIndex(objs[i].y)*TILE_SIZE;
			bmpSeq.currentFrame=objs[i].gid-1;
			this.addChild(bmpSeq);
			bmpSeq = bmpSeq.clone();
		}
		
		objs=this.layers["Characters"].objects;
		for(var i=0; i<objs.length; ++i){
			var character = this.loadCharacter(i,objs[i]);
			if(character.name=="player")
				this.player=character;
			//else
				this.addChild(character);

			Ticker.addListener(character);
		}
	},

	loadCharacter : function(id, prop){
		var character;
		if(this.characters[id]){
			character =	this.characters[id];
		}
		else{
			character = new Character(prop.type, prop.name);
			this.characters[id]=character;
		}
		prop.x=this.tiles.toTRoundIndex(prop.x);
		prop.y=this.tiles.toTRoundIndex(prop.y);
		prop.dir=prop.properties.dir;
		character.setProp(prop);
		character.addImage(prop.name,this.images[prop.name]);
		character.resetImage();
		character.setSpeedAndAnimation(0,0);
		return character;
	},

	checkCell : function(){
		for(var i=0;i<this.tiles.width;++i){
			for(var j=0;j<this.tiles.height;++j){
				if(this.tiles.get(i,j)==BLOCK){
					var shape = new createjs.Shape();
					shape.graphics.beginStroke("f30000").drawRect(i*TILE_SIZE, j*TILE_SIZE, TILE_SIZE, TILE_SIZE);
					this.addChild(shape);
				}
			}
		}
	},

	/* Inernal use */

	sameTileIndex :function(x1, x2){
		return (this.tiles.toTIndex(Math.abs(x1-x2))==0);
	},

	relPointOnTile : function(p){
		return this.tiles.toTPoint(this.localToLocal(p.x,p.y,this));
	},
}

Map.prototype= new Container();
for(var obj in MapPrototype){
	Map.prototype[obj]=MapPrototype[obj];
}
