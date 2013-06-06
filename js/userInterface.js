function UIController(){
	this.topics = {},
	this.subUid = -1;
}

UIController.prototype={
	
	publish : function(topic, args) {
		
		if( !this.topics[topic]){
			return false;
		}
		
		var subscribers = this.topics[topic];
		len = subscribers ? subscribers.length : 0;
			
		while(len--) {
			subscribers[len].func(topic, args);
		}
		
		return this;
	},
	
	//Subscribe to events of intrest
	subscribe : function(topic, func){
		if(!this.topics[topic]){
			this.topics[topic] = [];
		}
		
		var token = (++this.subUid).toString();
		this.topics[topic].push({
			token: token,
			func: func
		});
		
		return token;
	},
	
	unsubscribe : function( token ){
		for( var m in this.topics)
		{
			if(this.topics[m]){
				for(var i = 0, j = this.topics[m].length; i < j; i++)
				{
					if(this.topics[m][i].token == token)
					{
						this.topics[m].splice(i, 1);
						return token;
					}
				}
			}
		
		}
		return this;
	},
}

function UserInterface(uiDivId, uifile){
	self=this;
	this.uiDiv=$(uiDivId);
	this.list = [];
	this.uiDiv.load(uifile, function(){
		self.uiDiv.children("div").each(function(index, element){
			//hide each ui by default
			var uiName = $(this).attr("id");
			self.list[uiName] = $(this);
			self.list[uiName].hide();
		});
	});

}
UserInterface.prototype={
	show : function(uiName){
		if(this.list[uiName] == undefined)
			return;
		this.list[uiName].show();
	},
}

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

function toggleVisibility(id){
	//var e = $(this).find(id)[0];
	var e = $(id)[0];
	if(e.style.display == 'block')
		e.style.display = 'none';
	else
		e.style.display = 'block';
}

