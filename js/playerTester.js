function Rpg(canvasId) {
	canvas=document.getElementById(canvasId);
	this.sourceManager = new SourceManager(canvas.width,canvas.height);
	this.stage = new Stage(canvas);
	this.sourceManager.setStage(this.stage); //To show the downloaing progress on the stage;
	this.input=new Input(this);
	this.currentMap;
	
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

/*
 * In this function, all media are ready, we should init the map, characters ... with these medias.
 */
start: function () {
	this.currentMap.initGraphics();
	this.stage.removeAllChildren();
	this.stage.addChild(this.currentMap);
	this.currentMap.checkCell();
	this.player=this.sourceManager.characters[PLAYER];
	//this.stage.addChild(this.player);

	this.UserInterface.show("HUD");

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
	//var testItem = new Item("itemPotion", 2, "health potion");
	//console.log("player.bag = " + this.player.bag);
	//this.player.addItem(testItem);
	//console.log("player.bag = " + this.player.bag);
	//this.player.dropItem(testItem);
	//console.log("player.bag = " + this.player.bag);

    //var status = new Status();
    //var attackableCharacter = new AttackableCharacter("playerPlayer2", "player2", null, null, status);
    //console.log("attackableCharacter.type = " + attackableCharacter.type);
    //console.log("attackableCharacter.name = " + attackableCharacter.name);
    //console.log("attackableCharacter.stage = " + attackableCharacter.stage);
    //console.log("attackableCharacter.battleManager = " + attackableCharacter.battleManager);

    console.log("this.player.type = " + this.player.type);
    console.log("this.player.name = " + this.player.name);
},

tick: function () {
	try {
		this.stage.update();
	}
	catch (e) {
		console.log('Error', e);
	}
},

/*
 * Set the target for the player when user click on the canvas
 * Paramters:
 * 	p: The position in pixel unit
 */
setTarget : function(p){
	this.player.setTarget(this.currentMap.targetOnPos(p));
},

loadMap: function (mapName) {
	this.sourceManager.setOnReady(this.start.bind(this));
	this.currentMap=this.sourceManager.loadMap(mapName);
},

loadUI: function(uiDiv,uifile) {
	this.UserInterface= new UserInterface(uiDiv,uifile);
},
//loadUI: function() {
//	var self = this;
//	this.sourceManager.loadUI($("#rpgDiv"), "./CSS/UILayout.html");
//},
}



