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
Quest1.Initialize();
Quest2.Initialize();



function Quest(ID, _name, _goal,_questConditions){
            this.QuestId = ID,
            this.name = _name,
            this.goal = _goal,
            this.check = 1;
            this.questConditions = _questConditions;
            this.questConditionsArray =[];
        this.Initialize =function()
        {
            //this.id = Quest.QuestId;
            //alert(this.questConditions[0].targetName);
            for( var cond in this.questConditions)
            {
                var qq = new Questcondition(this.questConditions[cond].targetName, this.questConditions[cond].max);
                
                this.questConditionsArray.push(qq);
                
                            }
        }
        this.update = function(object)
        {
            for(var cond in this.questConditionsArray)
            {
                
                
                if (this.questConditionsArray[cond].targetName == object.type)
                {
                    
                    this.questConditionsArray[cond].update();
                    
                    
                }
                if (this.questConditionsArray[cond].max != this.questConditionsArray[cond].count)
                {
                    
                    check = 0;
                
                }
                    
            }
            
            if(check == 1)
            {
            
            }
        
        
        
        };

    

}

function update(object)
{
  if(utility.isMonster(object.type) == true)
  {
      Quest1.update(object);
      
  }
  else if(utility.isNpc(object.type) == true)
  {
      Quest2.update(object);
  }
}

function Questcondition(_targetName,_max)
{
    this.targetName = _targetName;
    this.max = _max;
    this.count = 0;
    this.update = function()
    {
        this.count+=1;
        check
    }
}

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
        var uigetdateArray=[];
        for (var i=1; i<=2; i++)
        {
            for(var cond in questList[i].questConditionsArray)
            {
                var obj = {
                name : questList[i].name, //Quest name
                targetName : questList[i].questConditionsArray[cond].targetName,
                count : questList[i].questConditionsArray[cond].count,
                max : questList[i].questConditionsArray[cond].max
                }
                
            }
        }

        return uigetdateArray;
    };
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
