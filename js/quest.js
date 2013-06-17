function QuestManager()
{
    var questList = new Array()
    //questList[]
    
    this.addQuest = function(Quest)
    {
        //var newQuest = Quest;
        //alert(Quest.QuestId);
        questList[Quest.QuestId]= Quest ;
        
        
    };
//    this.show = function()
//    {
//        alert(questList[1].questConditionsArray);
//    }
    
    this.updateQuest = function(object)
    {
        if(utility.isMonster(object.type) == true)
        {
            Quest1.update(object);
            
        }
        else if(utility.isNpc(object.type) == true)
        {
            Quest2.update(object);
        }

    };
    
    
    //uigetdateArray storage questname,targetName,count.max
    this.getQuestData = function()
    {
        var QuestData=[];
		
		for(var id in this.questList){
			var quest = this.questList[id];
			
			var NAME = quest.name;
			var GOAL = quest.goal;
			var QUESTCONDITIONS =[];
			
			for(var c in quest.questConditions)
			{
				var cond = quest.questConditions[c];
				
				var TARGET_NAME = cond.targetName;
				var MAX = cond.max;
				var COUNT = cond.count;
				
				var cond_tuple = {targetName: TARGET_NAME, max: MAX, count: COUNT};
				
				QUESTCONDITIONS.push(cond_tuple);
			}
			
			var QuestTuple = {questId: id, name: NAME, goal: GOAL, questConditions: QUESTCONDITIONS};
			QuestData.push(QuestTuple);
		}
        return QuestData;
    };
}

function Quest(ID, _name, _goal,_questConditions){
	this.initialize(ID, _name, _goal,_questConditions);
}

Quest.prototype = {
    QuestId : null,
    name : null,
    goal : null,
   // questConditions : [],
    
	initialize : function(ID, _name, _goal,_questConditions){
		this.QuestId = ID;
		this.name = _name;
		this.goal = _goal;
		this.questConditions = new Array();
		for(var c in _questConditions){
			//console.log(c + " : " + _questConditions[c]);
			var cond = _questConditions[c];
			var qq = new Questcondition(cond.targetName, cond.max);
			
			this.questConditions.push(qq);
		}
        
	},
	
	update : function(object){
        var check = 1;
		for(var cond in this.questConditions)
		{
            //alert(check);
			if (this.questConditions[cond].targetName == object.type)
			{
				
				this.questConditions[cond].update();
				
				
			}
			if (this.questConditions[cond].max != this.questConditions[cond].count)
			{
				//alert(this.questConditions[cond].targetName)
				check = 0;
			
			}
		}
		;
		if(check == 1)
		{
            //alert('1');
            this.rpg.getPlayer().updateStatus("exp", 30);
            
		}	
	},
};

var Quest1 = new Quest('1','kill monster','monster',[
                                                     {
                                                     targetName : "monster001",
                                                     id:1,
                                                     count : 0,
                                                     max : 5
                                                     },
                                                     
                                                     {
                                                     targetName : "monster002",
                                                     id:2,
                                                     count : 0,
                                                     max : 4
                                                     }
                                                     ]);
var Quest2 = new Quest('2','talktonpc','npc',[
                                                 {
                                                 targetName : "npc001",
                                                 id:3,
                                                 count : 0,
                                                 max : 1
                                                 },
                                          
                                              ]);




function questObject(_rpg){
	this.rpg = _rpg;
}





// You dont need these anymore motherfucker											  
// Quest1.Initialize();
// Quest2.Initialize();

//function update(object)
//{
//  if(utility.isMonster(object.type) == true)
//  {
//      Quest1.update(object);
//      
//  }
//  else if(utility.isNpc(object.type) == true)
//  {
//      Quest2.update(object);
//  }
//}

function Questcondition(_targetName,_max)
{
    this.targetName = _targetName;
    this.max = _max;
    this.count = 0;
    this.update = function()
    {
        this.count+=1;
        
    }
}






//Quest.prototype.Initialize =function(Quest.questConditions){
//    //this.id = Quest.QuestId;
//
//    for(var cond in Quest.questConditions)
//    {
//        var qq = new Questcondition(cond.targetName, cond.max);
//
//        this.questConditions.push(qq);
//    }
//}




//var Quest1 =
//{
//    QuestId = ;
//    name = 'kill monster';
//    goaltype = 'monster';
//    questConditions =
//    [
//        {
//             targetName : "monster001",
//             count : 0,
//             max : 5
//        },
//    
//        {
//             targetName : "monster002",
//             count : 0,
//             max : 4
//        }
//    ];
//    
//    
//};


//var questInstance = new Quest();



//var Quest2 =
//{
//    this.QuestId = '2';
//    this.name = 'talktonpc';
//    this.goal = ['npc01'];
//    this.goaltype = 'npc';
//    
//};

//        function Quest(questid,name,goal)
//            {
//                args = {id : 123, name : 123, goal : [{ target: "goblin", counter : 5}, { target: "orc", counter : 3}] };
//                    
//                
//                
//            };

//Quest.prototype.update = function(object)
//{
//    for(var cond in Quest.questConditions)
//    {
//        if (cond.targetName == object.type)
//
//
//
//};
