function Map(name){
	this.name=name;
	this.prop;
	this.image;
}

Map.prototype = {

setProp : function(prop){
	this.prop=prop;
},

setImage: function(img){
	this.image=new Bitmap(img);
},



}
