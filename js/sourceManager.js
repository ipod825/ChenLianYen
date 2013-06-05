/* Init:
 *
 * */
function SourceManager(width, height) {
	this.stage=null;
	this.width=width;
	this.height=height;

    this.numElementsToLoad = 0;
    this.numElementsLoaded = 0;

	this.audioExtension=null;

    this.downloadProgress;

	this.sounds={};
	this.images={};
	this.maps={};
	this.characters={};

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
	this.downloadProgress.x = (this.width / 2) - 50;
	this.downloadProgress.y = this.height / 2;
	this.stage.addChild(this.downloadProgress);

	//To show downloading progress
	Ticker.addListener(this);
	Ticker.setInterval(50);
},

/* Source downloading:
 *
 * Load  and cache the sources, assign the sources callback function to handleElementLoad
 */
 loadUI : function(obj, name){
	var self = this;
	++self.numElementsToLoad;
	obj.load("./CSS/UILayout.html", function(){
		 $(this).children().hide();
		 
		 window.UserInterface.initialize(this);
		 self.handleElementLoad();
   });
},

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

loadImage : function(obj, name){
	pattern=/.+\/(.+)\.png/;
	name=name.replace(pattern,'$1');
	if(this.images[name]){
		obj.setImage(this.images[obj.name]);
		return this.images[name];
	}
	++this.numElementsToLoad;
	url="Images/"+ name + '.png';
	img = new Image();
	img.src = url;
	img.onload = function(obj){
		obj.setImage(this.images[obj.name]);
		this.handleElementLoad();
	}.bind(this, obj);
	img.onerror = this.handleElementError;
	this.images[name]=img;
	return img;
},

loadCharacter : function(type, name){
	if (this.characters[name]) {
		return this.characters[name];
	}
	character = new Character(type, name);
	++this.numElementsToLoad;
	var url = 'Characters/' + name + '.json';
	var self=this;
	this.ajax(url, function(ret) {
		var prop= JSON.parse(ret);
		character.setProp(prop);
		self.loadImage(character, prop.image);
		self.handleElementLoad();
	});
	this.characters[name] = character;
	return character;
},

loadMap : function(name){
	if (this.maps[name]) {
		return this.maps[name];
	}
	map = new Map(name);
	++this.numElementsToLoad;
	var url = 'Maps/' + name + '.json';
	var self=this;
	this.ajax(url, function(ret) {
		var prop= JSON.parse(ret);
		map.setProp(prop);
		self.loadImage(map, map.imageName);
		self.handleElementLoad();
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
	this.downloadProgress.text = "Downloading " + Math.round((this.numElementsLoaded / this.numElementsToLoad) * 100) + " %";
	this.stage.update();
},


/* Single source onload callback:
 *
 * */
handleElementLoad : function() {
	++this.numElementsLoaded;

	if (this.numElementsLoaded === this.numElementsToLoad) {
		//remove progress bar
		this.stage.removeChild(this.downloadProgress);
		Ticker.removeAllListeners();
		this.numElementsLoaded = 0;
		this.numElementsToLoad = 0;
		this.onready();//set by setOnready
	}
},

handleElementError : function(e) {
	console.log("Error Loading Asset : " + e.target.src);
},
}
