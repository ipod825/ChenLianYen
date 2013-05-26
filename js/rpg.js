function Rpg(canvas) {
	this.sourceManager = new SourceManager(canvas.width,canvas.height);
	this.stage = new MyStage(canvas, this.sourceManager);
	this.sourceManager.setStage(this.stage); //To show the downloaing progress on the stage;
	this.player = this.sourceManager.loadCharacter(PLAYER,"player");
	this.input=new Input(this);


	var self = this;
	document.onkeydown = function (e) { self.input.handleKeyDown(e); };
	document.onkeypress= function (e) { self.input.handleKeyPress(e); };
	document.onkeyup = function (e) { self.input.handleKeyUp(e); };
}

Rpg.prototype={

start: function (mapName) {
	this.stage.setCurrentMap(mapName);
	this.stage.addChild(this.player);
	Ticker.addListener(this.player);

	// we want to do some work before we update the canvas, otherwise we could use Ticker.addListener(stage);
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
	this.sourceManager.loadMap(mapName);
	this.sourceManager.startDownload(this.start.bind(this,mapName));
}
}
