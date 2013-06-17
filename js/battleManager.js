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
        // For debugging
        this.logger.verbose(this.tag, "performAttack: attacker = " + attacker +
                            "attackee = " + attackee);

        // Get both status of attacker and attackee
        var attackerStatus = attacker.getStatus();
        var attackeeStatus = attackee.getStatus();

        // Check status
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

        // Compute damage and give damage
        var damage = attackerStatus.attack - attackeeStatus.defense;
        attackee.updateStatus("hp", -damage);

		if(attackee.status.hp<=0){
			attackee.die();
			attacker.updateStatus("exp", attackeeStatus.exp);
		}
    }
};

// Initialize the member in prototype
BattleManager.prototype.logger.setLogLevel("all");
