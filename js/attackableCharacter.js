CHARACTER_STATE_ALIVE = 1;
CHARACTER_STATE_DEAD  = 2;

/* 
 * Class: AttackableCharacter
 *     This is the class which represents all the characters that can be an
 *     attacker or an attackee. This class is inherited by Player and Monster,
 *     which means that NPC is not attackable
 *
 * Parameters:
 */
function AttackableCharacter(_rpg, _status)
{
	// For debugging
	this.logger.debug(this.tag, "AttackableCharacter: +++START+++ _rpg = " + _rpg + 
	                  " , _status = " + _status);

	// Call parent Consturctor
	Character.call(this, _rpg); 

	// Initialize status and battleManager
	this.status = null;
	if(_status)
	{ this.status = new Status(status); }  // New status with given status
	else
	{ this.status = new Status(); }		// New a status with default value

	this.state = CHARACTER_STATE_ALIVE;
};

// Predefined attackable character prototype
AttackableCharacterPrototype = 
{
	logger : new ConsoleLogger(),
	tag : "[AttackableCharacter]: ",

	// STATE RELATED FUNCTION
	// STATE RELATED FUNCTION
	// STATE RELATED FUNCTION
	// STATE RELATED FUNCTION

	expCheck: function(_status)
	{
		if(_status.exp < 0)
		{
			this.logger.error(this.tag, "updateState: this.status.exp < 0");
		}
		else if(_status.exp >= this.status.expMax)
		{
			this.exp -= this.expMax;
			++this.status.level;
		}
	},

	hpCheck: function(_status)
	{
		if(this.status.hp <= 0)
		{
			return CHARACTER_STATE_DEAD;
		}
		else if(this.status.hp >= this.status.hpMax)
		{
			this.status.hp = this.status.hpMax;
			return CHARACTER_STATE_ALIVE;
		}
		else 
		{
			return CHARACTER_STATE_ALIVE;
		}
	},

	updateState : function()
	{
		this.logger.debug(this.tag, "updateState: +++START+++");

		// Exp status check
		this.expCheck(this.status);

		// Hp status check, this may result in status change
		this.state = this.hpCheck(this.status);
	},

	getState : function()
	{
		return this.state;
	},

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

	setStatus : function(_attrName, _value)
	{
		this.logger.debug(this.tag, "setStatus: +++START+++ _attrName = " +
		                  _attrName + " , _value = " + _value);

		// Delegate the update work to status
		this.status.setAttribute(_attrName, _value);

		// Status change may result to state change
		this.updateState();
	},

	updateHUD : function(_attrName)
	{
		var uiController = this.rpg.getUIController();
		if(uiController)
			{
			if(_attrName = "exp")
			{
				uiController.updateHUD("EXP", this.status.exp);
			}
			else if(_attrName = "hp")
			{
				uiController.updateHUD("HP", this.status.hp);
			}
		}
		else
		{
			this.logger.error(this.tag, "updateHUD: uiController undefined");
		}
	},

	updateStatus : function(_attrName, _offset) 
	{
		this.logger.debug(this.tag, "updateStatus: +++START+++ _attrName = " +
		                  _attrName + " , _offset = " + _offset);

		// Delegate the update work to status
		this.status.updateAttribute(_attrName, _offset);
		if(utility.isPlayer(this.type))
		{
			this.updateHUD(_attrName);
		}

		// Status change may result to state change
		this.updateState();
	},

	damage :function(damage){
		this.updateStatus("hp", -damage);
		this.blink();
	},

	blink : function(){
		this.visible = false;
		this.visibleCount = 0;
	},

	die : function(){
		this.parent.removeChild(this);
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
		this.logger.debug(this.tag, "attack: +++START+++ attackee = " + attackee);

		// Play attack animation
		this.playAnimation(this.suffix);

		// If attackee is undefined, find attackee in front of caller
		if(!attackee)
		{
			var objectInFront = this.parent.objInFront(this);

			if(utility.isMonster(objectInFront.type)) {
				attackee = objectInFront;
			}
			else {
				return;
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
AttackableCharacter.prototype.logger.setLogLevel("info");
