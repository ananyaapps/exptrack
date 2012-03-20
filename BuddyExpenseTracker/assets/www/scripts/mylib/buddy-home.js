/*global jQuery*/
/*properties
$page, HomeObj, attr, changePage, delegate, find, init, mobile
*/
//Global variables
//HomeObj handles the activities for the homescreen
( function(module, $) {
	var controller;
	var retObj = {
		//HomePage object must be pased to the init function
		init : function(page) {
			//Initialise closures
			controller = module.buddyController;
			//Update member variable, store the page
			this.$page = page;
		}
	};

	module.HomeObj = retObj;
	window.buddyExpTrack = module;
	return module;

}((buddyExpTrack || {}), jQuery));
