PLAYER = 1;
function Charcater(type,name){
	this.type = type;
	this.name = name;
	this.image;
	this.prop;
}


Charcater.prototype ={ 

setProp : function(prop){
	this.prop=prop;
},

setImage: function(img){
	this.image=new Bitmap(img);
},

}


