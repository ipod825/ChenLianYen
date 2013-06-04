/*
 * Class: Monster
 *     This is the class which is attackable by player. It contains all
 *     the attackable objects which player can see on the map
 * 
 * Parameters:
 *     type - the identifier
 *     stage - the stage reference
 *     battle - the battle manager reference
 *     status - (optional) the status of the monster
 */
var Monster = function(type, stage, battle, status)
{
	// Check input parameters
	if(!type)
	{
		this.logger.error(this.tag, "Monster: type undefined");
	}
	if(!stage)
	{
		this.logger.error(this.tag, "Monster: stage undefined");
	}
	if(!battle)
	{
		this.logger.error(this.tag, "Monster: battle undefined");
	}
	if(!status)
	{
		this.logger.debug(this.tag, "Monster: status undefined");
	}

	// Calling parent constructor
	// TODO update constructor
	Monster.prototype.apply(this, battle);
};

/*
 * Object: MonsterPrototype
 */
var MonsterPrototype = 
{
	logger : new ConsoleLogger(),
	tag : "[Monster]: "
};

// Monster inherits AttackableCharacter
Monster.prototype = new AttackableCharacter();
// Assign predefined prototype to prototype
for(var obj in MonsterPrototype)
{
	Monster.prototype[obj] = MonsterPrototype[obj];
}

