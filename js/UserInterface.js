/*
	implement the Observer Pattern
*/

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
				
				// list[uiName] = $(this).createUI(_jqRPGDIV.children("#"+uiName));
			});
	};
	
	q.show = function(UIName){
		_jqRPGDIV.children("#"+UIName).show();
	
	};
	
}(UserInterface))


