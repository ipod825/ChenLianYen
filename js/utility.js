var Utility = function()
{
};

Utility.prototype = 
{
    tag : "[Utility]: ",
    logger : new ConsoleLogger(),

    isPlayer : function(type)
    {
        if(type && type.substr(0, 6) === "player")
        {
            return true;
        }
        return false;
    },

    isMonster : function(character)
    {
        if(type && type.substr(0, 6) === "monster")
        {
            return true;
        }
        return false;
    },

    isNpc : function(character)
    {
        if(type && type.substr(0, 3) === "npc")
        {
            return true;
        }
        return false;
    }

};

Utility.prototype.logger.setLogLevel("all");

var utility = new Utility();
