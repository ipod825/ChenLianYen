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
