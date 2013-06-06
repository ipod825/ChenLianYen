/*
	implement the Observer Pattern
*/

/*	!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *	This file is not used by index.html now
 * A written version by mingo is js/userinterface.js
 *
 *
 *
 * */
var UIController = {};

(function(q){
	var topics = {},
		subUid = -1;
	
	q.publish = function(topic, args) {
		
		if( !topics[topic]){
			return false;
		}
		
		var subscribers = topics[topic],
			len = subscribers ? subscribers.length : 0;
			
		while(len--)
		{
			subscribers[len].func(topic, args);
		}
		
		return this;
	};
	
	//Subscribe to events of intrest
	q.subscribe = function(topic, func){
		if(!topics[topic]){
			topics[topic] = [];
		}
		
		var token = (++subUid).toString();
		topics[topic].push({
			token: token,
			func: func
		});
		
		return token;
	};
	
	q.unsubscribe = function( token ){
		for( var m in topics)
		{
			if(topics[m]){
				for(var i = 0, j = topics[m].length; i < j; i++)
				{
					if(topics[m][i].token == token)
					{
						topics[m].splice(i, 1);
						return token;
					}
				}
			}
		
		}
		return this;
	};
	

}(UIController))


var UserInterface = {};

(function(q){
	var _jqRPGDIV = null,
		list = [];

	q.initialize = function(RPGDIV){
			_jqRPGDIV = $(RPGDIV);
			_jqRPGDIV.children("div").each(function(index, element){
				var uiName = $(this).attr("id");
				
				list[uiName] = $(this);
			});
	};
	
	q.show = function(uiName){
		if(list[uiName] == undefined) return;
		
		list[uiName].show();
	};
	
	
}(UserInterface))


function HUD(obj, UIC){
	this.initialize(obj, UIC);
}

HUD.prototype = {
	obj : null,
	initialize : function(_obj, _UIC){
		obj = _obj;
		
		_UIC.subscribe("HP_UPDATE", HPUpdate);
		_UIC.subscribe("EXP_UPDATE", EXPUpdate);
		_UIC.subscribe("QUEST_UPDATE", QuestUpdate);
	},
	
   HPUpdate : function(topic, args){
      /* args = {HP : value}*/
      if(topic != "HP_UPDATE") return;
		
      obj.children("#HealthBar > span").css("width", args.HP + "%");	
   },

    EXPUpdate : function(topic, args){
      if(topic != "EXP_UPDATE") return;

      obj.children("#EXPBar > span").css("width", args.EXP + "%");
    },

    QuestUpdate : function(topic, args){
      if(topic != "EXP_UPDATE") return;


    }, 

}
