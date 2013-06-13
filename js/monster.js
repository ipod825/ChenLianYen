/*
 * Class: Monster
 *     This is the class which is attackable by player. It contains all
 *     the attackable objects which player can see on the map
 * 
 * Parameters:
 *     type - the identifier
 *     name - the name of the moster, used to load image
 *     battle - the battle manager reference
 *     status - (optional) the status of the monster
 */
function Monster(type, name, battleManager, status)
{
    // For debugging
    this.logger.verbose(this.tag, "Monster: +++START+++ type = " + type +
                        " , name = " + name, + " , battleManager = " + 
                        battleManager + " , status = " + status);

    // Calling parent constructor
    AttackableCharacter.call(this, type, name, battleManager, status);
};


/*
 * Object: MonsterPrototype
 *     This is predefined prototype in order to hold all the members after
 *     assigning the prototype to a consturctor (inheritance)
 */
var MonsterPrototype = 
{
    // For logging
    tag : "[Monster]: ",
    logger : new ConsoleLogger()
};


// Monster inherits AttackableCharacter
Monster.prototype = new AttackableCharacter();
// Assign predefined prototype to prototype
for(var obj in MonsterPrototype)
{
    Monster.prototype[obj] = MonsterPrototype[obj];
}
// Initialize the member in prototype
Monster.prototype.logger.setLogLevel("all");


