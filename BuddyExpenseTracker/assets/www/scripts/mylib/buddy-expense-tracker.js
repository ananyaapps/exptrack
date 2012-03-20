var buddyExpTrack = {};
//Controller sub-module
( function(module, $) {

	$(document).ready(function() {
	if( typeof (PhoneGap) !== 'undefined') {
		$('body > *').css({
			minHeight : '100% !important',
			minWidth : '100% !important'
		});
	}
	
	logger.log("In document ready");
	// $('body').load('scripts/views/templates.html',function (text){
	// 	logger.log(text);
	// })
	});

$(document).bind("mobileinit", function() {
	//buddyExpTrack.buddyController.init();
	// Disable the page transitions, as they dont work properly in Android
	// todo : Disable only for android based devices
	logger.log("In mobileinit");
	initAppRouter();
	//Initialise database related part
	module.buddy_db.init();
	$.mobile.defaultPageTransition = 'none';
	$.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.useFastClick = false;
	});	

//Initialise the router
function initAppRouter()
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

}((buddyExpTrack || {}), jQuery));

