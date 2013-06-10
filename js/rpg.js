function Rpg(canvasId) {
	canvas=document.getElementById(canvasId);
	this.sourceManager = new SourceManager(canvas.width,canvas.height);
	this.player = this.sourceManager.loadCharacter(PLAYER,"player");
	this.stage = new MyStage(canvas, this.sourceManager, this.player);
	this.sourceManager.setStage(this.stage); //To show the downloaing progress on the stage;
	this.input=new Input(this);
	
	this.UserInterface;
	//this.UserInterface = window.UserInterface;
	//this.UIController = window.UIController;

	var self = this;
	canvas.onclick= function (e){ self.input.handleClick(e); }
	document.onkeydown = function (e) { self.input.handleKeyDown(e); };
	document.onkeypress= function (e) { self.input.handleKeyPress(e); };
	document.onkeyup = function (e) { self.input.handleKeyUp(e); };
}

Rpg.prototype={

start: function (mapName) {
	this.stage.setCurrentMap(mapName);
	this.stage.checkCell();
	this.stage.addChild(this.player);
	this.player.changeImage();
	Ticker.addListener(this.player);

	this.UserInterface.show("HUD");

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
	this.sourceManager.setOnReady(this.start.bind(this,mapName));
	this.sourceManager.loadMap(mapName);
},

loadUI: function(uiDiv,uifile) {
	this.UserInterface= new UserInterface(uiDiv,uifile);
},
//loadUI: function() {
//	var self = this;
//	this.sourceManager.loadUI($("#rpgDiv"), "./CSS/UILayout.html");
//},
}
