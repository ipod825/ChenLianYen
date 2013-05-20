/* Init:
 *
 * */
function SourceManager(rpg, stage, width, height) {
	this.rpg=rpg;
	this.stage=stage;
	this.width=width;
	this.height=height;

    this.numElementsToLoad = 0;
    this.numElementsLoaded = 0;

	this.audioExtension=null;

    this.downloadProgress;

	this.sounds={}
	this.images={}
	this.maps={}

	this.checkSoundExtension();

};

SourceManager.prototype={
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

/* Source adding:
 *
 * Sources of imgs, sounds,maps should be added before startDownload is called
 * The onready function should be set as the call back function after all the sources have been loaded
 * */
addImage : function(name){
	if(!this.images[name])
		this.images[name]=null;
},

addSound : function(name){
	if(!this.sounds[name])
		this.sounds[name]=null;
},

addMap : function(name){
	if(!this.maps[name])
		this.maps[name]=null;
},

setOnready : function (callbackMethod) {
	this.onready = callbackMethod;
},

startDownload : function () {
	this.downloadProgress = new Text("-- %", "bold 14px Arial", "#FFF");
	this.downloadProgress.x = (this.width / 2) - 50;
	this.downloadProgress.y = this.height / 2;
	this.stage.addChild(this.downloadProgress);

	// If the browser supports either MP3 or OGG
	if (this.audioExtension) {
		for(var name in this.sounds){
			this.loadAudio();
		}
	}
	for(var name in this.images){
		this.loadImage(name);
	}
	for(var name in this.maps){
		this.loadMap(name);
	}

	//To show downloading progress
	Ticker.addListener(this);
	Ticker.setInterval(50);
},

/* Source downloading:
 *
 * Load  and cache the sources, assign the sources callback function to handleElementLoad
 * */
loadAudio : function(name) {
	if(this.sounds[name])
		return;
	url = "Sounds/"+ key + audioExtension;
	audio = new Audio();
	audio.src = url;
	audio.load();
	this.sounds[name]=audio;
},

loadImage : function(name){
	if(this.images[name])
		return;
	++this.numElementsToLoad;
	url="Images/"+ name + '.jpg';
	img = new Image();
	img.src = url;
	img.onload = this.handleElementLoad.bind(this);
	img.onerror = this.handleElementError;
	this.images[name]=img;
},

loadMap : function(name){
	if (this.maps[name]) {
		onMapDataReady(maps[name]);
		return;
	}
	++this.numElementsToLoad;
	var url = 'Maps/' + name + '.json';
	var self=this;
	this.ajax(url, function(ret) {
		var map_data = JSON.parse(ret);
		self.maps[name] = map_data;
		self.handleElementLoad(null);
		self.rpg.onMapDataReady(map_data);
	});
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
	stage.update();
},


/* Source onload callbacks:
 *
 * */
handleElementLoad : function(e) {
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






