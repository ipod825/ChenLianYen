// BattleManager Class
var BattleManager = function()
{
};

// Prototype of battle
BattleManager.prototype = 
{
    tag : "[BattleManager]: ",
    logger : new ConsoleLogger(),

    // Damage calculate funtion
    performAttack : function(attacker, attackee)
    {
        var attackerStatus = attacker.getStatus();
        var attackeeStatus = attackee.getStatus();
        if(!attackerStatus)
        {
            this.logger.error(this.tag, "performAttack: attacker status not defined");
            return;
        }
        if(!attackeeStatus)
        {
            this.logger.error(this.tag, "performAttack: attacker status not defined");
            return;
        }

        var damage = attackerStatus.attack - attackeeStatus.defense;
        attackee.updateStatus("hp", -damage);
    }
};

// Initialize the member in prototype
BattleManager.prototype.logger.setLogLevel("all");
