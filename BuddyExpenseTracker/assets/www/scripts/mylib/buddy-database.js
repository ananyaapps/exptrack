/*global jQuery,window*/
/*properties
    append, batchOperation, buddies, buddy_db, cntFailed, cntModified, code, 
    console, createBuddy, defaults, email, erase, executeSql, extend, 
    findBuddies, getFormattedText, id, init, insertId, item, log, message, 
    name, number, openDatabase, rows, save, total_expense, transaction, 
    userFailCB, userSuscessCB
*/
var logger;
logger = ( function($) {
	var retObj;
	retObj = {
		log : function(msg){
			window.console.log(msg);
		}
		// log : function(msg) {
		// 	var message = '', key;
		// 	window.console.log(msg);
		// 	if( typeof msg === 'object') {
		// 		for(key in msg) {
		// 			if(msg.hasOwnProperty(key)) {
		// 				message = message + '    ' + key + " : " + msg[key];
		// 			}
		// 		}
		// 	} else {
		// 		message = '    ' + msg;
		// 	}
		// 	$('#DebugMessage').append(message);
		// }
	};
	return retObj;
}(jQuery));


( function(module,$) {
	//The constants (So called !!)
	var NAME = 'BuddyExpendeDb', VERSION = '1.0', SIZE = 5242880, BUDDY_TABLE = 'BuddyTb', BUDDYEXPENSE_TABLE = 'BuddyExpenseTb',
		db, buddyTable, buddyExpenseTable;
	buddyTable = {};
	buddyExpenseTable = {};
	db = window.openDatabase(NAME, VERSION, NAME, SIZE);
	//function for generating "random" id of objects in DB
	function S4() {
	  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}

	function guid() {
	  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}

	// ====== [ WebSQLStore ] ======
	buddyTable.init = function (initSuccessCallback, initErrorCallback) {

		var success, error;

		var success = function (tx, res) {
		if (initSuccessCallback) initSuccessCallback(res);
		};

		var error = function (error) {
		logger.log("Error while create table", error);
		if (initErrorCallback) initErrorCallback(res);
		};

		var createTables = function (tx) {
			var query = 'CREATE TABLE IF NOT EXISTS ' + BUDDY_TABLE + '(id INTEGER NOT NULL PRIMARY KEY ASC AUTOINCREMENT,' + 'name STRING NOT NULL UNIQUE,' + 'number TEXT,' + 'total_expense INTEGER NOT NULL,' + 'def_currency TEXT ,' + 'email TEXT)';
			tx.executeSql(query);
			query = 'CREATE TABLE IF NOT EXISTS ' + BUDDYEXPENSE_TABLE + '(exp_id INTEGER NOT NULL PRIMARY KEY ASC AUTOINCREMENT, ' + 'exp_amount REAL NOT NULL,' + 'exp_desc TEXT,' + 'exp_date INTEGER NOT NULL,' + 'exp_place TEXT,' + 'exp_currency TEXT,' + 'exp_owner INTEGER NOT NULL)';
			tx.executeSql(query);
		}  

		//Keep an instance of db
		this.db = db;

		// Create tables
		db.transaction(createTables, error, success);

	};

	_.extend(buddyTable, {
		options : {},
		//Default success handler of the database, to perform internal actions
		success: function(tx,results){
			var options = this.options;
			switch(this.options.action){
				// Set the ID filed of the model
				case "set_id":
				 	options.model.id = options.model.attributes.id = results.insertId;
				 	//Call the original function
				 	options.success(tx,results);
				break;

				default:
				break;
			}
			// Reset the options, after the operation is over
			this.options = {};			
		},
		create: function (model, success, error) {
			logger.log("sql create");

			var sql = "INSERT INTO " + BUDDY_TABLE + " (name, number, email,total_expense) VALUES (?, ?, ?, ?)";
			var values = [model.get('name'), model.get('number'), model.get('number'), model.get('total_expense')];
			// Set the ID of the model later, in the callback
			this.options.action = "set_id";
			this.options.model = model;
			this.options.success = success;
			this._executeSql(sql, values, _.bind(this.success,this), error);
		},

		destroy: function (model, success, error) {
			logger.log("sql destroy");
			var id = (model.id || model.attributes.id);
			this._executeSql("DELETE FROM " + BUDDY_TABLE + " WHERE id = ?", [id], success, error);
		},

		find: function (model, success, error) {
			logger.log("sql find");
			var id = (model.id || model.attributes.id);
			var sql = "SELECT id, name, number, email, total_expense FROM " + BUDDY_TABLE + " WHERE id = ?";
			this._executeSql(sql, [id], success, error);
		},

		findAll: function (model, success, error) {
			logger.log("sql findAll");
			this._executeSql("SELECT id, name, number, email, total_expense FROM " + BUDDY_TABLE , [], success, error);
		},

		update: function (model, success, error) {
			logger.log("sql update")
			var id = (model.id || model.attributes.id);
			var sql = "UPDATE " + BUDDY_TABLE + " SET name = ?, number = ?, email = ?, total_expense = ? WHERE id = ?"
			var values = [model.get('name'), model.get('number'), model.get('email'), model.get('total_expense'), id];
			this._executeSql(sql, values, success, error);
		},

		_executeSql: function (SQL, params, successCallback, errorCallback) {
			this.db.transaction(function(tx) {
			  tx.executeSql(SQL, params, successCallback, errorCallback);
			});
		}

	});	

	buddyTable.init();
	module.buddyTable = buddyTable;


	// ====== [ Backbone.sync WebSQL implementation ] ======
	Backbone.sync = function (method, model, options) {
	  var table = model.table || model.collection.table, success, error;

	  if (table == null) {
	    console.warn("[BACKBONE-WEBSQL] model without table object -> ", model);
	    return;
	  }

	  success = function (tx, res) {
	    var len = res.rows.length, result, i;
	    if (len > 0) {
	      result = [];
	      for (i=0; i<len; i++) {
	        result.push(res.rows.item(i));
	      }
	    } 
	    options.success(result);
	  };
	  
	  error = function (tx, error) {
	    console.warn("sql error");
	    console.warn(error);
	    options.success(error);
	  };

	  switch(method) {
	    case "read":  (model.id ? table.find(model, success, error) : table.findAll(model, success, error)); 
	      break;
	    case "create":  table.create(model, success, error);
	      break;
	    case "update":  table.update(model, success, error);
	      break;
	    case "delete":  table.destroy(model, success, error);
	      break;
	    default:
	      logger.log(method);
	  }   
	};
}((buddyExpTrack || {}),jQuery));

( function(module,$) {
	//The constants (So called !!)
	var NAME = 'BuddyExpendeDb', VERSION = '1.0', SIZE = 1000000, BUDDY_TABLE = 'BuddyTb', BUDDYEXPENSE_TABLE = 'BuddyExpenseTb',

	//Reference to database object
	db,
	//current operation for logging
	message,
	//current database query to be executed
	query,
	//start with an empty db object
	dbObject = {};

	function defaultSuscessCB() {
		logger.log('Suscess : ' + message);
	}

	function defaultErrorCB(err) {
		logger.log('Fail : ' + message + 'error message : ' + err.message + ' error code : ' + err.code);

	}

	function createTables(tx) {
		var query = 'CREATE TABLE IF NOT EXISTS ' + BUDDY_TABLE + '(id INTEGER NOT NULL PRIMARY KEY ASC AUTOINCREMENT,' + 'name STRING NOT NULL UNIQUE,' + 'number TEXT,' + 'total_expense INTEGER NOT NULL,' + 'def_currency TEXT ,' + 'email TEXT)';
		//message for logger functionality
		message = 'Creating table BuddyExpenseTb';
		tx.executeSql(query);
		query = 'CREATE TABLE IF NOT EXISTS ' + BUDDYEXPENSE_TABLE + '(exp_id INTEGER NOT NULL PRIMARY KEY ASC AUTOINCREMENT, ' + 'exp_amount REAL NOT NULL,' + 'exp_desc TEXT,' + 'exp_date INTEGER NOT NULL,' + 'exp_place TEXT,' + 'exp_currency TEXT,' + 'exp_owner INTEGER NOT NULL)';
		//message for logger functionality
		message = 'Creating table BuddyExpenseTb';
		tx.executeSql(query);
	}

	//buddy class
	function Buddy(values) {
		//If name is not defined, return null object
		if(values.name === undefined) {
			return null;
		}
		this.id = values.id;
		this.name = values.name;
		this.number = values.number;
		this.email = values.email;
		this.total_expense = 0;
	}


	Buddy.prototype.save = function(dbCbk) {
		//cache the object
		var that = this,
			result = {};
		//Result object to be passed to the caller
		result.cntModified = 0;
		result.cntFailed = 0;
		//if callbacks are not provided, use default callbacks
		dbCbk = dbCbk || dbObject.defaults.userSuscessCB;
		message = 'Saving buddy to the database';
		//hook the suscess callback to set the id
		function hookSuscessCB(tx, resultSet) {
			//1 object saved
			result.cntModified = 1;
			that.id = resultSet.insertId;
			//Call the original suscess CB
			dbCbk(result);
		}

		function hookFailureCB(error){
			//indicate failure
			result.cntFailed = 1;
			dbCbk(result,error);
		}

		//Save as new entry in the database only if id is -1
		if(this.id === -1) {
			db.transaction(function(tx) {
				tx.executeSql('INSERT INTO ' + BUDDY_TABLE + '(name, number, email,total_expense ) VALUES (?, ?, ?, ?);', [that.name, that.number, that.email, that.total_expense], hookSuscessCB);
			}, hookFailureCB);
		}
		//todo : prasanna : save the already existing buddy also
	};
	//Function to erase buddy from the database
	Buddy.prototype.erase = function(dbCbk) {
		//cache the object
		var that = this, 
			custom_error = {},
			result = {};
		//Result object to be passed to the caller
		result.cntModified = 0;
		result.cntFailed = 0;			
		//hook the suscess callback
		function hookSuscessFunction() {
			//Set the invalid id, so that the delete attempt on this object fails
			that.id = -1;
			//set the result, number of modified items is 1
			result.cntModified = 1;
			result.cntFailed = 0;
			//Now call the desired callback
			dbCbk(result);
		}

		//hook the failure callback
		function hookFailureFunction(error) {
			//set the result, operation failed
			result.cntFailed = 1;
			//Now call the desired callback
			dbCbk(result,error);
		}

		//if callbacks are not provided, use default callbacks
		dbCbk = dbCbk || dbObject.defaults.userSuscessCB;
		message = 'Erasing buddy from database';
		//Delete only if the proper id is available
		if(this.id === -1 || this.id === undefined || this.id === null) {
			//id not set properly, delete failed
			custom_error.code = 101;
			custom_error.message = 'id not set properly';
			hookFailureFunction(custom_error);
		} else {
			//proper id available, delete the buddy from the database
			db.transaction(function(tx) {
				var query = 'DELETE FROM ' + BUDDY_TABLE + ' WHERE id = ' + that.id;
				tx.executeSql(query, [], hookSuscessFunction);
			}, hookFailureFunction);
		}
		//todo : prasanna : delete the entries from expense table also
	};

	Buddy.prototype.getFormattedText = function(format,index) {
		var str = '';
		//todo : prasanna : adjust the balance amount display
		str += '<li><input type="button"  data-icon="check" data-iconpos="notext" class="buddy_select" data-theme="d" data-index="' + index + '"/><h3 class="buddy_list_item">' + this.name + '</h3><p class="ui-li-aside" <strong>balance : ' + (this.total_expense) + '</strong></p></li>';
		return str;
	};
	dbObject = {
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
		findBuddies : function(buddyFields, dbCbk) {
			var result = {};
			//Result object to be passed to the caller
			result.cntModified = 0;
			result.cntFailed = 0;
			dbCbk = dbCbk || this.defaults.userSuscessCB;
			//Add the id also in the search crieteria
			buddyFields.push('id');
			var query = 'SELECT ' + buddyFields.join(', ') + ' FROM ' + BUDDY_TABLE;
			//Suscess handler for the db query.This function receives the transcation object & results
			function hookSuscessHandler(tx, results) {
				//cache the rows
				var rows = results.rows, length = rows.length, i,
				//start with an empty array
				buddies = [];
				result.cntModified = length;
				result.cntFailed = 0;
				//create buddy objects from he database result
				for( i = 0; i < length; i = i + 1) {
					buddies.push(new Buddy(rows.item(i)));
				}
				result.rows = buddies;
				//Call the user callback with the result set
				dbCbk(result);
			}

			function hookFailureHandler(error){
				result.cntFailed = 1;
				dbCbk(result,error);
			}

			db.transaction(function(tx) {
				tx.executeSql(query, [], hookSuscessHandler);
			}, hookFailureHandler);
		},
		//Function to batch operation
		//params:
		//@@objArray : Array of objects, on which the operations needs to be done either array of buddy or expense
		//@@operation : possible operations -> erase,save
		batchOperation : function(objArray, operation, dbCbk) {
			var objCount = objArray.length,
			//number of times the callback called , so far
			cbkCount = 0,
			//result
			result = {}, index = 0;
			result.cntModified = 0;
			result.cntFailed = 0;

			//hook the callback function
			function dbHookCbk(result,error){
				//todo : prasanna : combined error should be reported
				cbkCount = cbkCount + 1;
				//operation suscess
				if (result.cntFailed === 0){
					result.cntModified = result.cntModified + 1;
				}
				//operation failed
				else{
					result.cntFailed = result.cntFailed + 1;
				}
				//Batch operation complete, invoke the user function
				if(cbkCount === objCount) {
					dbCbk(result);
				}				
				
			}

			//batch operation over the collection
			for( index = 0; index < objCount; index = index + 1) {
				if(operation === 'erase') {
					objArray[index].erase(dbHookCbk);
				} else if(operation === 'save') {
					objArray[index].save(dbHookCbk);
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
	module.buddy_db = dbObject; 
	window.buddyExpTrack = module;
	return module;

}((buddyExpTrack || {}),jQuery));

