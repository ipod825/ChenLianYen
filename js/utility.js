/*
 * Class: Utility
 *     This class stores all the function which should be shared in many
 *     classes, for the purpose not to taint globle namespace, these functions
 *     are defined in class and initialize when included
 *     For using this class, simply use utility.<function_name>(<parameters>)
 */
function Utility()
{
	// This class is meant to be used like static class, so no members in
	// instances, all members are in prototype
	// Initilize the member in prototype
};

/*
 * Object: Utility.prototype
 *     This is the prototype of the Utility class, this class has its own logger
 *     and the fuctions here are meant to be extensible
 */
Utility.prototype = 
{
	// For logging
	tag : "[Utility]: ",
	logger : new ConsoleLogger(),

	/*
	 * Fucntion: isPlayer
	 *     This functino judge if a given type is a valid type for player
	 * 
	 * Parameters:
	 *     type - the type of the character or item
	 */
	isPlayer : function(type)
	{
		this.logger.verbose(this.tag, "isPlayer: +++START+++ type = " + type);
		if(type && type.substr(0, 6) === PLAYER)
		{
			return true;
		}
		return false;
	},

	/*
	 * Fucntion: isMonster
	 *	 This functino judge if a given type is a valid type for monster
	 * 
	 * Parameters:
	 *	 type - the type of the character or item
	 */
	isMonster : function(type)
	{
		this.logger.verbose(this.tag, "isMonster: +++START+++ type = " + type);
		if(type && type.substr(0, 7) === MONSTER)
		{
			return true;
		}
		return false;
	},

	/*
	 * Fucntion: isNpc
	 *     This functino judge if a given type is a valid type for npc
	 * 
	 * Parameters:
	 *     type - the type of the character or item
	 */
	isNpc : function(type)
	{
		this.logger.verbose(this.tag, "isNpc: +++START+++ type = " + type);
		if(type && type.substr(0, 3) === NPC)
		{
			return true;
		}
		return false;
	},

	isItem : function(type)
	{
		this.logger.verbose(this.tag, "isItem: +++START+++ type = " + type);
		if(type && type.substr(0, 4) === ITEM)
		{
			return true;
		}
		return false;
	}

};


// New a instance here, please don't new another instance in other places
var utility = new Utility();
// Initialize members in prototype
Utility.prototype.logger.setLogLevel("none");
