/*
 * This is the item class, which contains the information of item such as
 * the type of item, the number of item, the description and the effect
 * made by using the item
 */

/* 
 * Item Constructor
 *
 * Input:
 *     -> type (essentail)
 *     The type of the item
 *     -> number (optional)
 *     How many items of the same type
 *     -> description (optional)
 *     The description of the item
 * 
 * Usage:
 *     var item = new Item("itemHealthPotion", 2, 
 *                         "The potion to recover health point");
 *     var item = new Item("itemHealthPotion", 
 *                         "The potion to recover health point");
 *     var item = new Item("itemHealthPotion", 2);
 *     var item = new Item("itemHealthPotion");
 */
function Item(_rpg) {
	// For debugging
	this.logger.verbose(this.tag, "Item: +++START+++ _rpg = " + _rpg);
	MapObject.call(this);

	this.number = 1;       // Default item has only one instance
	this.description = ""; // Default description is empty string
	// Effect of using 
	// If the item has effect when used, the item should override this function
	this.performUsage = null;

	// Move parameters to correct order
	if(typeof(number) === "string")
	{
		description = number;
		number = null;
	}

	// Animation related Parameter
	this.animations={ idle: [0,  0,  false], };
	this.numFrameX = 1;
	this.numFrameY = 1;
};

// Item Prototype
ItemPrototype = {
	// For debugging
	tag : "[Item]: ", 
	logger : new ConsoleLogger(),
};


// Item inherits map object
Item.prototype = new MapObject(); 
// Assign the members in the prototype object into the character prototype
for (var obj in ItemPrototype) { 
	Item.prototype[obj] = ItemPrototype[obj]; 
} 
// Initialize members in prototype
Item.prototype.logger.setLogLevel("debug");
