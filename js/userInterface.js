function toggleVisibility(id){
	//var e = $(this).find(id)[0];
	var e = $(id)[0];
	if(e.style.display == 'block')
		e.style.display = 'none';
	else{
		e.style.display = 'block';
	}
}

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

function UserInterface(uiDivId, uifile, UIController){
	this.uiDiv=$(uiDivId);
	this.list = [];
	this.initialization(uiDivId, uifile, UIController);

}
UserInterface.prototype = {
	show : function(uiName){
		if(this.list[uiName] == undefined)
			return;
		this.list[uiName].show();
	},
	initialization : function(uiDivId, uifile, UIController){
		self=this;
		uiDiv.load(uifile, function(){
			self.uiDiv.children("div").each(function(index, element){
				//hide each ui by default
				var uiName = $(this).attr("id");
				switch(uiName){
				case "HUD":
					self.list[uiName] = new HUD($(this), UIController);
					break;
				case "Dialogue":
					self.list[uiName] = new Dialogue($(this), UIController);
					break;
				case "Options":
					self.list[uiName] = new Options($(this), UIController);
					break;
				case "Inventory":
					self.list[uiName] = new Inventory($(this), UIController);
					break;
				case "QuestWindow":
					self.list[uiName] = new QuestWindow($(this), UIController);
					break;
				case "StatusWindow":
					self.list[uiName] = new StatusWindow($(this), UIController);
					break;
				default:
					self.list[uiName] = $(this);	
				}
				self.list[uiName].hide();	
			});
		});	
	},
}


function UIComponent(){};
UIComponent.prototype = {
	dom : null,
	initialize : function(_obj, _UIC){},
	show : function(){dom.show();},
	hide : function(){dom.hide();},
};


function HUD(dom, UIC){
	this.initialize(dom, UIC);
}
HUD.prototype = Object.create(UIComponent.prototype, {
	initialize : function(_obj, _UIC){
		dom = _obj;
		
		_UIC.subscribe("HP_UPDATE", this.HPUpdate);
		_UIC.subscribe("EXP_UPDATE", this.EXPUpdate);
		_UIC.subscribe("QUEST_UPDATE", this.QuestUpdate);
	},
	
	HPUpdate : function(topic, args){
      /* args = {HP : value}*/
      if(topic != "HP_UPDATE") return;
		
      dom.find("#HealthBar > span").css("width", args.HP + "%");	
	},

    EXPUpdate : function(topic, args){
		/* args = {EXP : value}*/
		if(topic != "EXP_UPDATE") return;

		dom.find("#EXPBar > span").css("width", args.EXP + "%");
    },

    QuestUpdate : function(topic, args){
		/* args = {Desc : string, Current : value, Goal : value}*/
		if(topic != "QUEST_UPDATE") return;
		
		dom.find("#QuestHUD > .questText").text(args.Desc);
		dom.find("#QuestHUD > .questStatus > .questCurrent").text(args.Current);
		dom.find("#QuestHUD > .questStatus > .questGoal").text(args.Goal);
    }, 
});

function Inventory(dom, UIC){
	this.initialize(dom, UIC);
}
Inventory.prototype = Object.create(UIComponent.prototype, {
	initialize : function(_obj, _UIC){
		dom = _obj;
		
		_UIC.subscribe("INVENTORY_UPDATE", this.inventoryUpdate);
		
		dom.find("#btUseItem").click(function(){
			var id = $(this).siblings("itemid").attr("id");
			_UIC.publish("USE_ITEM", {itemid: id});
			
			$(this).parent().hide();
		});
		
		dom.find("#btDropItem").click(function(){
			var id = $(this).siblings("itemid").attr("id");
			_UIC.publish("DROP_ITEM", {itemid: id});
			
			$(this).parent().hide();
		});
	},
	
	inventoryUpdate : function(topic, args){
	/* args = {list : Array[{id, img, number}, ]}*/
	if(topic != "INVENTORY_UPDATE") return;
		
		var grid = $("#Inventory > #Grid").get(0);
		grid.html("");
		for(var i in args.list){
			var item = args.list[i];
			
			var str = '<div id="'+item.id+'" class="item"><img class="itemImg" src="'+item.img+'" /><span class="itemCount">'+item.number+'</span></div>';
			var newItem = $(str).click(function(){
				var options = dom.find("#itemOptions").get(0);
				options.hide();
				options.css("top", this.offsetTop);
				options.css("left", this.offsetLeft+40);
				options.find("itemid").attr("id", item.id);
				options.show();
			});
			grid.append(newItem);
		}
	}
});

function Dialogue(dom, UIC){
	this.initialize(dom, UIC);
}
Dialogue.prototype = Object.create(UIComponent.prototype, {
	initialize : function(_obj, _UIC){
		dom = _obj;
		
	},
});


function Options(dom, UIC){
	this.initialize(dom, UIC);
}
Options.prototype = Object.create(UIComponent.prototype, {
	initialize : function(_obj, _UIC){
		dom = _obj;
		
	},
});


function QuestWindow(dom, UIC){
	this.initialize(dom, UIC);
}
QuestWindow.prototype = Object.create(UIComponent.prototype, {
	initialize : function(_obj, _UIC){
		dom = _obj;
		
	},
});


function StatusWindow(dom, UIC){
	this.initialize(dom, UIC);
}
StatusWindow.prototype = Object.create(UIComponent.prototype, {
	initialize : function(_obj, _UIC){
		dom = _obj;
		
	},
});