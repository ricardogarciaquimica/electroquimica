behavior = {
  pagesFodler : 'contentPages',	
  notesFolder: 'contentNotes',
  context : {
	navBarId: 1,  
	indexId: 1
  },
  navBarClick:(item) => {
	  GotoPage(parseInt(item.id));
  },
  indexItemClick: (data,e) => {
	  var id = $(e.target).data('parameter');
	
	  GotoPage(null, parseInt(id));
  },
  nextClick: (item) => {
	 var context = this.behavior.context;
	 var nextId = context.navBarId + 1;
	 GotoPage(nextId);
  },
  previousClick: (item) => {
	var context = this.behavior.context;
	var prevId = context.navBarId - 1;
	GotoPage(prevId);
  },
}

function GotoPage(navBarId,indexId){
	var context = this.behavior.context;
	var pages = content.contentPages.contentPages;
	var page = null;
	  
	if(navBarId == null && indexId){
	    navBarId = content.minMenuId;
	}
	
	if(indexId == null){
	   indexId = context.indexId;
	}
	
	var page = pages.find(p => p.navBarId === navBarId && p.indexId === indexId);
	
	 if(page){
		 this.behavior.context.navBarId = navBarId;
		  this.behavior.context.indexId = indexId;
	
		 if(page.popUp){
			var diag = $( "#dialog" );
			diag.html(page.htmlPage);
			diag.dialog();
			return;
		 }
		 
		$( "#contentPageSectionContainer" ).html(page.htmlPage);
		
		var navItem = this.content.navBar.items.find(i => parseInt(i.id) === navBarId);
		var indexItem = this.content.index.items.find(i => parseInt(i.id) === indexId);
		this.content.currentNavBarTitle(navItem.text);
		this.content.currentIndexTitle(indexItem.text);
		
		$( "#contentNotesContainer" ).html(page.notes);
		if(page.audioUrl && page.audioUrl != ''){
			changeAudio(page.audioUrl);
		}
		else{
			changeAudio('');
		}
		
		var liMenuSelected =   $('li.category_header.itemSelected');
		if(liMenuSelected){
			// remove existing active class inside li elements
			liMenuSelected.removeClass('itemSelected');
			// add class to current clicked element
			$('li.category_header#'+navBarId).closest('li.category_header').addClass('itemSelected');
		};
		
		
		// remove existing active class inside li elements
		$('li.aListItem.itemSelected').removeClass('itemSelected');
		// add class to current clicked element
		var liI = $('li.aListItem#'+indexId).closest('li.aListItem').addClass('itemSelected');
		
		/*
		if(indexItem.parentId)
			$( "li#"+indexItem.parentId+".aParentItem").addClass('itemSelected');
		*/
	 }
	 else{
		 alert("Contenido no existente o fin del capítulo.");
	 }
}

function changeAudio(sourceUrl) {
    var audio = $("#currentAudioPlayer");      
    $("#currentAudioUrl").attr("src", sourceUrl);
    /****************/
    audio[0].pause();
    audio[0].load();//suspends and restores all audio element
    audio[0].pause();
   
   //audio[0].play(); changed based on Sprachprofi's comment below
    //audio[0].oncanplaythrough = audio[0].play();
    /****************/
}

function iframeLoaded() {
      var iFrameID = document.getElementById('contentPageSectionContainer');
      if(iFrameID) {
            // here you can make the height, I delete it first, then I make it again
            iFrameID.height = "";
            iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + "px";
      }   
  }
  
function barItem(id,text,parentId){
	this.id = id;
	this.parentId = parentId;
	this.text = text;
}

function contentPage(navBarId,indexId,popUp,htmlPage,notes){
	this.navBarId = navBarId;
	this.indexId = indexId;
	this.popUp = popUp;
	this.htmlPage = htmlPage;
	this.notes = notes;
}

function contentPages(){
	this.contentPages = [];
	
	this.addPage = function(contentPage){
		this.contentPages.push(contentPage);
	}
	
	this.getPages = function(){
		return this.contentPages;
	}
	
	this.setPages = function(cpags){
		this.contentPages = cpags;
	}
}

function navBar(){
	this.items = [];
	this.add = function(text){
		var lastItem = this.items[this.items.length-1];
	
		lastId = 0;
		
		if(lastItem != null)
			lastId = lastItem.id;
		
		lastId++;
		var item = new barItem(lastId,text);
		this.items.push(item);
	};
	this.getItems = function(){
		return this.items;
	};
	this.setItems = function(navBarItems){
		this.items = navBarItems;
	};
}

function index(){
	this.items = [];
	this.add = function(text){
		var lastItem = this.items[this.items.length-1];
	
		lastId = 0;
		
		if(lastItem != null)
			lastId = lastItem.id;
		
		lastId++;
		var item = new barItem(lastId,text);
		this.items.push(item);
	};
	this.getItems = function(){
		return this.items;
	};
	this.getParents = function(){
		return this.items.filter(i => (i.parentId != null && this.getSubItems(i.id).length == 0) || (i.parentId == null && this.getSubItems(i.id).length == 0));
	};
	this.getSubItems = function(id){
		if(this.items == null)
			return [];
		
		var found = this.items.filter(i => i.parentId === id);
		
		if(found == null)
			found = [];
		
		return found;
	};
}

function contentPage(navBarId,indexId,popUp,htmlPage,notes, audioUrl){
	this.navBarId = navBarId;
	this.indexId = indexId;
	this.popUp = popUp;
	this.htmlPage = htmlPage;
	this.notes = notes;
	this.audioUrl = audioUrl;
}

function content(imgUrl,headerTitle,headerSubTitle,footerText,indexTitle){
  this.imgUrl = imgUrl
  this.headerTitle = headerTitle;
  this.headerSubTitle = headerSubTitle;
  this.footerText= footerText;
  this.indexTitle= indexTitle;
  this.currentNavBarTitle= ko.observable('');
  this.currentIndexTitle= ko.observable('');
  this.navBar= new navBar();
  this.index= new index();
  this.contentPages = new contentPages();
  this.load = function(content){
	  this.imgUrl = content.imgUrl;
	  this.headerTitle = content.headerTitle;
	  this.headerSubTitle = content.headerSubTitle;
	  this.footerText = content.footerText;
	  this.indexTitle = content.indexTitle;
	  this.navBar.setItems(content.navBar.items);
	  this.index.items = content.index.items;
	  this.contentPages.setPages(content.contentPages.contentPages);
	  this.minMenuId = content.minMenuId;
  }
}

