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

	this.hp = 100;       // Default hp is 100 
	this.hpMax = 100;    // Default hp maximum is also 100

	this.attack = 120;   // Default attack is 120
	this.defence = 100;  // Default defence is 100

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

	// For debugging
	this.logger.setLogLevel("verbose");
};

// Status prototype
Status.prototype = {
	// Used for debugging and shard for all instance
	logger : new ConsoleLogger(),
	tag : "[Status]: ",

	// Check if the updating attribute name is valid
	checkValidAttribute : function(attrName)
	{
		if(this[attrName])
		{
			return true;
		}
		else
		{
			this.logger.error(this.tag, "updateAttribute: attribute "
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
		if(this.checkValidAttribute(attrName))
		{
			this[attrName] += offset;
		}
	},

	// The input value here is given in absolute form
	//
	// +75 means set attribute to value 75
	// -20 means set attribute to value -20, 
	//     although negative value is probably not used
	setAttribute : function(attrName, value)
	{
		if(this.checkValidAttribute(attrName))
		{
			this[attrName] = value;
		}
	}
};
