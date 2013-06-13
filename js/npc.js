/*
 * Class: Npc
 *     This is the class which represents all the npc on the map.
 *     Npcs can give quests and talk to player as player interact
 *     with them
 */
function Npc(questManager)
{
    // Call parent consturctor
    this.prototype.apply(this);

    // Assign quest manager
    if(!questManager)
    {
        this.logger.error(this.tag, "Npc: questManager undefined");
    }
    this.questManager = questManager;
};

/*
 * Object: NpcPrototype
 *     The predefined prototype which holds all the member in the prototype.
 *     This is because the prototype is used to write inheritance syntax so
 *     that direct assignment of prototype to an object is unusable
 */
var NpcPrototype = 
{
    logger: new ConsoleLogger(),
    tag: "[Npc]: ",

    showDialogue(): function()
    {
        // TODO
    },

    addQuest(): function()
    {
        // TODO
    }
};

// NPC inherits Character
Npc.prototype = new Character();
// Assign all member in predefined prototype into prototype
for(var obj in NpcPrototype)
{
    Npc.prototype[obj] = NpcPrototype[obj];
}
 
