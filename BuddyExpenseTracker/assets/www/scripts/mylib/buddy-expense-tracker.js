//Controller sub-module
( function(module, $) {
	//Start with an empty
	var retObj = {}, AddBuddyObj, HomeObj, EditBuddyObj, AddBuddyPickObj, buddy_db;

	//Initialisation function for AddBuddy screen, called when the page is created
	function addBuddyInit(){
		var $page = $('#AddBuddy');
		AddBuddyObj.init($page);
		//Clear some stuff on the page before hiding
		$page.live('pagehide', AddBuddyObj.pagehide);
	}

	//Initialisation function for Home screen, called when the page is created
	function homeInit(){
		var $page = $('#HomeScreen');
		HomeObj.init($page);
	}

	//Initialisation function for Add buddy pick screen, called when the page is created
	function addBuddyPickInit(){
		var $page = $('#AddBuddyPick');
		AddBuddyPickObj.init($page);
		$page.live('pagehide', AddBuddyPickObj.pagehide);
	}

	//Initialisation function for EditBuddies screen, called when the page is created
	function editBuddiesInit(){
		var $page = $('#EditBuddies');
		EditBuddyObj.init($page);
		$page.live('pageshow', EditBuddyObj.pageshow);
		$page.live('pagehide', EditBuddyObj.pagehide);
	}


	retObj.init = function() {
		//initialise closure variables
		AddBuddyObj = module.AddBuddyObj;
		HomeObj = module.HomeObj;
		EditBuddyObj = module.EditBuddyObj;
		AddBuddyPickObj = module.AddBuddyPickObj;
		buddy_db = module.buddy_db;

		//Initialise database related part
		buddy_db.init();

	};

	//navigator function to navigate to pages
	retObj.navigate = function(to, options) {
		$.mobile.changePage(to, options);

	};
	
	//This function is called upon page initialisation. This is the equivalent of DOM ready for a page
	retObj.pageInit = function(event){
		var page = event.target.id;
		logger.log(event.target.id);
		switch(page){
			case 'HomeScreen':
				homeInit();
			break;

			case 'AddBuddy':
				addBuddyInit();
			break;

			case 'AddBuddyPick':
				addBuddyPickInit();
			break;

			case 'EditBuddies':
				editBuddiesInit();
			break;
		}
	};

	module.buddyController = retObj;
	window.buddyExpTrack = module;
	return module;
}((buddyExpTrack || {}), jQuery));

//$(document).bind("mobileinit", Initialise);

$(document).ready(function() {
	buddyExpTrack.buddyController.init();
	if( typeof (PhoneGap) !== 'undefined') {
		$('body > *').css({
			minHeight : '100% !important',
			minWidth : '100% !important'
		});
	}
	$(document).bind('pageinit',buddyExpTrack.buddyController.pageInit);
});

$(document).bind("mobileinit", function() {
	$.mobile.defaultPageTransition = 'none';
	$.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.useFastClick = false;
});
