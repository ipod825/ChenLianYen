/*
 * Class AttackableCharacter
 *
 * This is the class which represents all the characters that can be an
 * attacker or an attackee. This class is inherited by Player and Monster,
 * which means that NPC is not attackable
 */

/* 
 * AttackableCharacter Constructor
 *
 * Input:
 *     -> battleManager
 *        The reference of battle manager in order to manager battles
 */
var AttackableCharacter = function(battleManager)
{
	this.target = null;                 // Default target is not set
	this.status = new Status();         // TODO match the status contructor
	this.battleManager = null;          // The battle Manager reference

	if(battleManager) 
	{ this.battleManager = battleManager; }
	else
	{
		this.logger.error(this.tag, "AttackableCharacter: " + 
		                  " input battleManager invalid");
	}

    // For debugging
	this.logger.setLogLevel("verbose");
};

// Predefined attackable character prototype
AttackableCharacterPrototype = 
{
	this.logger : new ConsoleLogger(),
	this.tag : "[AttackableCharacter]: ",

	updateStatus : function(attrName, offset)
	{
		this.status.updateAttribute(attrName, offset);
	},

	useItem : function(item)
	{
		itemIndex = this.bag.indexOf(item);
		if(itemIndex === -1)
		{
			// Not found
			this.logger.error(this.tag, "useItem: item to use " + 
			                  item[type] + " not found");
			return;
		}

		// Valid item index, perform usage
		if(this.bag[itemIndex].performUsage)
		{
			this.bag[itemIndex].performUsage(this.status);
		}
		else
		{
			this.logger.debug(this.tag, "useItem: this item is unuable");
			// prevent from decreasing the number of item
			return;
		}

		// Decrease the number of item
		--(this.bag[itemIndex].number);
		if(this.bag[itemIndex].number === 0)
		{
			// Remove that item from bag
			this.bag.splice(itemIndex, 1);
		}
		else if(this.bag[itemIndex].number < 0)
		{
			this.logger.error(this.tag, "useItem: item number < 0," +
			                  " check for reason");
		}
	},

	attack : function()
	{
		// TODO
	}

};

// AttackableCharacter inherits Character
AttackableCharacter.prototype = new Character();
// Assign the prototype to the predefined one
for(var obj in AttackableCharacterPrototype)
{
	AttackableCharacter.prototype[obj] = AttackableCharacterPrototype[obj];
}
