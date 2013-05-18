function Rpg(stage, gameWidth, gameHeight) {
	this.stage = stage;
	this.sourceManager = new SourceManager(this, stage, gameWidth, gameHeight);
	this.input=new Input(this);
	this.currentMap = null;

	var self = this;
	document.onkeydown = function (e) { self.input.handleKeyDown(e); };
	document.onkeypress= function (e) { self.input.handleKeyPress(e); };
	document.onkeyup = function (e) { self.input.handleKeyUp(e); };

	// Starting the game
	this.start = function () {
		background= new Bitmap(self.sourceManager.images[self.currentMap.name]);
		self.stage.addChild(background);

		// we want to do some work before we update the canvas,
		// otherwise we could use Ticker.addListener(stage);
		Ticker.addListener(this);
		// Targeting 60 FPS
		Ticker.useRAF = false;
		Ticker.setFPS(60);
	};
};

// Update logic callbacked by EaselJS
// Equivalent of the Update() method of XNA
Rpg.tick = function () {
	try {
	}
	catch (e) {
		console.log('Error', e);
	}
}


// Loading the next level contained into /level/{x}.txt
Rpg.prototype.loadMap = function (mapName) {
	this.sourceManager.addImage(mapName);
	this.sourceManager.addMap(mapName);
	this.sourceManager.setOnready(this.start);
	this.sourceManager.startDownload();
	this.currentMap=new Map(mapName);
};

// Callback method for the onreadystatechange event of XMLHttpRequest
Rpg.prototype.onMapReady = function (eventResult) {
	if (eventResult.readyState == 4) {
		// If everything was OK
		if (eventResult.status == 200){
		
		}
		else {
			console.log('Error', eventResult.statusText);
		}
	}
};

