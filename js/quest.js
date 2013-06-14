var Quest1 = new Quest('1','kill monster','monster',[
		{
			targetName : "monster001",
	count : 0,
	max : 5
		},

		{
			targetName : "monster002",
	count : 0,
	max : 4
		}
		]);
var Quest2 = new Quest('2','talktonpc','npc',[
		{
			targetName : "npc001",
	count : 0,
	max : 1
		},

		]);


function Quest(ID, _name, _goal, _goaltype,_questConditions){
	var QuestId = ID,
		name = _name,
		goal = _goal,
		goaltype = _goaltype
			questConditions = _questConditions;

	this.Initialize =function(questConditions)
	{
		//this.id = Quest.QuestId;

		for(var cond in questConditions)
		{
			var qq = new Questcondition(cond.targetName, cond.max);

			this.questConditionsArray[cond.targetName]=qq;
		}
	}
	this.update = function(object)
	{
		for(var cond in questConditions)
		{
			if (cond.targetName == object.targetName)
			{
				questConditionsArray[cond.targetName].update(object);
			}

		}
	};



}



function Questcondition(_targetName,_max)
{
	this.targetName = _targetName;
	this.max = _max;
	var count = 0;
	this.update = function(object)
	{
		count++;
	}




};

function Questmanager()
{
	var questList = new Array()
		//questList[]
		this.addQuest = function(Quest)
		{
			var newQuest = Quest;
			questList[Quest.QuestId]= newQuest ;
		};


	this.updateQuest = function(object)
	{
		if(object.type == 'npc')
		{
			quest2.update(object)
		}

	};



};



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
