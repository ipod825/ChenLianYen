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
		this.list[uiName].toggle();
	},

	initialization : function(uiDivId, uifile, _rpg){
		self=this;
		self.uiDiv.load(uifile, function(){
			self.uiDiv.children("div").each(function(index, element){
				//hide each ui by default
				var uiName = $(this).attr("id");
				switch(uiName){
				case "MainScreen":
					self.list[uiName] = new MainScreen($(this), self.rpg);
					break;					
				case "HUD":
					self.list[uiName] = new HeadUpDisplay($(this), self.rpg);
					break;
				case "Dialogue":
					self.list[uiName] = new Dialogue($(this), self.rpg);
					break;
				case "Options":
					self.list[uiName] = new Options($(this), self.rpg);
					break;
				case "Inventory":
					self.list[uiName] = new Inventory($(this), self.rpg);
					break;
				case "QuestWindow":
					self.list[uiName] = new QuestWindow($(this), self.rpg);
					break;
				case "StatusWindow":
					self.list[uiName] = new StatusWindow($(this), self.rpg);
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
	show : function(){ this.dom.show();},
	hide : function(){this.dom.hide();},
	toggle : function(){
		if( !this.dom.is(':visible'))
			this.show();
		else
			this.hide();
	},
};

function MainScreen(dom, UIC){
	this.initialize(dom, UIC);
}
MainScreen.prototype = Object.create(UIComponent.prototype);
MainScreen.prototype.constructor = Dialogue;
jQuery.extend(MainScreen.prototype, {
	initialize : function(_obj, _rpg){
		var self = this;
		this.rpg = _rpg;
		this.dom = _obj;
		
		this.dom.find("#btGAMESTART").click(function(){
			self.dom.hide();
			self.rpg.getUIController().show("HUD");
		});
	},
});

function Inventory(dom, _rpg){
	this.initialize(dom, _rpg);
}
Inventory.prototype = Object.create(UIComponent.prototype);
Inventory.prototype.constructor = Inventory;
jQuery.extend(Inventory.prototype, {
	domItemOptions: null, 
	show : function(){
		this.inventoryUpdate();
		this.dom.show();
	},
	
	hide : function(){
		var itemOptions = $(this.dom.find("#itemOptions").get(0));
		this.dom.append(itemOptions);
		this.dom.hide();
	},
	
	initialize : function(_obj, _rpg){
		var self = this;
		this.rpg = _rpg;
		this.dom = _obj;
		
		var itemOptions = $(self.dom.find("#itemOptions").get(0));
		this.dom.find("#btUseItem").click(function(){
			var itemid = $(this).siblings("itemid").attr("id");
			self.rpg.getPlayer().useItem(itemid);
			
			itemOptions.hide();
			self.inventoryUpdate();
		});
		
		this.dom.find("#btDropItem").click(function(){
			var itemid = $(this).siblings("itemid").attr("id");
			self.rpg.getPlayer().dropItem(itemid);
			
			itemOptions.hide();
			self.inventoryUpdate();
		});
		
		this.dom.find("#btCancel").click(function(){
			itemOptions.hide();
		});
		
		// this.dom.click(function(){ 
			// if(itemOptions.is(':visible'))
				// itemOptions.hide(); 
		// });
	},
	
	inventoryUpdate : function(){
		var self = this;
		var bag = this.rpg.getPlayer().getBag();
		bag.push({type: "potion", number: 3, images:{"potion": "./Images/healthPotion.png"}});
		bag.push({type: "potion", number: 2, images:{"potion": "./Images/healthPotion.png"}});
		
		var grid = this.dom.find("#Grid");
		grid.html('');
		for(var i in bag){
			var item = bag[i];
			
			var str = '<div id="'+item.type+'" class="item">';
				str +='<img class="itemImg" src="'+item.images[item.type]+'" />';
				str +='<span class="itemCount">'+item.number+'</span></div>';
			var newItem = $(str).click(function(e){
				var options = $(self.dom.find("#itemOptions").get(0));
				options.hide();
				$(this).parent().append(options);
				options.css("top", this.offsetTop+24);
				options.css("left", this.offsetLeft-22);
				options.find("itemid").attr("id", item.type);
				options.show();
			});
			grid.append(newItem);
		}
	},
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
	
	HPUpdate : function(_value){
      /* args = {HP : value}*/
		
      dom.find("#HealthBar").children("span.bar").width( _value.toString() + '%');
	},

    EXPUpdate : function(_value){
		/* args = {EXP : value}*/
		// this.dom.find("#EXPBar > span").css("width", _EXP + "%");
		this.dom.find("#ExpBar").children("span.bar").width( _value.toString() + '%');
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
		
		this.dom.find("#Dialogue button#btDialogueProceed").click(function(){ 
			$(this).hide();
		});
	},
	
	showDialogue : function(_text){
		this.dom.find("#Dialogue p#dialogueText").text(_text);
		this.show();
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
	
	show : function(){
		var questList = this.rpg.getQeustManager().getQuestData();
		
		for(var i in questList){
			var quest = questList[i];
			

			var str = 	'<div class="QuestItem">';
			str += '<span class="questText">' +  quest.name + '</span>';
			str += '<span class="questStatus">';
			for(var c in quest.questConditions)
			{
				var cond = quest.questConditions[c];
				
				str += '<span class="questTarget">' + cond.targetName + '</span>';
				str += '<span class="questCurrent">' + cond.count + '</span>';
				str += '/<span class="questGoal">' + cond.max + '</span>';
			}
			str += '</span></div>';
		}
		
		this.dom.show();
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
	
	show : function(){
		var status = this.rpg.getPlayer().getStatus();
        		
		this.dom.find("#stLevel").text(status.level);
		this.dom.find("#stHP").text(status.hp);
		this.dom.find("#stHPMax").text(status.hpMax);
		this.dom.find("#stAttack").text(status.attack);
		this.dom.find("#stDefence").text(status.defense);
		this.dom.find("#stEXP").text(status.exp);
		this.dom.find("#stEXPMax").text(status.expMax);
		this.dom.find("#stMoney").text(status.money);
		
		this.dom.show();
	},
});
