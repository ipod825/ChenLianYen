var Utility = function()
{
};

Utility.prototype = 
{
    tag : "[Utility]: ",
    logger : new ConsoleLogger(),

    isPlayer : function(type)
    {
        this.logger.verbose(this.tag, "isPlayer: +++START+++ type = " + type);
        if(type && type.substr(0, 6) === "player")
        {
            return true;
        }
        return false;
    },

    isMonster : function(type)
    {
        this.logger.verbose(this.tag, "isMonster: +++START+++ type = " + type);
        if(type && type.substr(0, 7) === "monster")
        {
            return true;
        }
        return false;
    },

    isNpc : function(type)
    {
        this.logger.verbose(this.tag, "isNpc: +++START+++ type = " + type);
        if(type && type.substr(0, 3) === "npc")
        {
            return true;
        }
        return false;
    }

};

Utility.prototype.logger.setLogLevel("all");

var utility = new Utility();
