//Global variables

// Home screen object.All the variables will be encapsulated within this object
var HomeObj;
//Add Buddy screen object
var AddBuddyObj;
//AddBuddy - through pick contacts screen object
var AddBuddyPickObj;
//Edit buddies screen object
var EditBuddyObj;

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
	database.init();
}

//HomeObj handles the activities for the homescreen
HomeObj = (function() {

	//Function to handle clicks in the dashboard
	function DashBoardHandler(event) {
		$this = $(this);
		var action = $this.attr('data-action');
		switch(action) {
			case 'ListExpense':
				break;

			case 'AddBuddy1':
				$.mobile.changePage("#AddBuddy");
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
				break;

			default:
				break;
		}
		return false;
	};

	var retObj = {
		//HomePage object must be pased to the init function
		init : function(page) {
			//Update member variable, store the page
			this.$page = page;
			page.find('#HomeScreenButtons').delegate('a', 'click', DashBoardHandler);

		}
	};

	return retObj;

})();

//AddBuddy object handles the activities for Add Buddy screen
AddBuddyObj = (function() {

	//List of form elements to be validated for emptiness
	var inputMapVar;
	var $form;
	var $page;
	//Message for the user..holds the current operation in progress
	var message;
	var $msgBox;

	//Function that manages the submission of AddBuddy form
	function FormHandler() {

		var err = '';
		var values;
		//Clear the label format (the red error message etc.)
		$form.clearForm.clearLabels(inputMapVar);
		//Dont clear the form , but clear the form messages
		$msgBox.html('');

		// Perform form validation for empty strings
		inputMapVar.each(function(index) {
			if($(this).val() == null || $.trim($(this).val()).length == 0) {
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

		//Read the form values
		values = $form.serializeArray();
		//Show a wait message for the user
		message = "Update buddy ";
		$msgBox.html(message + 'in progress...').setStatus();

		database.createBuddy({
			name : values[0].value,
			number : values[1].value,
			email : values[2].value
		}).save(suscessCB, failureCB);

		//prevent default behaviour
		return false;

	};

	//Callback function , if the database is suscessfully updated
	function suscessCB() {
		$msgBox.html(message + 'suscessful').setStatus();
	};

	//Callback function, if there is an error
	function failureCB(error) {
		$msgBox.html(message + 'failed ' + error.message).setStatus({
			status : 'error'
		});
	};

	var retObj = {
		//init function for the page.This should be passed the jQuery page object
		init : function(page) {

			//Store the page in the local variable
			$page = page;
			this.$page = page;
			$form = page.find('#AB_AddDetailsForm');
			$msgBox = page.find('#AB_Msg');

			//Initialise all the form elements, that can not be empty
			inputMapVar = $form.find('input[name*="_r"]');

			//Handler for Clear button
			$form.find('#AB_Clear').bind('click', function() {
				//Clear the form input elements
				$form.clearForm();
				//Clear the label format
				$form.clearForm.clearLabels(inputMapVar);
				//Clear the message area
				$msgBox.html('');
			});
			//Attach the form processing function
			$form.submit(FormHandler);

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

	return retObj;

})();

//Object for AddBuddy screen by picking from the contacts
AddBuddyPickObj = (function() {

	//This page
	var $page;
	//Contact list picked from Native contacts database
	var $contactList;
	//List that holds the selection field , ie the check icon
	var $contactSelList;
	//The object to display the message for the user
	var $pickContactMessage;
	//Message for the user..holds the current operation in progress
	var message;

	//Displayed list of contacts
	var dispContacts = [];

	//Callback function , if the database is suscessfully updated (from pickcontact section)
	function pickContactSuscessCB() {
		$pickContactMessage.html(message + ' suscessful');
	};

	//Callback function , if the database update failed (from pickcontact section)
	function pickContactFailureCB(error) {
		//Set the error message
		$pickContactMessage.html(message + ' failed ' + error.message).setStatus({
			status : "error"
		});
	};

	//Function to handle the button clicks in PickContact section
	function pickContactButtonHandler() {
		var value = $(this).attr('data-action');
		//number of contacts selected
		var noContacts = 0;
		//temporary variables
		var buddy;
		//alert(value);
		switch(value) {
			case 'LoadContacts':
				LoadContacts();
				break;

			case 'Add':
				//prasanna : some optimisations can be done here
				$contactSelList.each(function() {
					if($(this).data('sel-status') === true) {
						noContacts++;
					}
				});
				//Atleast one contact needs to be selected
				if(noContacts === 0) {
					$pickContactMessage.html("Please select contacts to add").setStatus({
						status : "error"
					});
				} else {
					message = "Update " + noContacts + " buddies";
					$pickContactMessage.html(message + " in progress.Please wait").setStatus();
					$contactSelList.each(function(index) {
						if($(this).data('sel-status') === true) {
							//Get the object to save in db
							buddy = dispContacts[index].getDBObject();
							database.createBuddy(buddy).save(pickContactSuscessCB, pickContactFailureCB);
						}
					});
				}
				break;

			//Select all the visible contacts
			case 'SelectAll':
				$contactSelList.setSelectedState(true);
				break;

			case 'Deselect':
				$contactSelList.setSelectedState(false);
				break;

			default:
				break;
		}

		//Prevent default
		return false;
	};

	function SelectContact(event) {
		$(this).setSelectedState();
		//Prevent defaults
		return false;
	};

	//Function to handle populating contact list , when Pick Contact section is expanded
	function LoadContacts() {
		//message to be displayed for the user
		var message;
		//status of the message for the user
		var status;
		//Text in the search bar
		var filter;
		//Store the concerned section object
		//Check if the contact data is already populated
		$contactList.html('').listview('refresh');

		var onSuccess = function(contacts) {
			var index;
			var length = contacts.length;
			//Actual length of contacts, after filtering
			var actLength = 0;
			var list = '';
			for( index = 0; index < length; index++) {
				if(contacts[index].displayName !== undefined) {
					actLength++;
					//Store the relevant contact
					dispContacts.push(contacts[index]);
					list += contacts[index].getFormattedText();
				}
			}
			message = 'Found ' + actLength + ' contacts';

			$pickContactMessage.html(message).setStatus();
			$contactList.html(list).listview('refresh');
			//Update the selection list again, since the list is updated
			$contactSelList = $contactList.find('.buddy_select');
		};
		var onError = function(contactError) {
			message = 'Fetching contacts failes' + contactError;
			$pickContactMessage.html(message).setStatus({
				status : "error"
			});
		};
		//User needs to enter minimum 3 chracters in the search filed
		filter = $page.find('input[data-type="search"]').val();

		if($.trim(filter).length < 3) {
			message = 'Please enter min 3 chars';
			status = "error";
		} else {
			message = 'Contacts loading in progress..';
			status = "wait";
			var fields = ["displayName", "phoneNumbers", "emails"];
			navigator.contacts.find(fields, onSuccess, onError, {
				filter : filter,
				multiple : true,
			});
		}
		$pickContactMessage.html(message).setStatus({
			status : status
		});

		//prevent default
		return false;
	};

	var retObj = {
		//init function for the page.This should be passed the jQuery page object
		init : function(page) {

			//Store the page in the local variable
			$page = page;
			this.$page = page;
			$pickContactMessage = page.find('#ABP_Msg');
			$contactList = page.find('#ABP_ContactList');

			//Handle button clicks
			page.delegate('.buddy_button', 'click', pickContactButtonHandler);

			//Display the default message, default is message status
			$pickContactMessage.html('Enter min 3 characters to search contacts').setStatus();

			//click handlers , if the contact is selected
			$contactList.delegate('.buddy_select', 'click', SelectContact);
			//prasanna : todo : required only temporarily
			$contactSelList = $contactList.find('.buddy_select');
		},
		//function called before hiding the page, do some clean-up
		pagehide : function() {
			//Display the default message, default is message status
			$pickContactMessage.html('Enter min 3 characters to search contacts').setStatus();
			//Clear the displayed contact list
			$contactList.html('').listview('refresh');
			dispContacts = [];

		}
	};

	return retObj;

})();
EditBuddyObj = (function() {
	//Reference to current page
	var $page;
	//List that holds the buddies
	var $buddyList;
	//List that holds the selection field , ie the check icon
	var $buddySelList;
	//Div for displaying messages
	var $msgBox;
	//message to display
	var $message;

	//Default fail CB for database queries
	function failureCB(error) {
		$msgBox.html($message + ' failed ' + error.message).setStatus({
			status : 'error'
		});

	};

	//Function to handle the click on the checkbox
	function selectBuddy() {
		$(this).setSelectedState();
		//$buddyList.listview('refresh');
	};

	//function to handle the button clicks and actions on the page
	function buttonHandler() {
		var value = $(this).attr('data-action');
		switch(value) {
			case 'Delete':
				break;

			case 'SelectAll':
				$buddySelList.setSelectedState(true);
				break;

			case 'Deselect':
				$buddySelList.setSelectedState(false);
				break;

			default:
				break;

		}

	};

	retObj = {
		init : function(page) {
			//update the local variable
			$page = page;
			//Add an instance variable $page
			this.$page = page;
			$buddyList = page.find('#EB_BuddyList');
			$msgBox = page.find('#EB_Msg');

			//click handlers , if the contact is selected
			$buddyList.delegate('.buddy_select', 'click', selectBuddy);

			//Handle button clicks
			page.delegate('.buddy_button', 'click', buttonHandler);
		},
		//Function to populate the list with buddies, this should be called after the page is shown
		pageshow : function() {
			//If the query is suscessful, then array of buddy objects will be returned
			var buddySuscess = function(buddies) {
				var len = buddies.length;
				var str = '';
				var i;
				for( i = 0; i < len; i++) {
					str += buddies[i].getFormattedText('EditBuddies');
				}
				$buddyList.html(str).listview('refresh');
				$buddySelList = $buddyList.find('.buddy_select');
				$buddySelList.button();
				$message = "Found " + buddies.length + " Buddies";
				$msgBox.html($message);
			};
			$message = "Populating buddy list";
			$msgBox.html($message + ' Please wait');
			database.findBuddy(['name', 'total_expense'], buddySuscess, failureCB);
		},
		//do some cleanup stuff after the page is gone
		pagehide : function() {
			$msgBox.html('');
			$buddyList.html('').listview('refresh');

		}
	};

	return retObj;

})();
