//Global variables

//$(document).bind("mobileinit", Initialise);

$(document).ready(Initialise);

function Initialise() {

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
}
