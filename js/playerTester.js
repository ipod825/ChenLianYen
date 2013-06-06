function Rpg(canvas) {
	this.sourceManager = new SourceManager($(canvas).width,$(canvas).height);
	this.player = this.sourceManager.loadCharacter(PLAYER,"player");
	this.stage = new MyStage(canvas, this.sourceManager, this.player);
	this.sourceManager.setStage(this.stage); //To show the downloaing progress on the stage;
	this.input=new Input(this);
	
	this.UserInterface = window.UserInterface;
	this.UIController = window.UIController;

	var self = this;
	//window.onclick= function(e){ self.input.handleClick(e);}
	window.onclick = function(e){
		self.input.handleClick(e);
	}
	document.onkeydown = function (e) { self.input.handleKeyDown(e); };
	document.onkeypress= function (e) { self.input.handleKeyPress(e); };
	document.onkeyup = function (e) { self.input.handleKeyUp(e); };
}

Rpg.prototype={

start: function (mapName) {
	this.stage.setCurrentMap(mapName);
	this.stage.checkCell();
	this.addCharacter(this.player);
	Ticker.addListener(this.player);

	//this.UserInterface.show("HUD");

	// we want to do some work before we update the canvas, otherwise we could use Ticker.addListener(stage);
	Ticker.addListener(this);
	// Targeting 60 FPS
	Ticker.useRAF = false;
	Ticker.setFPS(60);

	// TESTER SCRIPT START
	//for(var times = 0; times < 30; ++times)
	//{
	//	this.player.setDirection(DIR_LEFT);
	//	console.log("player.posOnMap = " + this.player.posOnMap);
	//}
	//for(var times = 0; times < 10; ++times)
	//{
	//	this.player.setDirection(DIR_DOWN);
	//	console.log("player.posOnMap = " + this.player.posOnMap);
	//}

	// TODO test dropItem
	var testItem = new Item("itemPotion", 2, "health potion");
	console.log("player.bag = " + this.player.bag);
	this.player.addItem(testItem);
	console.log("player.bag = " + this.player.bag);
	this.player.dropItem(testItem);
	console.log("player.bag = " + this.player.bag);

	// TODO test setTarget
	//var testTarget = new Target();
	//this.player.setTarget(testTarget);

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
	this.sourceManager.loadUI($("#rpgDiv"), "./CSS/UILayout.html");

},
}