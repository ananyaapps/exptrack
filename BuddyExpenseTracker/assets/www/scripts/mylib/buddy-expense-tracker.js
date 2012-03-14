var buddyExpTrack = {};
//Controller sub-module
( function(module, $) {
	//Start with an empty
	var retObj = {}, AddBuddyObj, HomeObj, EditBuddyObj, AddBuddyPickObj, buddy_db;

	//Initialisation function for Home screen, called when the page is created
	function homeInit(){
		var $page = $('#HomeScreen');
		HomeObj.init($page);
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
		logger.log("In buddyExpTrack.buddyController.pageInit");
		var page = event.target.id;
		logger.log(event.target.id);
		switch(page){
			case 'HomeScreen':
				homeInit();
			break;

			case 'AddBuddy':
				//addBuddyInit();
			break;

			case 'AddBuddyPick':
				//addBuddyPickInit();
			break;

			case 'EditBuddies':
				//editBuddiesInit();
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
	
	logger.log("In document ready");
	$(document).bind('pageinit',buddyExpTrack.buddyController.pageInit);
});

$(document).bind("mobileinit", function() {
	//buddyExpTrack.buddyController.init();
	// Disable the page transitions, as they dont work properly in Android
	// todo : Disable only for android based devices
	logger.log("In mobileinit");
	initAppRouter(buddyExpTrack);
	$.mobile.defaultPageTransition = 'none';
	$.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.useFastClick = false;
});


function initAppRouter(module)
{
	//Initialise router
		module.router = new $.mobile.Router({
		"(?:index.html$|#HomeScreen)": {handler: "firstPage", events: "i,bs,s,h"},
		"#AddBuddy$": {handler: "addBuddyPage", events: "i,h"},
		"#AddBuddyPick$": {handler: "addBuddyPickPage", events: "i,h"},
		"#EditBuddies$": {handler: "editBuddiesPage", events: "i,h,s"},
		},
		{
			firstPage: function(type,match,ui){
				logger.log("firstPage: "+type+" "+match[0]);
			},
			
			//Function to handle transitions to & from addBuddyPage
			addBuddyPage: function(type,match,ui){
				logger.log("addBuddyPage: "+type+" "+match[0]);
				switch(type){
					case 'pageinit':
						module.AddBuddyObj.init($('#AddBuddy'));
					break;

					case 'pagehide':
						module.AddBuddyObj.pagehide();
					break;

					default:
					break;
				}
			},

			//Function to handle transitions to & from addBuddyPickPage
			addBuddyPickPage: function(type,match,ui){
				logger.log("addBuddyPickPage: "+type+" "+match[0]);
				switch(type){
					case 'pageinit':
						module.AddBuddyPickObj.init($('#AddBuddyPick'));
					break;

					case 'pagehide':
						module.AddBuddyPickObj.pagehide();
					break;

					default:
					break;
				}
			},
			editBuddiesPage : function(type,match,ui){
				logger.log("editBuddiesPage: "+type+" "+match[0]);
				switch(type){
					case 'pageinit':
						module.EditBuddyObj.init($('#EditBuddies'));
					break;

					case 'pagehide':
						module.EditBuddyObj.pagehide();
					break;

					case 'pageshow':
						module.EditBuddyObj.pageshow();
					break;					

					default:
					break;
				}
			}
		},
		{ 
			defaultHandler: function(type, ui, page) {
				logger.log("Default handler called due to unknown route (" 
					+ type + ", " + ui + ", " + page + ")");
		},
		// defaultHandlerEvents: "s",
		ajaxApp : true,
		firstMatchOnly : true
	});
}
