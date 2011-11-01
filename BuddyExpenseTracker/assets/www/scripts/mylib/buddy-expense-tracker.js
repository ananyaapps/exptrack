//Controller sub-module
( function(module, $) {
	//Start with an empty
	var retObj = {}, AddBuddyObj, HomeObj, EditBuddyObj, AddBuddyPickObj, buddy_db;

	retObj.init = function() {
		//initialise closure variables
		AddBuddyObj = module.AddBuddyObj;
		HomeObj = module.HomeObj;
		EditBuddyObj = module.EditBuddyObj;
		AddBuddyPickObj = module.AddBuddyPickObj;
		buddy_db = module.buddy_db;
		
		/*
		 $('body').live('pageshow',function(event,ui){
		 logger.log('pageshow ');
		 logger.log(ui);
		 });
		 $('body').live('pagehide',function(event,ui){
		 logger.log('pagehide ');
		 logger.log(ui);
		 });
		 $('body').live('pagecreate',function(event,ui){
		 logger.log('pagecreate ');
		 logger.log($(this));
		 });
		 */

		AddBuddyObj.init($('#AddBuddy'));
		//Clear some stuff on the page before hiding
		$('#AddBuddy').live('pagehide', AddBuddyObj.pagehide);

		//logger.log(AddBuddy);
		HomeObj.init($('#HomeScreen'));

		EditBuddyObj.init($('#EditBuddies'));
		$('#EditBuddies').live('pageshow', EditBuddyObj.pageshow);
		$('#EditBuddies').live('pagehide', EditBuddyObj.pagehide);

		AddBuddyPickObj.init($('#AddBuddyPick'));
		$('#AddBuddyPick').live('pagehide', AddBuddyPickObj.pagehide);

		//Initialise database related part
		buddy_db.init();

	};

	//navigator function to navigate to pages
	retObj.navigate = function(to, options) {
		$.mobile.changePage(to, options);

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

});

$(document).bind("mobileinit", function() {
	$.mobile.defaultPageTransition = 'none';
	$.mobile.page.prototype.options.addBackBtn = true;
	$.mobile.useFastClick = false;
});
