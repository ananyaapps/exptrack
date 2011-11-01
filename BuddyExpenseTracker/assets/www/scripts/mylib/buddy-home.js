/*global jQuery*/
/*properties
$page, HomeObj, attr, changePage, delegate, find, init, mobile
*/
//Global variables
//HomeObj handles the activities for the homescreen
( function(module, $) {
	var controller;
	//Function to handle clicks in the dashboard
	function DashBoardHandler(event) {
		var $this = $(this), action = $this.attr('data-action');
		switch(action) {
			case 'ListExpense':
				break;

			case 'AddBuddy1':
				controller.navigate("#AddBuddy");
				break;

			case 'AddBuddy2':
				controller.navigate("#AddBuddyPick");
				break;

			case 'AddExpense':
				break;

			case 'EditBuddies':
				//Show the page loading message
				//$.mobile.showPageLoadingMsg();
				//Populate the contents of the page
				controller.navigate("#EditBuddies");
				//$.mobile.showPageLoadingMsg();
				break;

			default:
				break;
		}
		return false;
	}

	var retObj = {
		//HomePage object must be pased to the init function
		init : function(page) {
			//Initialise closures
			controller = module.buddyController;
			//Update member variable, store the page
			this.$page = page;
			page.find('#HomeScreenButtons').delegate('a', 'click', DashBoardHandler);

		}
	};

	module.HomeObj = retObj;
	window.buddyExpTrack = module;
	return module;

}((buddyExpTrack || {}), jQuery));
