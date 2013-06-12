/*
 * DisplayObject
 */

BitmapAnimationPrototype={}
//DisplayObjectPrototype.posOnMap = new Point(-1,-1);
BitmapAnimation.prototype["posOnMap"] = null;


for (var obj in DisplayObjectPrototype) { 
	BitmapAnimation.prototype[obj] = BitmapAnimationPrototype[obj]; 
} 
