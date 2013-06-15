/* Init:
 *
 * */
function SourceManager(rpg, width, height) {
	this.rpg = rpg;
	this.stage=null;
	this.canvasWidth=width;
	this.canvasHeight=height;

	this.numElementsToLoad = 0;
	this.numElementsLoaded = 0;

	this.audioExtension=null;

	this.downloadProgress=null;

	this.sounds={};
	this.images={};
	this.maps={};
	this.characters={};
	this.items={};
	this.mapObjs={};

	this.onready=null;
	this.checkSoundExtension();

};

SourceManager.prototype={

setStage : function(stage){
	this.stage=stage;
},

checkSoundExtension : function(){
	// Need to check the canPlayType first or an exception will be thrown for those browsers that don't support it      
	var myAudio = document.createElement('audio');
	var canPlayMp3;
	var canPlayOgg;

	if (myAudio.canPlayType) {
		// Currently canPlayType(type) returns: "", "maybe" or "probably" 
		canPlayMp3 = !!myAudio.canPlayType && "" != myAudio.canPlayType('audio/mpeg');
		canPlayOgg = !!myAudio.canPlayType && "" != myAudio.canPlayType('audio/ogg; codecs="vorbis"');
	}
		
	if (canPlayMp3)
		this.audioExtension = ".mp3";
	else if (canPlayOgg) {
		this.audioExtension = ".ogg";
	}

},

/* Set callback:
 *
 * Callback After sources have been downloaded
 */

setOnReady: function (callbackMethod) {
	this.onready = callbackMethod;
	this.downloadProgress = new Text("-- %", "bold 14px Arial", "#FFF");
	this.downloadProgress.x = (this.canvasWidth / 2) - 50;
	this.downloadProgress.y = this.canvasHeight / 2;
	this.stage.addChild(this.downloadProgress);

	//To show downloading progress
	Ticker.addListener(this);
	Ticker.setInterval(50);
},

/* Source downloading:
 *
 * Load  and cache the sources, assign the sources callback function to handleElementLoad
 */
/*
loadUI : function(obj, name){
	var self = this;
	++self.numElementsToLoad;
	obj.load("./CSS/UILayout.html", function(){
		$(this).children().hide();
		window.UserInterface.initialize($(this));
		self.handleElementLoad();
	});
},
*/

loadAudio : function(name) {
	if (!this.audioExtension)
		return;
	if(this.sounds[name])
		return;
	url = "Sounds/"+ key + audioExtension;
	audio = new Audio();
	audio.src = url;
	audio.load();
	this.sounds[name]=audio;
},

loadImage : function(obj, name, callback){
	pattern=/(.+\/)?(.+)\.png/;
	name=name.replace(pattern,'$2');
	if(this.images[name]){
		//obj.setImage(this.images[name]);
		return this.images[name];
	}
	++this.numElementsToLoad;
	url="Images/"+ name + '.png';
	img = new Image();
	img.src = url;
	img.onload = function(obj){
		obj.addImage(name, this.images[name]);
		if(callback){
			callback(name, this.images[name]);
		}
		this.handleElementLoad();
	}.bind(this, obj);
	img.onerror = this.handleElementError;
	this.images[name]=img;
	return img;
},


loadMapObject: function(id, prop){
	var mapObjs;
	if(prop.type=="Item")
		mapObjs=this.items;
	else
		mapObjs=this.characters;

	var mapObj;
	if(mapObjs[id])
		mapObj =	mapObjs[id];
	else{
		//To avoid switch case, identify the constructor as a function point by prop.type
		//Note that "prop.type" must be the same with the class name for this trick to work
		constructorPtr = window[prop.type];
		mapObj = new constructorPtr(this.rpg);
		mapObjs[id]=mapObj;
	}
	mapObj.setProp(prop);
	mapObj.addImage(prop.name,this.images[prop.name]);
	if(mapObj.suffix){
		n=mapObj.name+"_"+mapObj.suffix;
		this.loadImage(mapObj, n, mapObj.addAttackAnimation.bind(mapObj));
	}
	mapObj.resetImage();
	if(prop.type=="Item")
		mapObj.gotoAndPlay("idle");
	else if(prop.type==PLAYER)
		mapObj.setSpeedAndAnimation(0,0);
	return mapObj;
},

loadMap : function(name){
	if (this.maps[name]) {
		return this.maps[name];
	}
	map = new Map(name, this);
	++this.numElementsToLoad;
	var url = 'Maps/' + name + '.json';
	var self=this;
	this.ajax(url, function(ret) {
		var prop= JSON.parse(ret);
		map.setProp(prop);
		for(var i=0; i<prop.tilesets.length; ++i){
			//To ensure the order of images is the same as the tilesets order
			pattern=/(.+\/)?(.+)\.png/;
			name=prop.tilesets[i].image.replace(pattern,'$2');
			map.addImage(name, null);

			self.loadImage(map, prop.tilesets[i].image);
		}
		self.handleElementLoad(name);
	});
	this.maps[name] = map;
	return map;
},

ajax : function(name, callback) {
	var xhr; 
	try {  xhr = new ActiveXObject('Msxml2.XMLHTTP');   }
	catch (e) 
	{
		try {  xhr = new ActiveXObject('Microsoft.XMLHTTP');    }
		catch (e2) 
		{
		try {  xhr = new XMLHttpRequest();     }
		catch (e3) {  xhr = false;   }
		}
	}

	xhr.onreadystatechange  = function() { 
		 if(xhr.readyState  == 4)  {
			  if(xhr.status  == 200) {
					callback(xhr.responseText);
			  }
		 }
	}; 

   xhr.open("GET", name,  true); 
   xhr.send(null); 

},

// Showing the process % of download
tick : function() {
	//this.downloadProgress.text = "Downloading " + Math.round((this.numElementsLoaded / this.numElementsToLoad) * 100) + " %";
	this.stage.update();
},


/* Single source onload callback:
 *
 * */
handleElementLoad : function() {
	++this.numElementsLoaded;

	if (this.numElementsLoaded === this.numElementsToLoad) {
		//remove progress bar
		if(this.downloadProgress){
			this.stage.removeChild(this.downloadProgress);
			Ticker.removeAllListeners();
		}
		this.numElementsLoaded = 0;
		this.numElementsToLoad = 0;
		if(this.onready)
			this.onready();//set by setOnready

		this.onready=null;
		this.downloadProgress=null;
	}
},

handleElementError : function(e) {
	console.log("Error Loading Asset : " + e.target.src);
},
}
