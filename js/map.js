function Map(name){
	this.name = name;
	this.prop;
	this.images={};
	this.image;		//the background image
	this.tiles;
	this.layers={};
	this.logger.setLogLevel("verbose");

}

MapPrototype = {

	tag : "[Map]: ",
	logger : new ConsoleLogger(),

	setProp : function(prop){
		this.prop=prop;
		layersArr=this.prop.layers;
		for (i=0; i<layersArr.length; ++i)
			this.layers[layersArr[i].name]=layersArr[i];
	},

	setImage: function(imgName, img){
		this.images[imgName]=img;
	},

	changeImage: function(imgName){
		if(!imgName)
			imgName=this.name;
		img= this.images[imgName];
		this.width = img.width;
		this.height = img.height;
		this.tiles=new Tile(img.width, img.height);
		this.addChild(new Bitmap(img));

		

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
