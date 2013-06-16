function Rpg(canvasId) {
	canvas = document.getElementById(canvasId);

	this.sourceManager = new SourceManager(this, canvas.width,canvas.height);
	this.stage = new Stage(canvas);
	this.sourceManager.setStage(this.stage); //To show the downloaing progress on the stage;
	this.input = new Input(this);
	this.currentMap;
	this.player = null;

	this.questManager = new QuestManager();
	this.battleManager = new BattleManager();

	this.UserInterface;

	var self = this;
	canvas.onclick= function (e){ self.input.handleClick(e); }
	document.onkeydown = function (e) { self.input.handleKeyDown(e); };
	document.onkeypress= function (e) { self.input.handleKeyPress(e); };
	document.onkeyup = function (e) { self.input.handleKeyUp(e); };
}

Rpg.prototype = 
{
    tag: "[Rpg]: ",
    logger: new ConsoleLogger(),

	/*
	 * In this function, all media are ready, we should init the map, characters ... with these medias.
	 */
	start: function () {
		this.currentMap.initGraphics();
		this.stage.removeAllChildren();
		this.stage.addChild(this.currentMap);
		this.currentMap.checkCell();
		this.player = this.sourceManager.characters[PLAYER];
		//this.stage.addChild(this.player);

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
		this.currentMap = this.sourceManager.loadMap(mapName);
	},

	loadUI: function(uiDiv,uifile) {
		this.UserInterface = new UserInterface(uiDiv, uifile, this);
	},

	getBattleManager: function()
	{
		if(this.battleManager)
		{
			return this.battleManager;
		}
		else
		{
			console.log("getBattleManager: this.battleManager undefined");
		}
	},

	getQeustManager: function()
	{
		if(this.questManager)
		{
			return this.questManager;
		}
		else
		{
			this.logger.error(this.tag, "getQuestManager: this.questManager undefined");
		}
	},

	getUIController: function()
	{
		if(this.UserInterface)
		{
			return this.UserInterface;
		}
		else
		{
			this.logger.error(this.tag, "getUIController: this.UserInterface undefined");
		}
	},

	getPlayer: function()
	{
		if(this.player)
		{
			return this.player;
		}
		else
		{
			this.logger.error(this.tag, "getPlayer: this.player undefined");
		}
	}

}

// Initialize members in prototype
Rpg.prototype.logger.setLogLevel("all");
