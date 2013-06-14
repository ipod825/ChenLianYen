
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
function AttackableCharacter(_status, _battleManager)
{
    // For debugging
    this.logger.verbose(this.tag, "AttackableCharacter: +++START+++ _battleManager = " + _battleManager + 
                        " , _status = " + _status);

    // Call parent Consturctor
    Character.call(this); 

    // Initialize status and battleManager
    var status = null;
    if(_status)
    { status = new Status(status); }  // New status with given status
    else
    { status = new Status(); }        // New a status with default value

    var battleManager = null;
    if(_battleManager) 
    { battleManager = _battleManager; }
    else
    {
        this.logger.error(this.tag, "AttackableCharacter: _battleManager undefined");
    }
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

    useItem : function(item)
    {
        this.logger.verbose(this.tag, "useItem: +++START+++ item.type = " +
                            item.type + " , item.number = " + item.number + 
                            " , item.description = " + item.description);

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

    // ACTION RELATED FUNCTIONS

    attack : function(attackee)
    {
        this.logger.verbose(this.tag, "attack: +++START+++ attackee = " + attackee);

        // check needed members
        if(!this.battleManager)
        {
            this.logger.error(this.tag, "attack: battleManager not linked");
            return;
        }
        if(!attackee)
        {
            this.logger.error(this.tag, "attack: attackee undefined");
            return;
        }

        // Call battle manager to handle damage computation
        this.battleManager.performAttack(this, attackee);
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
