
function Map(){
	this.prop;
	this.image;		//the background image
	this.logger.setLogLevel("verbose");

}

Map.prototype = {

	tag : "[Map]: ",
	logger : new ConsoleLogger(),

	setProp : function(prop){
		this.prop=prop;
		this.imageName=this.prop.tilesets[0].image;
	},


	setImage: function(img){
		this.image=new Bitmap(img);
	},
}
