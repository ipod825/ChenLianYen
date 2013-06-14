/*
 * Class: Player
 *     This is the player which is walking and attacking mosters on the
 *     map, it has a quest manager to record all what's done and it has
 *     the ability to talk to npc
 * 
 * Paramters:
 *     battleManager - the reference to battle manager
 *     questManager - the reference to the quest manager
 *     status - (optional) the status of the player
 */
function Player(status)
{
	// For debugging
	this.logger.verbose(this.tag, "Player: +++START+++ status = " + status );

	// Calling parent constructor
	// TODO update constructor
	AttackableCharacter.call(this, status);
	this.questManager = new Questmanager();


};

/*
 * Object: PlayerPrototype
 *     This is the predefined prototype to hold all the members in prototype.
 *     Direct assignment is not possible due to inheritance, so this object
 *     holds all the member for latter assignment in for loop
 */
var PlayerPrototype = 
{
	// for debugging
	tag : "[Player]: ",
	logger : new ConsoleLogger(),

	/*
	 * Function: talkToNpc
	 *     This function let player talks to npc
	 */
	talkToNpc : function(npc)
	{
		if(!npc)
		{
			this.logger.error(this.tag, "talkToNpc: npc undefined");
			return;
		}
		// TODO check npc function name
		npc.onCommand();
	},

	/*
	 * Function: pickItem
	 *     This function is used for player to pickItem
	 */
	pickItem : function(item)
	{
		if(!item)
		{
			this.logger.error(this.tag, "pickItem: item undefined");
			return;
		}
		// TODO write find item function
		itemIndex = this.bag.indexOf(item);
		if(itemIndex !== -1)
		{
			// item in the bag
			this.bag[itemIndex].number += item.number;
		}
		else
		{
			this.bag.push(item);
		}
	}
};

// Player inherits AttackableCharacter
Player.prototype = new AttackableCharacter();
// Assign the predefined prototype members to prototype
for(var obj in PlayerPrototype)
{
	Player.prototype[obj] = PlayerPrototype[obj];
}
// Initialize members in prototype
Player.prototype.logger.setLogLevel("all");
