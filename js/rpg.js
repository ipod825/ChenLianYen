function Rpg(_stage, gameWidth, gameHeight) {
	this.stage = stage;
	this.sourceManager = new SourceManager(this, stage, gameWidth, gameHeight);
	this.input=new Input(this);
	this.currentMap = null;


	var self = this;
	document.onkeydown = function (e) { self.input.handleKeyDown(e); };
	document.onkeypress= function (e) { self.input.handleKeyPress(e); };
	document.onkeyup = function (e) { self.input.handleKeyUp(e); };
}

Rpg.prototype={

start: function () {
	background= new Bitmap(this.sourceManager.images[this.currentMap.name]);
	this.stage.addChild(background);

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
	this.sourceManager.setOnready(this.start.bind(this));
	this.sourceManager.startDownload();
	this.currentMap=new Map(mapName);
},


onMapDataReady: function (eventResult) {
	if (eventResult.readyState == 4) {
		// If everything was OK
		if (eventResult.status == 200){
		
		}
		else {
			console.log('Error', eventResult.statusText);
		}
	}
}

}
