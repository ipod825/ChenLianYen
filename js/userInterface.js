function UIController(uiDiv, uifile){
	$(uiDiv).load(uifile, function(){
		//u=$(uiDiv);
		//option=u.find('#option')[0];
		//option.onclick=toggleVisibility.bind(u,'#options');
	});
}


function UIContiner(){
	this.components;
}

function UIComponent(){

}

function toggleVisibility(id){
	//var e = $(this).find(id)[0];
	var e = $(id)[0];
	if(e.style.display == 'block')
		e.style.display = 'none';
	else
		e.style.display = 'block';
}
