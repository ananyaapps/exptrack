buddy_db = function() {
	//The constants (So called !!)
	var NAME = 'BuddyExpendeDb';
	var VERSION = '1.0';
	var SIZE = 1000000;
	var BUDDY_TABLE = 'BuddyTb';
	var BUDDYEXPENSE_TABLE = 'BuddyExpenseTb';

	//Reference to database object
	var db;
	//current operation for logging
	var message;
	//current database query to be executed
	var query;

	var defaultSuscessCB = function() {
		logger.log('Suscess : ' + message);
	};
	var defaultErrorCB = function(err) {
		logger.log('Fail : ' + message + 'error message : ' + err.message + ' error code : ' + err.code);

	};
	var createTables = function(tx) {
		var query = 'CREATE TABLE IF NOT EXISTS ' + BUDDY_TABLE + '(id INTEGER NOT NULL PRIMARY KEY ASC AUTOINCREMENT,' + 'name STRING NOT NULL UNIQUE,' + 'number TEXT,' + 'total_expense INTEGER NOT NULL,' + 'def_currency TEXT ,' + 'email TEXT)';
		//message for logger functionality
		message = 'Creating table BuddyExpenseTb';
		tx.executeSql(query);
		query = 'CREATE TABLE IF NOT EXISTS ' + BUDDYEXPENSE_TABLE + '(exp_id INTEGER NOT NULL PRIMARY KEY ASC AUTOINCREMENT, ' + 'exp_amount REAL NOT NULL,' + 'exp_desc TEXT,' + 'exp_date INTEGER NOT NULL,' + 'exp_place TEXT,' + 'exp_currency TEXT,' + 'exp_owner INTEGER NOT NULL)';
		//message for logger functionality
		message = 'Creating table BuddyExpenseTb';
		tx.executeSql(query);
	};
	//buddy class
	var Buddy = function(values) {
		//If name is not defined, return null object
		if(values.name === undefined) {
			return null;
		}
		this.id = values.id;
		this.name = values.name;
		this.number = values.number;
		this.email = values.email;
		this.total_expense = 0;
	};

	Buddy.prototype.save = function(suscessCB, failureCB) {
		//cache the object
		var that = this;
		//if callbacks are not provided, use default callbacks
		suscessCB = suscessCB || dbObject.defaults.userSuscessCB;
		failureCB = failureCB || dbObject.defaults.userFailCB;
		message = 'Saving buddy to the database';
		//hook the suscess callback to set the id
		hookSuscessCB = function(tx, resultSet) {
			var result = {};
			that.id = resultSet.insertId;
			//number of modified items is 1
			result.cntModified = 1;
			result.cntFailed = 0;
			//Call the original suscess CB
			suscessCB(result);

		};
		//Save as new entry in the database only if id is -1
		if(this.id === -1) {
			db.transaction(function(tx) {
				tx.executeSql('INSERT INTO ' + BUDDY_TABLE + '(name, number, email,total_expense ) VALUES (?, ?, ?, ?);', [that.name, that.number, that.email, that.total_expense], hookSuscessCB);
			}, failureCB);
		}
		//todo : prasanna : save the already existing buddy also
	};
	//Function to erase buddy from the database
	Buddy.prototype.erase = function(suscessCB, failureCB) {
		//cache the object
		var that = this;
		var custom_error = {};
		//hook the suscess callback
		var hookSuscessFunction = function() {
			//Set the invalid id, so that the delete attempt on this object fails
			that.id = -1;
			var result = {};
			//set the result, number of modified items is 1
			result.cntModified = 1;
			result.cntFailed = 0;
			//Now call the desired callback
			suscessCB(result);
		};
		//if callbacks are not provided, use default callbacks
		suscessCB = suscessCB || dbObject.defaults.userSuscessCB;
		failureCB = failureCB || dbObject.defaults.userFailCB;
		message = 'Erasing buddy from database';
		//Delete only if the proper id is available
		if(this.id === -1 || this.id === undefined || this.id === null) {
			//id not set properly, delete failed
			custom_error.code = 101;
			custom_error.message = 'id not set properly';
			failureCB(custom_error);
		} else {
			//proper id available, delete the buddy from the database
			db.transaction(function(tx) {
				var query = 'DELETE FROM ' + BUDDY_TABLE + ' WHERE id = ' + that.id;
				logger.log('query ' + query);
				tx.executeSql(query, [], suscessCB);
			}, failureCB);
		}
		//todo : prasanna : delete the entries from expense table also
	};

	Buddy.prototype.getFormattedText = function(format) {
		var str = '';
		//todo : prasanna : adjust the balance amount display
		str += '<li><input type="button"  data-icon="check" data-iconpos="notext" class="buddy_select" data-theme="d"/><h3 class="buddy_list_item">' + this.name + '</h3><p class="ui-li-aside" <strong>balance : ' + (this.total_expense / 1000) + '</strong></p></li>';
		return str;
	}
	var dbObject = {
		init : function() {
			db = window.openDatabase(NAME, VERSION, NAME, SIZE);
			db.transaction(createTables, defaultErrorCB, defaultSuscessCB);
		},
		//create and return the new buddy object , which can be saved
		createBuddy : function(values) {
			//Since this is a new element, mark the id as -1
			$.extend(values, {
				id : -1
			});
			var buddy = new Buddy(values);
			return buddy;
		},
		//function to find buddies. suscessCB receives the list of Buddy objects found in the database
		findBuddies : function(buddyFields, suscessCB, failureCB) {
			failureCB = failureCB || this.defaults.userFailCB;
			suscessCB = suscessCB || this.defaults.userSuscessCB;
			//Add the id also in the search crieteria
			buddyFields.push('id');
			var query = 'SELECT ' + buddyFields.join(', ') + ' FROM ' + BUDDY_TABLE;
			//Suscess handler for the db query.This function receives the transcation object & results
			var suscessHandler = function(tx, results) {
				//cache the rows
				var result = {};
				var rows = results.rows;
				var length = rows.length;
				var i;
				//start with an empty array
				var buddies = [];
				result.cntModified = length;
				result.cntFailed = 0;
				//create buddy objects from he database result
				for( i = 0; i < length; i++) {
					buddies.push(new Buddy(rows.item(i)));
				}
				result.buddies = buddies;
				//Call the user callback with the result set
				suscessCB(result);
			};
			db.transaction(function(tx) {
				tx.executeSql(query, [], suscessHandler);
			}, failureCB);
		},
		//Function to batch operation
		//params:
		//@@objArray : Array of objects, on which the operations needs to be done either array of buddy or expense
		//@@operation : possible operations -> erase,save
		batchOperation : function(objArray, operation, dbCbk) {
			var objCount = objArray.length;
			//number of times the callback called , so far
			var cbkCount = 0;
			//result
			var result = {};
			var index = 0;
			result.cntModified = 0;
			result.cntFailed = 0;
			var hookSuscessCB = function() {
				result.cntModified++;
				cbkCount++;
				//Batch operation complete, invoke the user function
				if(cbkCount === objCount) {
					dbCbk(result);
				}
			};
			var hookFailueCB = function(err) {
				result.cntFailed++;
				cbkCount++;
				//Batch operation complete, invoke the user function
				if(cbkCount === objCount) {
					dbCbk(result);
				}
			};
			//batch operation over the collection
			for( index = 0; index < objCount; index++) {
				if(operation === 'erase') {
					objArray[index].erase(hookSuscessCB,hookFailueCB);
				} else if(operation === 'save') {
					objArray[index].save(hookSuscessCB,hookFailueCB);
				}
				else{
					
				}
			}

		},
		//The default options, user can change them
		defaults : {
			//The callback functions which are called for user initiated database operations
			userSuscessCB : defaultSuscessCB,
			userFailCB : defaultErrorCB
		}
	};

	return dbObject;

}();
logger = {
	log : function(msg) {
		var message = '';
		var key;
		console.log(msg);
		if( typeof msg === 'object') {
			for(key in msg) {
				if(msg.hasOwnProperty(key)) {
					message = message + '    ' + key + " : " + msg[key];
				}
			}
		} else {
			message = '    ' + msg;
		}
		$('#DebugMessage').append(message);
	}
};
