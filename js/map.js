function Map(name){
	this.name=name;
	this.data;
	this.background;
}

Map.prototype = {

setData : function(data){
	this.data=data;
},

setBackground : function(img){
	this.background=new Bitmap(img);
},



}
