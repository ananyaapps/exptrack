/*global window,jQuery,buddy_db*/
/*properties
$page, attr, buddies, button, confirm, data, delegate, each, erase, find,
findBuddies, getFormattedText, html, init, listview, message, pagehide,
pageshow, parent, remove, setSelectedState, setStatus, status
*/

//Edit buddies screen object
var EditBuddyObj = ( function($, database) {
	//Reference to current page
	var $page,
	//List that holds the buddies
	$buddyList,
	//List that holds the selection field , ie the check icon
	$buddySelList,
	//Div for displaying messages
	$msgBox,
	//message to display
	$message,
	//number of contacts selected
	noContacts = 0,
	//cache the confirm function
	confirm = window.confirm,
	//Start with an empty object to return
	retObj = {};

	//Default fail CB for database queries
	function failureCB(error) {
		$msgBox.html($message + ' failed ' + error.message).setStatus({
			status : 'error'
		});

	}

	//Callback function , if the database is suscessfully updated
	function suscessCB() {
		$msgBox.html($message + ' suscessful').setStatus();
	}

	//Function to handle the click on the checkbox
	function selectBuddy() {
		$(this).setSelectedState();
		//$buddyList.listview('refresh');
	}

	//function to handle the button clicks and actions on the page
	function buttonHandler(event) {
		var value = $(this).attr('data-action');
		switch(value) {
			case 'Delete':
				//prasanna : some optimisations can be done here
				$buddySelList.each(function() {
					if($(this).data('sel-status') === true) {
						noContacts = noContacts + 1;
					}
				});
				//Atleast one contact needs to be selected
				if(noContacts === 0) {
					$msgBox.html('Please select buddies to delete').setStatus({
						status : "error"
					});
				} else {
					//Confirm with the user before deleting
					if(confirm('Are you sure to delete ' + noContacts + ' buddies?')) {
						$message = "Delete " + noContacts + " buddies";
						$msgBox.html($message + " in progress.Please wait").setStatus();
						$buddySelList.each(function(index) {
							var $this = $(this);
							if($this.data('sel-status') === true) {
								//Delete the buddy from db
								$this.data('this_buddy').erase(suscessCB, failureCB);
								//imp : prasanna : dependency on jqm , may break
								//remove the list element
								$this.parent().parent().remove();
								//buddies[index].erase(suscessCB, failureCB);
							}
						});
						$buddyList.listview('refresh');

					} else {
						$msgBox.setStatus();
					}
				}
				//Reset this before leaving
				noContacts = 0;
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
		return false;
	}

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
			var buddySuscess = function(result) {
				var buddies = result.buddies, len = buddies.length, str = '', i;
				for( i = 0; i < len; i = i + 1) {
					str += buddies[i].getFormattedText('EditBuddies');
				}
				$buddyList.html(str).listview('refresh');
				$buddySelList = $buddyList.find('.buddy_select').each(function(index) {
					//Store the associated buddy object in DOM
					$(this).data('this_buddy', buddies[index]);
				});
				$buddySelList.button();
				$message = "Found " + buddies.length + " Buddies";
				$msgBox.html($message);
			};
			$message = "Populating buddy list";
			$msgBox.html($message + ' Please wait');
			database.findBuddies(['name', 'total_expense'], buddySuscess, failureCB);
		},
		//do some cleanup stuff after the page is gone
		pagehide : function() {
			$msgBox.html('');
			$buddyList.html('').listview('refresh');
			//Clear the message box
			$msgBox.html('');

		}
	};

	return retObj;

}(jQuery, buddy_db));
