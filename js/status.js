/*
 * Status Class
 */

/*
 * Status Constructor
 *
 * Input:
 *     -> status (optional)
 *     The status used to initialize the new status
 */
var Status = function(status)
{
	this.level = 1;      // Default level is level 1

	this.hp = 200;        // Default hp is 100 
	this.hpMax = 200;    // Default hp maximum is also 100

	this.attack = 120;   // Default attack is 120
	this.defense = 100;  // Default defense is 100

	this.exp = 0;        // Default exp is 0
	this.expMax = 100;   // Default expMax is 100

	this.money = 0;      // Default money is 0

	if(status)
	{
		// Given status valid
		for(var attr in status)
		{
			if(status[attr])
			{
				// Given attribute valid
				this[attr] = status[attr];
			}
		}
	}

};

// Status prototype
Status.prototype = {
	// Used for debugging and shard for all instance
	logger : new ConsoleLogger(),
	tag : "[Status]: ",

	// Check if the updating attribute name is valid
	checkValidAttribute : function(attrName)
	{
		this.logger.debug(this.tag, "checkValidAttribute: +++START+++ attrName = " +
		                  attrName);
		if(this[attrName] != undefined && this[attrName] != null)
		{
			return true;
		}
		else
		{
			this.logger.error(this.tag, "checkValidAttribute: attribute "
			                  + attrName + " not found");
			return false;
		}
		return false;
	},

	// The input offset here is given in offset form
	//
	// +3 means add three to current value
	// -4 means minus four to current value
	updateAttribute : function(attrName, offset)
	{
		this.logger.debug(this.tag, "updateAttribute: attrName = " + attrName + 
		                  " , offset = " + offset);
		if(this.checkValidAttribute(attrName))
		{
			this[attrName] += offset;
		}
	},

	// The input value here is given in absolute form
	//
	// +75 means set attribute to value 75
	// -20 means set attribute to value -20, 
	//	 although negative value is probably not used
	setAttribute : function(attrName, value)
	{
		if(this.checkValidAttribute(attrName))
		{
			this[attrName] = value;
		}
	}
};

// Initialize prototype members
Status.prototype.logger.setLogLevel("info");
