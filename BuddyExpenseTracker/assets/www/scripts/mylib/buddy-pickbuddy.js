/*global window,jQuery*/
/*properties
    $page, AddBuddyPickObj, attr, buddy_db, contacts, createBuddy, data, 
    delegate, displayName, each, find, getDBObject, getFormattedText, html, 
    init, listview, message, multiple, navigator, pagehide, save, 
    setSelectedState, setStatus, status, val
*/

//Global variables
//Object for AddBuddy screen by picking from the contacts
(function(module,$) {

	//This page
	var $page,
	//Contact list picked from Native contacts database
	$contactList,
	//List that holds the selection field , ie the check icon
	$contactSelList,
	//The object to display the message for the user
	$pickContactMessage,
	//Message for the user..holds the current operation in progress
	message,
	//Displayed list of contacts
	dispContacts = [],
	retObj = {},database,
	navigator = window.navigator;

	//Database callback function
	function dbCbk(result,error){
		//Database operation suscessful
		//if the database is suscessfully updated (from pickcontact section)
		if (result.cntFailed === 0){
			$pickContactMessage.html(message + ' suscessful');
		}
		//if the database update failed (from pickcontact section)
		else{
			//Set the error message
			$pickContactMessage.html(message + ' failed ' + error.message).setStatus({
				status : "error"
			});
		}
	}

	//Function to handle populating contact list , when Pick Contact section is expanded
	function loadContacts() {
		//message to be displayed for the user
		var message,
		//status of the message for the user
		status,
		//Text in the search bar
		filter, fields = ["displayName", "phoneNumbers", "emails"], onSuccess = function(contacts) {
			var index, length = contacts.length,
			//Actual length of contacts, after filtering
			actLength = 0, list = '';
			for( index = 0; index < length; index = index + 1) {
				if(contacts[index].displayName !== null) {
					actLength = actLength + 1;
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
		}, onError = function(contactError) {
			message = 'Fetching contacts failes' + contactError;
			$pickContactMessage.html(message).setStatus({
				status : "error"
			});
		};
		//Store the concerned section object
		//Check if the contact data is already populated
		$contactList.html('').listview('refresh');
		//User needs to enter minimum 3 chracters in the search filed
		filter = $page.find('input[data-type="search"]').val();

		if($.trim(filter).length < 3) {
			message = 'Please enter min 3 chars';
			status = "error";
		} else {
			message = 'Contacts loading in progress..';
			status = "wait";
			navigator.contacts.find(fields, onSuccess, onError, {
				filter : filter,
				multiple : true
			});
		}
		$pickContactMessage.html(message).setStatus({
			status : status
		});

		//prevent default
		return false;
	}

	//Function to handle the button clicks in PickContact section
	function pickContactButtonHandler() {
		var value = $(this).attr('data-action'),
		//number of contacts selected
		noContacts = 0,
		//temporary variables
		buddy;
		//alert(value);
		switch (value) {
			case 'LoadContacts':
				loadContacts();
				break;

			case 'Add':
				//prasanna : some optimisations can be done here
				$contactSelList.each(function() {
					if($(this).data('sel-status') === true) {
						noContacts = noContacts + 1;
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
							database.createBuddy(buddy).save(dbCbk);
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
	}

	function selectContact(event) {
		$(this).setSelectedState();
		//Prevent defaults
		return false;
	}

	retObj = {
		//init function for the page.This should be passed the jQuery page object
		init : function(page) {

			database = module.buddy_db;
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
			$contactList.delegate('.buddy_select', 'click', selectContact);
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
	module.AddBuddyPickObj = retObj;
	window.buddyExpTrack = module;

	return module;

}((buddyExpTrack || {}),jQuery));
