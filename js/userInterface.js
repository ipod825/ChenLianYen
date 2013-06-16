// function toggleVisibility(id){
	// var e = $(id)[0];
	// if(e.style.display == 'block')
		// e.style.display = 'none';
	// else{
		// e.style.display = 'block';
	// }
// }

// function UIController(){
	// this.topics = {};
	// this.subUid = -1;
// }

// UIController.prototype={
	
	// publish : function(topic, args) {
		
		// if( !this.topics[topic]){
			// return false;
		// }
		
		// var subscribers = this.topics[topic];
		// len = subscribers ? subscribers.length : 0;
			
		// while(len--) {
			// subscribers[len].func(topic, args);
		// }
		
		// return this;
	// },
	
	// subscribe : function(topic, func){
		// if(!this.topics[topic]){
			// this.topics[topic] = [];
		// }
		
		// var token = (++this.subUid).toString();
		// this.topics[topic].push({
			// token: token,
			// func: func
		// });
		
		// return token;
	// },
	
	// unsubscribe : function( token ){
		// for( var m in this.topics)
		// {
			// if(this.topics[m]){
				// for(var i = 0, j = this.topics[m].length; i < j; i++)
				// {
					// if(this.topics[m][i].token == token)
					// {
						// this.topics[m].splice(i, 1);
						// return token;
					// }
				// }
			// }
		
		// }
		// return this;
	// },
// }

function UserInterface(uiDivId, uifile, _rpg){
	this.rpg = _rpg;
	this.uiDiv=$(uiDivId);
	this.list = [];
	this.initialization(uiDivId, uifile, _rpg);
}
UserInterface.prototype = {
	show : function(uiName){
		if(this.list[uiName] == undefined)
			return;
		this.list[uiName].show();
	},
	get : function(uiName){
		return self.list[uiName];
	},	
	toogle : function(uiName){
		if(this.list[uiName] == undefined)
			return;
		this.list[uiName].show();
	},

	initialization : function(uiDivId, uifile, _rpg){
		self=this;
		self.uiDiv.load(uifile, function(){
			self.uiDiv.children("div").each(function(index, element){
				//hide each ui by default
				var uiName = $(this).attr("id");
				switch(uiName){
				case "HUD":
					self.list[uiName] = new HeadUpDisplay($(this), this.rpg);
					break;
				case "Dialogue":
					self.list[uiName] = new Dialogue($(this), this.rpg);
					break;
				case "Options":
					self.list[uiName] = new Options($(this), this.rpg);
					break;
				case "Inventory":
					self.list[uiName] = new Inventory($(this), this.rpg);
					break;
				case "QuestWindow":
					self.list[uiName] = new QuestWindow($(this), this.rpg);
					break;
				case "StatusWindow":
					self.list[uiName] = new StatusWindow($(this), this.rpg);
					break;
				default:
					self.list[uiName] = $(this);	
				}
				self.list[uiName].hide();	
			});
		});	
	},
	
	showDialogue : function(texts){
		self.list["Dialogue"].showDialogue(texts);
	},
	
	updateHUD : function(type, _value){
		switch(type)
		{
		case "HP":
			self.list["HUD"].HPUpdate(_value);
			break;
		case "EXP":
			self.list["HUD"].EXPUpdate(_value);
			break;
		default:
			//nothing
		}
	},
}


function UIComponent(){};
UIComponent.prototype = {
	rpg : null,
	dom : null,
	initialize : function(_obj, _rpg){},
	show : function(){this.dom.show();},
	hide : function(){this.dom.hide();},
};



function Inventory(dom, _rpg){
	this.initialize(dom, _rpg);
}
Inventory.prototype = Object.create(UIComponent.prototype);
Inventory.prototype.constructor = Inventory;
jQuery.extend(Inventory.prototype, {
	initialize : function(_obj, _rpg){
		this.rpg = _rpg;
		this.dom = _obj;
		
		this.dom.find("#btUseItem").click(function(){
			var id = $(this).siblings("itemid").attr("id");
			_rpg.publish("USE_ITEM", {itemid: id});
			
			$(this).parent().hide();
		});
		
		this.dom.find("#btDropItem").click(function(){
			var id = $(this).siblings("itemid").attr("id");
			_rpg.publish("DROP_ITEM", {itemid: id});
			
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




function HeadUpDisplay(dom, UIC){
	this.initialize(dom, UIC);
}
HeadUpDisplay.prototype = Object.create(UIComponent.prototype);
HeadUpDisplay.prototype.constructor = HeadUpDisplay;
jQuery.extend(HeadUpDisplay.prototype, {
	initialize : function(_obj, _rpg){
		this.rpg = _rpg;
		this.dom = _obj;
	},
	
	HPUpdate : function(_HP){
      /* args = {HP : value}*/
      if(topic != "HP_UPDATE") return;
		
      dom.find("#HealthBar > span").css("width", _HP + "%");	
	},

    EXPUpdate : function(_EXP){
		/* args = {EXP : value}*/
		if(topic != "EXP_UPDATE") return;

		this.dom.find("#EXPBar > span").css("width", _EXP + "%");
    },

    QuestUpdate : function(topic, args){
		/* args = {Desc : string, Current : value, Goal : value}*/
		if(topic != "QUEST_UPDATE") return;
		
		this.dom.find("#QuestHUD > .questText").text(args.Desc);
		this.dom.find("#QuestHUD > .questStatus > .questCurrent").text(args.Current);
		this.dom.find("#QuestHUD > .questStatus > .questGoal").text(args.Goal);
    }, 
});



function Dialogue(dom, UIC){
	this.initialize(dom, UIC);
}
Dialogue.prototype = Object.create(UIComponent.prototype);
Dialogue.prototype.constructor = Dialogue;
jQuery.extend(Dialogue.prototype, {
	initialize : function(_obj, _rpg){
		this.rpg = _rpg;
		this.dom = _obj;
		
	},
});



function Options(dom, UIC){
	this.initialize(dom, UIC);
}
Options.prototype = Object.create(UIComponent.prototype);
Options.prototype.constructor = Dialogue;
jQuery.extend(Options.prototype, {
	initialize : function(_obj, _rpg){
		this.rpg = _rpg;
		this.dom = _obj;
		
	},
});



function QuestWindow(dom, UIC){
	this.initialize(dom, UIC);
}
QuestWindow.prototype = Object.create(UIComponent.prototype);
QuestWindow.prototype.constructor = QuestWindow;
jQuery.extend(QuestWindow.prototype, {
	initialize : function(_obj, _rpg){
		this.rpg = _rpg;
		this.dom = _obj;
		
	},
});



function StatusWindow(dom, UIC){
	this.initialize(dom, UIC);
}
StatusWindow.prototype = Object.create(UIComponent.prototype);
StatusWindow.prototype.constructor = StatusWindow;
jQuery.extend(StatusWindow.prototype, {
	initialize : function(_obj, _rpg){
		this.rpg = _rpg;
		this.dom = _obj;
	},
});
