var app;
var idDiv = "idDiv";
var imgDefaultWidth = 1480/2; //tamanho da imagem
var imgDefaultHeight = 2008/2; //tamanho da imagem

function App(){
}
$(function(){	
	app = new App();
});

App.prototype = {
	//obtem a posicao de onde sera incluido o widget no canvas
	getPositionWidgetIcon: function(){
		if(event.toElement.id === "divAreaCanvas"){
			app.createWidgetIcon(event.layerX, event.layerY)
		}
	},
	//obtem o id do ultimo widget criado e retorna um novo id
	getIconId: function(){		
		var id = window.localStorage.getItem(idDiv);
		var newId;
		if(id === null)
			newId = 0;
		else
			newId = parseInt(id);				
		newId +=1;		
		return newId;
	},
		
	createWidgetIcon: function(x, y){
		var objectType = app.verifyTypeObject();
		var custom = app.getDimensionObject(objectType);

		iconId = app.getIconId();
		var newDiv = document.createElement("div");
		newDiv.id = "divWidgetIcon" + iconId;
		newDiv.setAttribute("draggable","true");
		newDiv.setAttribute("ondragstart","return app.dragStart(event)");
		newDiv.setAttribute("ondragover","return app.dragOver(event)");
		newDiv.setAttribute("onkeypress","app.pressKeyCode(this.id)");
		newDiv.style.padding = 5 + "px";

		if (custom === null){
			newDiv.style.width = 15 + "px";
			newDiv.style.height = 10 + "px";	
		} else {
			newDiv.style.width = custom.object[0].width;
			newDiv.style.height = custom.object[0].height;
		}

		newDiv.style.resize = "both";
		newDiv.style.overflow = "auto";
		newDiv.style.zIndex = 12;
		newDiv.tabIndex = iconId;
		newDiv.style.backgroundColor="rgba(0,255,0,0.5)"
		newDiv.style.position = "absolute";
		newDiv.style.marginLeft = x + "px";
		newDiv.style.top = y + "px";
		document.getElementById("divAreaCanvas").appendChild(newDiv);
		window.localStorage.setItem(idDiv,iconId);
	},
	pressKeyCode: function(id){
		var div = "#" + id;
		if(event.keyCode === 100 || event.keyCode === 68){//pressionar d remove o elemento
			document.getElementById(id).remove();
			$('#widgetProperties').css('display', 'none');		
		} else if(event.keyCode === 13){//pressionar enter salva posicao e tamanho			
			document.getElementById(id).style.opacity = 0.2;
			var _o = app.verifyTypeObject();

			var divTemp = document.getElementById(id);
			app.saveDimensionObject(divTemp, _o);

			app.showDetails(id, _o);
		}
	},
	showDetails: function(id, type){
		var div = document.getElementById(id);
		if(type === "widget"){			
		    console.log("{"+ "\n" +
			    			"\t" + "'defaultTopLocation':" + div.style.top + "," + "\n" + 
			    			"\t" + "'defaultLeftLocation':" + div.style.marginLeft + "," + "\n" +
			    			"\t" + "'topLocation':" + "0" + "," + "\n" +
			    			"\t" + "'width':" + div.style.width + "," + "\n" +
			    			"\t" + "'height':" + div.style.height + "," + "\n" +
			    			"\t" + "'pagina':" + $("#paginaWidget").val() + "," + "\n" +
			    			"\t" + "'type':" + "'html'" + "," + "\n" +
			    			"\t" + "'url':" + "'widgets/" + $("#numberWidget").val() + "/OED/index.html'" + "," + "\n" +
			    			"\t" + "'titulo':" + "'" +$("#titleWidget").val() + "'" + "\n" + 
			    		"},");
		} else if(type === "sumario"){
		    console.log(" {'defaultTopLocation':" + div.style.top + "," + 
		    			" 'defaultLeftLocation':" + div.style.marginLeft + "," +
		    			" 'topLocation':" + "0" + "," +
		    			" 'width':" + div.style.width + "," +
		    			" 'height':" + div.style.height + "," +
		    			" 'pagina':" + $("#paginaSumario").val() + "," +
		    			" 'paginaTarget':" + $("#paginaTarget").val() + "},");			
		} else{
			alert("Selecione: Widget ou Sumario!!!");
			div.remove();
		}		    
	},
	/*DRAG AND DROP*/
	dragStart: function (ev) {
	   ev.dataTransfer.effectAllowed='move';
	   ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
	   ev.dataTransfer.setDragImage(ev.target,0,0);
	   return true;
	},
	dragEnter: function(ev) {
	   event.preventDefault();
	   return true;
	},
	dragOver: function(ev) {
	    return false;
	},
	dragDrop: function(ev) {
	   var src = ev.dataTransfer.getData("Text");
	   document.getElementById(src).style.position = "absolute";
	   document.getElementById(src).style.marginLeft = ev.layerX + "px";   
	   document.getElementById(src).style.top = ev.layerY + "px";
	   ev.target.appendChild(document.getElementById(src));
	   ev.stopPropagation();
	   $('#widgetProperties').css('display', 'block');
	   return false;
	},
	loadPage: function(){
		var paginaImg = new Image();
		
		var canvas = document.getElementById("divCanvasPage");
		var ctx = canvas.getContext("2d");
		paginaImg.onload = function(){
			ctx.clearRect(0, 0, imgDefaultWidth, imgDefaultHeight);
			ctx.drawImage(paginaImg, 0, 0, imgDefaultWidth, imgDefaultHeight);
		}
		paginaImg.src = $("#pagina").val() + '.jpg';
	},

	verifyTypeObject: function(){
		var type;
		var _object = document.getElementsByName("_control");
		
		for (var x = 0; x < _object.length; x++){
			if(_object[x].checked)
			type = _object[x].value;	
		}

		return type;
	},

	saveDimensionObject: function(div, type){
		var dimension = { "object":[{"width":div.style.width, "height":div.style.height}]};

		window.localStorage.setItem(type, JSON.stringify(dimension));
	},

	getDimensionObject: function(type){
		var dimension = window.localStorage.getItem(type);
		return JSON.parse(dimension);
	},

	clearStorage: function(){
		window.localStorage.clear();
	},

	//teste futuro
	/*choosePage: function(){
		function selectPage(ev){
			//document.getElementById("pagina").value = ev.currentTarget.value;

		}

		document.getElementById("choose").addEventListener("change", selectPage, false);
	}*/
}	











