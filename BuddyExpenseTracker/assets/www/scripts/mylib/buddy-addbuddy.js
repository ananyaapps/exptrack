/*global window,jQuery*/
/*properties
    $page, AddBuddyObj, addClass, attr, buddy_db, clearForm, clearLabels, 
    createBuddy, delegate, each, email, find, html, init, message, name, 
    number, pagehide, prev, save, serializeArray, setStatus, status, val, value
*/
//Global variables

//Add Buddy screen object
//AddBuddy object handles the activities for Add Buddy screen
(function(module,$) {

	//List of form elements to be validated for emptiness
	var inputMapVar, $form, $page,database,
	//Message for the user..holds the current operation in progress
	message, $msgBox, retObj = {};

	//Callback function , if the database is suscessfully updated
	function dbCbk(result,error){
		//Database operation suscessful.
		if (result.cntFailed === 0){
			$msgBox.html(message + 'suscessful').setStatus();	
		}
		//Database operation failed
		else{
			$msgBox.html(message + 'failed ' + error.message).setStatus({
			status : 'error'
			});
		}
		
	}

	//Function that manages the submission of AddBuddy form
	function formHandler() {

		var err = '', 
			values;
		//Clear the label format (the red error message etc.)
		$form.clearForm.clearLabels(inputMapVar);
		//Dont clear the form , but clear the form messages
		$msgBox.html('');

		// Perform form validation for empty strings
		inputMapVar.each(function(index) {
			if($(this).val() === null || $.trim($(this).val()).length === 0) {
				$(this).prev().addClass("missing");
				err = 'Please enter the mandatory fields';
			}
		});
		if(err.length !== 0) {
			$msgBox.html(err).setStatus({
				status : 'error'
			});
			//prevent default behaviour and return from the function
			return false;
		}

		//Read the form values, in the form of an object
		values = $form.serializeObject();
		//Show a wait message for the user
		message = "Update buddy ";
		$msgBox.html(message + 'in progress...').setStatus();

		database.createBuddy({
			name : values.AB_Name_r,
			number : values.AB_Number,
			email : values.AB_EMail
		}).save(dbCbk);

		//prevent default behaviour
		return false;

	}

	//button click handler
	function buttonHandler() {
		var value = $(this).attr('data-action');
		switch(value) {
			case 'Add':
				//Process the form
				formHandler();
				break;

			case 'Clear':
				//Clear the form input elements
				$form.clearForm();
				//Clear the label format
				$form.clearForm.clearLabels(inputMapVar);
				//Clear the message area
				$msgBox.html('');
				break;

			default:
				break;
		}
		//prevent defaults
		return false;

	}

	retObj = {
		//init function for the page.This should be passed the jQuery page object
		init : function(page) {
			database = module.buddy_db;
			//Store the page in the local variable
			$page = page;
			this.$page = page;
			$form = page.find('#AB_AddDetailsForm');
			$msgBox = page.find('#AB_Msg');

			//Initialise all the form elements, that can not be empty
			inputMapVar = $form.find('input[name*="_r"]');

			//Handle button clicks
			page.delegate('.buddy_button', 'click', buttonHandler);

		},
		//function called before hiding the page, do some clean-up
		pagehide : function() {
			//Clear the form input elements
			$form.clearForm();
			//Clear the label format
			$form.clearForm.clearLabels(inputMapVar);
			//Clear the message area
			$msgBox.html('');
		}
	};
	module.AddBuddyObj = retObj;
	window.buddyExpTrack = module;
	return module;

}((buddyExpTrack || {}),jQuery));
