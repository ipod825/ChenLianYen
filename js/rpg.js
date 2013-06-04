function Rpg(canvas) {
	this.sourceManager = new SourceManager($(canvas).width,$(canvas).height);
	this.player = this.sourceManager.loadCharacter(PLAYER,"player");
	this.stage = new MyStage(canvas, this.sourceManager, this.player);
	this.sourceManager.setStage(this.stage); //To show the downloaing progress on the stage;
	this.input=new Input(this);

	

	var self = this;
	window.onclick= function(e){ self.input.handleClick(e);}
	document.onkeydown = function (e) { self.input.handleKeyDown(e); };
	document.onkeypress= function (e) { self.input.handleKeyPress(e); };
	document.onkeyup = function (e) { self.input.handleKeyUp(e); };
}

Rpg.prototype={

start: function (mapName) {
	this.stage.setCurrentMap(mapName);
	this.stage.currentMap.checkCell();
	this.addCharacter(this.player);
	Ticker.addListener(this.player);



	// we want to do some work before we update the canvas, otherwise we could use Ticker.addListener(stage);
	Ticker.addListener(this);
	// Targeting 60 FPS
	Ticker.useRAF = false;
	Ticker.setFPS(60);
},

addCharacter : function(character){
	this.stage.addChild(character);
	character.initPosOnMap();
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

loadUI: function() {
	var self = this;
	$("#rpgDiv").load("./CSS/UILayout.html", function(){
		 this.children().hide();
		 self.UserInterface = window.UserInterface;
		 self.UIController = window.UIController;
   });
},
}
