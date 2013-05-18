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

	var self=this;


	//this method is put here bcause I can not access the instance reference from inside the closure
	this.handleElementLoad= function(e) {
		++self.numElementsLoaded;

		if (self.numElementsLoaded === self.numElementsToLoad) {
			self.stage.removeChild(self.downloadProgress);
			Ticker.removeAllListeners();
			self.numElementsLoaded = 0;
			self.numElementsToLoad = 0;
			self.onready();//set by setOnready
		}
	};

	// setting the callback method
	// Triggered once everything is ready to be drawned on the canvas
	this.setOnready = function (callbackMethod) {
		self.onready = callbackMethod;
	};


};

SourceManager.prototype.checkSoundExtension = function(){
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

};


SourceManager.prototype.addImage = function(name){
	if(!this.images[name])
		this.images[name]=null;
};

SourceManager.prototype.addSound = function(name){
	if(!this.sounds[name])
		this.sounds[name]=null;
};

SourceManager.prototype.addMap= function(name){
	if(!this.maps[name])
		this.maps[name]=null;
};

SourceManager.prototype.startDownload = function () {
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

	Ticker.addListener(this);
	Ticker.setInterval(50);
};

SourceManager.prototype.loadAudio = function(name) {
	if(this.sounds[name])
		return;
	url = "Sounds/"+ key + audioExtension;
	audio = new Audio();
	audio.src = url;
	audio.load();
	this.sounds[name]=audio;
};

SourceManager.prototype.loadImage = function(name){
	if(this.images[name])
		return;
	++this.numElementsToLoad;
	url="Images/"+ name + '.jpg';
	img = new Image();
	img.src = url;
	img.onload = this.handleElementLoad;
	img.onerror = this.handleElementError;
	this.images[name]=img;
};

SourceManager.prototype.loadMap= function(name){
	if (this.maps[name]) {
		onMapready(maps[name]);
		return;
	}
	++this.numElementsToLoad;
	var url = 'Maps/' + name + '.json';
	var self=this;
	this.ajax(url, function(ret) {
		var map_data = JSON.parse(ret);
		self.maps[name] = map_data;
		self.handleElementLoad(null);
		self.rpg.onMapReady(map_data);
	});
};


SourceManager.prototype.handleElementError = function(e) {
	console.log("Error Loading Asset : " + e.target.src);
};


// Update methid which simply shows the current % of download
SourceManager.prototype.tick = function() {
	this.downloadProgress.text = "Downloading " + Math.round((this.numElementsLoaded / this.numElementsToLoad) * 100) + " %";
	stage.update();
};

SourceManager.prototype.ajax = function(name, callback) {
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

};
