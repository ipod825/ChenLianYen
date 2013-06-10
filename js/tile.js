function Tile(width, height){
	this.width = width;
	this.height = height;
	this.grid = new Array(this.width);
	for(var i=0; i<this.width; ++i){
		this.grid[i]=new Array(this.height);
		for(var j=0;j<this.height;++j){
			this.set(i,j,FREE);
		}
	}
}

Tile.prototype={

	clone : function(){
		result = new Tile(0,0);
		result.width=this.width;
		result.height=this.height;
		result.grid = new Array(result.width);
		for(var i=0; i<result.width; ++i){
			result.grid[i]=new Array(result.height);
			for(var j=0;j<result.height;++j){
				result.set(i,j,this.get(i,j));
			}
		}
		return result;
	},

	setArea : function(area, type){
		area = this.toTRectangle(area);
		for(var i=area.x;i<area.x+area.width;++i){
			for(var j=area.y;j<area.y+area.height;++j){
				this.set(i,j,type);
			}
		}
	},

	get : function(x,y){
		return this.grid[x][y];
	},

	set : function(x,y,value){
		this.grid[x][y]=value;
	},

	toTRoundIndex : function(index){
		return Math.round(index/TILE_SIZE);
	},

	toTIndex : function(index){
		return Math.floor(index/TILE_SIZE);
	},

	toTPoint : function(p,y){
		if(y)
			return new Point(this.toTIndex(p), this.toTIndex(y));
		else
			return new Point(this.toTIndex(p.x), this.toTIndex(p.y));
	},

	toTRectangle : function (r){
		return new Rectangle(this.toTRoundIndex(r.x),
			this.toTRoundIndex(r.y),
			this.toTRoundIndex(r.width),
			this.toTRoundIndex(r.height));

	},
}
