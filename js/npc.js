/*
 * Class: Npc
 *     This is the class which represents all the npc on the map.
 *     Npcs can give quests and talk to player as player interact
 *     with them
 */
function Npc(_rpg)
{
	// Call parent consturctor
	Character.call(this, _rpg);

	// Initialize members
	// TODO
	// this.texts
	// this.quest
};

/*
 * Object: NpcPrototype
 *     The predefined prototype which holds all the member in the prototype.
 *     This is because the prototype is used to write inheritance syntax so
 *     that direct assignment of prototype to an object is unusable
 */
var NpcPrototype = 
{
	tag: "[Npc]: ",
	logger: new ConsoleLogger(),

	// Trigger the npc to do things
	interact: function()
	{
		if(this.texts)
		{
			this.showDialogue();
		}
		if(this.quest)
		{
			this.addQuest();
		}
	},

	// Show the texts which npc will say
	showDialogue: function()
	{
		var uiController = this.rpg.getUIController();
		if(uiController)
		{
			if(this.texts)
			{
				uiController.showDialogue(this.texts);
			}
			else
			{
				this.logger.error(this.tag, "showDialogue: this.texts undefined");
			}
		}
		else
		{
			this.logger.error(this.tag, "showDialogue: uiController undefined");
		}
	},

	// Add new quest to the quest manager
	addQuest: function()
	{
		var questManager = this.rpg.getQuestManager();
		if(questManager)
		{
			if(this.quest)
			{
				questManager.addQuest(this.quest);
			}
			else
			{
				this.logger.error(this.tag, "addQuest: this.quest undefined");
			}
		}
		else
		{
			this.logger.error(this.tag, "addQuest: questManager undefined");
		}
	}
};

// NPC inherits Character
Npc.prototype = new Character();
// Assign all member in predefined prototype into prototype
for(var obj in NpcPrototype)
{
	Npc.prototype[obj] = NpcPrototype[obj];
}
 
