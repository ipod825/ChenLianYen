function MyRectangle(left,top,width,height){
	this.left=left;
	this.top=top;
	this.right=left+width;
	this.bottom=top+height;
}

MyRectangle.prototype={

	move : function(vX, vY){
		this.top+=vY;
		this.left+=vX;
		this.bottom+=vY;
		this.right+=vX;
		return this;
	},

	intersect :function(that){
		return ( this.top<that.top ||	this.left<that.left ||	this.bottom>that.bottom ||	this.right>that.right);
	},

};

PointPrototype={
	equal : function(that){
		return (this.x==that.x && this.y==that.y);
	},

	plus : function(that){
		return new Point(this.x+that.x, this.y+that.y);
	},

	minus: function(that){
		return new Point(this.x-that.x, this.y-that.y);
	},

	scalarPlus : function(s){
		return new Point(this.x+s, this.y+s);
	},

	scalarMinus: function(s){
		return new Point(this.x-s, this.y-s);
	},

	scalarMult: function(multiplier){
		return new Point(this.x*multiplier, this.y*multiplier);
	},
}

for (var obj in PointPrototype) { 
	Point.prototype[obj] = PointPrototype[obj]; 
} 
