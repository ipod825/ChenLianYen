function Rpg(stage, gameWidth, gameHeight) {
	this.stage = stage;
	this.sourceManager = new SourceManager(this, stage, gameWidth, gameHeight);
	this.input=new Input(this);


	var self = this;
	document.onkeydown = function (e) { self.input.handleKeyDown(e); };
	document.onkeypress= function (e) { self.input.handleKeyPress(e); };
	document.onkeyup = function (e) { self.input.handleKeyUp(e); };
}

Rpg.prototype={

start: function (mapName) {
	this.stage.setCurrentMap(this.sourceManager.maps[mapName]);

	// we want to do some work before we update the canvas,
	// otherwise we could use Ticker.addListener(stage);
	Ticker.addListener(this);
	// Targeting 60 FPS
	Ticker.useRAF = false;
	Ticker.setFPS(60);
},

tick: function () {
	try {
		this.stage.update();
	}
	catch (e) {
		console.log('Error', e);
	}
},

loadMap: function (mapName) {
	this.sourceManager.addImage(mapName);
	this.sourceManager.addMap(mapName);
	this.sourceManager.setOnready(this.start.bind(this,mapName));
	this.sourceManager.startDownload();
}
}
