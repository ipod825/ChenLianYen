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
var Item = function(type, number, description)
{
	// For debugging
	this.logger.setLogLevel("all");
	this.logger.verbose(this.tag, "Item: +++START+++ type = " + type + 
	                    ", number = " + number + 
	                    ", description = " + description);

	this.type = "";        // Default type is empty string
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

	if(!type)
	{ this.logger.error(this.tag, "[constructor]: parameter 'type' undefined"); }
	else
	{ this.type = type; }

	if(!number)
	{ this.logger.debug(this.tag, "[constructor]: parameter 'number' undefined"); }
	else
	{ this.number = number; }

	if(!description)
	{ this.logger.warning(this.tag, "[constructor]: parameter 'description' undefined"); }
	else
	{ this.description = description; }
};

// Item Prototype
Item.prototype = {
	// For debugging
	tag : "[Item]: ", 
	logger : new ConsoleLogger(),
};
