
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
function AttackableCharacter(_rpg, _status)
{
	// For debugging
	this.logger.verbose(this.tag, "AttackableCharacter: +++START+++ _rpg = " + _rpg + 
	                    " , _status = " + _status);

	// Call parent Consturctor
	Character.call(this, _rpg); 

	// Initialize status and battleManager
	var status = null;
	if(_status)
	{ status = new Status(status); }  // New status with given status
	else
	{ status = new Status(); }		// New a status with default value
};

// Predefined attackable character prototype
AttackableCharacterPrototype = 
{
	logger : new ConsoleLogger(),
	tag : "[AttackableCharacter]: ",

	// STATUS RELATED FUNCTIONS
	// STATUS RELATED FUNCTIONS
	// STATUS RELATED FUNCTIONS

	getStatus: function()
	{
		if(!this.status)
		{
			this.logger.error(this.tag, "getStatus: status undefined");
			return null;
		}
		return this.status;
	},

	setStatus : function(attrName, value)
	{
		this.logger.verbose(this.tag, "setStatus: +++START+++ attrName = " +
							attrName + " , value = " + value);
		this.status.setAttribute(attrName, value);
	},

	updateStatus : function(attrName, offset)
	{
		this.logger.verbose(this.tag, "updateStatus: +++START+++ attrName = " +
							attrName + " , offset = " + offset);
		this.status.updateAttribute(attrName, offset);
	},

	// ITEM RELATED FUNCTIONS

	useItem : function(_item)
	{
		// For debugging
		this.logger.verbose(this.tag, "useItem: +++START+++ _item.type = " +
	                        _item.type + " , _item.number = " + _item.number + 
	                        " , _item.description = " + _item.description);

		// Check if item exist
		var itemToUse = this.bag[_item.type];
		if(itemToUse)
		{
			// Item in bag
			if(itemToUse.performUsage)
			{
				itemToUse.performUsage(this.status);
				--itemToUse.number;
				if(itemToUse.number === 0)
				{
					// No more item available
					this.bag[itemToUse.type] = null;
				}
			}
			else
			{
				this.logger.error(this.tag, "useItem: itemToUse.performUsage undefined");
			}
		}
		else
		{
			this.logger.error(this.tag, "useItem: itemToUse undefined");
		}
	},

	// ACTION RELATED FUNCTIONS

	attack : function(attackee)
	{
		// For debugging
		this.logger.verbose(this.tag, "attack: +++START+++ attackee = " + attackee);

		// Play attack animation
		this.playAnimation(this.suffix);

		// If attackee is undefined, find attackee in front of caller
		if(!attackee)
		{
			this.logger.verbose(this.tag, "attack: attackee not defined, try to find attackee");
			var pixelInFront = new Point(this.x + this.vX, this.y + this.vY);
			var objectInFront = this.parent.isPassable(this, pixelInFront);

			this.logger.verbose(this.tag, "attack: objectInFront.type = " + objectInFront.type);
			if(!(objectInFront.type == MONSTER))
			{
				this.logger.verbose(this.tag, "attack: attackee not found");
				return;
			}
			else
			{
				attackee = objectInFront;
			}
		}

		// check needed members
		var battleManager = this.rpg.battleManager;
		if(!battleManager)
		{
			this.logger.error(this.tag, "attack: battleManager not linked");
			return;
		}

		// Call battle manager to handle damage computation
		battleManager.performAttack(this, attackee);
	}
};


// AttackableCharacter inherits Character
AttackableCharacter.prototype = new Character();
// Assign the prototype to the predefined one
for(var obj in AttackableCharacterPrototype)
{
	AttackableCharacter.prototype[obj] = AttackableCharacterPrototype[obj];
}
// Initializeation of members in prototype
AttackableCharacter.prototype.logger.setLogLevel("all");
