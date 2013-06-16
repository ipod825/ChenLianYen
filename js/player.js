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
function Player(_rpg, _status)
{
	// For debugging
	this.logger.verbose(this.tag, "Player: +++START+++ _rpg = " + 
	                    _rpg + " , _status = " + _status );

	// Calling parent constructor
	AttackableCharacter.call(this, _rpg, _status);
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
		if(npc)
		{
			npc.interact();
		}
		else
		{
			this.logger.error(this.tag, "talkToNpc: npc undefined");
		}
	},

	/*
	 * Function: pickItem
	 *     This function is used for player to pickItem
	 */
	pickItem : function(_item)
	{
		if(_item)
		{
			var pickedItemInBag = this.bag[_item.type];
			if(pickedItemInBag)
			{
				// Picked item already in bag
				pickedItemInBag.number += _item.number;
			}
			else
			{
				// Picked item not in bag
				this.bag[_item.type] = _item;
			}
		}
		else
		{
			this.logger.error(this.tag, "pickItem: _item undefined");
			return;
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
Player.prototype.logger.setLogLevel("debug");
