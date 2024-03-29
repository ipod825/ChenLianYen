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
function Monster(_rpg, _status)
{
	// For debugging
	this.logger.debug(this.tag, "Monster: +++START+++ _rpg = " +
	                    _rpg + " , _status = " + _status);

	// Calling parent constructor
	AttackableCharacter.call(this, _rpg, _status);
	this.moving = true;
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
	logger : new ConsoleLogger(),

	searchTarget : function(){
		dirUnit= this.getDirUnit();
		p = new Point(0,0);
		searchPath = [];
		for(var i =0; i<2; ++i){
			p1 = p.plus(dirUnit);
			searchPath.push(p1);
		}
		target = this.parent.detetObj(this.rpg.getPlayer().type, this.posOnMap, searchPath);
		if(target)
		{
			this.setTarget(target);
		}
	},

	freeMove : function(){
		if(Math.random()>0.8)
			this.setDirection(DIR_LEFT+Math.floor(Math.random()*4));
	},

	giveTrophy : function(killer)
	{
		// For debugging
		this.logger.debug(this.tag, "giveTrophy: +++START+++ killer = " + killer);
		killer.updateStatus("exp", 30);
	},
};

// Monster inherits AttackableCharacter
Monster.prototype = new AttackableCharacter();
// Assign predefined prototype to prototype
for(var obj in MonsterPrototype)
{
	Monster.prototype[obj] = MonsterPrototype[obj];
}
// Initialize the member in prototype
Monster.prototype.logger.setLogLevel("info");
