/*global jQuery*/
/*properties
    $page, attr, changePage, delegate, find, init, mobile
*/
//Global variables

//HomeObj handles the activities for the homescreen
var HomeObj = (function($) {
	//Function to handle clicks in the dashboard
	function DashBoardHandler(event) {
		var $this = $(this),
		action = $this.attr('data-action');
		switch(action) {
			case 'ListExpense':
				break;

			case 'AddBuddy1':
				//controller.navigate("#AddBuddy");
				$.mobile.changePage("#AddBuddyPick");
				break;

			case 'AddBuddy2':
				$.mobile.changePage("#AddBuddyPick");
				break;

			case 'AddExpense':
				break;

			case 'EditBuddies':
				//Show the page loading message
				//$.mobile.showPageLoadingMsg();
				//Populate the contents of the page
				$.mobile.changePage("#EditBuddies");
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
			//Update member variable, store the page
			this.$page = page;
			page.find('#HomeScreenButtons').delegate('a', 'click', DashBoardHandler);

		}
	};

	return retObj;

}(jQuery));
