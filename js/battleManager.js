// BattleManager Class
var BattleManager = function(_rpg)
{
    this.rpg = _rpg;
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
		this.logger.debug(this.tag, "performAttack: attacker = " + attacker +
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
		attackee.damage(damage);

		// If the attackee don't have the health point
		var attakeeState = attackee.getState();
		if(attakeeState === CHARACTER_STATE_DEAD)
		{
			this.logger.info(this.tag, attackee.type + " DIE!");
			attackee.giveTrophy(attacker);
			attackee.die();
			// Update Quest Progress
			//if(utility.isPlayer(attacker))
			//{
			//	this.rpg.getQuestManager().updateQuest(attackee);
			//}
		}

	}
};

// Initialize the member in prototype
BattleManager.prototype.logger.setLogLevel("info");
