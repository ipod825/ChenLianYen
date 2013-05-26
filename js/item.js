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
	// Move parameters to correct order
	if(typeof(number) === "string"))
	{
		description = number;
		number = null;
	}

	if(!type)
	{
		this.logger.error(this.tag, "[constructor]: parameter 'type' undefined");
		this.type = "";
	}
	else
	{
		this.type = type;
	}

	if(!number)
	{
		this.logger.debug(this.tag, "[constructor]: parameter 'number' undefined");
		this.number = 1;
	}
	else
	{
		this.number = number;
	}

	if(!description)
	{
		this.logger.warning(this.tag, "[constructor]: parameter 'description' undefined");
		this.description = "";
	}
	else
	{
		this.description = description;
	}
}

// Item Prototype
Item.prototype = {
	// For debugging
	tag : "[Item]: ", 
	logger : new ConsoleLogger()
};
