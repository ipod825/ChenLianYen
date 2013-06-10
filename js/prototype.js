/*
 * DisplayObject
 */

DisplayObjectPrototype={}
//DisplayObjectPrototype.posOnMap = new Point(-1,-1);
DisplayObject.prototype["posOnMap"] = null;


for (var obj in DisplayObjectPrototype) { 
	DisplayObject.prototype[obj] = DisplayObjectPrototype[obj]; 
} 
