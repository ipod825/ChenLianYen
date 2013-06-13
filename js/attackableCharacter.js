
/* 
 * Class: AttackableCharacter
 *     This is the class which represents all the characters that can be an
 *     attacker or an attackee. This class is inherited by Player and Monster,
 *     which means that NPC is not attackable
 *
 * Parameters:
 *     type - the identifier character
 *     name - the name of the character
 *     stage - (optional) the reference to stage
 *     battleManager - The reference of battle manager to manager battles
 *     statue - (optional) the status to the attackable character
 */
var AttackableCharacter = function(type, name, battleManager, status)
{
	// For debugging
	this.logger.verbose(this.tag, "AttackableCharacter: +++START+++ type = " + type +
	                    " , name = " + name + " , battleManager = " + battleManager + 
	                    " , status = " + status);

	// Call parent Consturctor
	Character.call(this, type, name); 

	// Initialize status and battleManager
	if(status)
	{ this.status = new Status(status); }  // New status with given status
	else
	{ this.status = new Status(); }        // New a status with default value

	if(battleManager) 
	{ this.battleManager = battleManager; }
	else
	{
		this.battleManager = null;         // The battle Manager reference
		this.logger.error(this.tag, "AttackableCharacter: battleManager undefined");
	}
};

// Predefined attackable character prototype
AttackableCharacterPrototype = 
{
	logger : new ConsoleLogger(),
	tag : "[AttackableCharacter]: ",

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
// Initialization of members in prototype
AttackableCharacter.prototype.logger.setLogLevel("all");
