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
	var NAME = 'BuddyExpendeDb', VERSION = '1.0', SIZE = (5242880), BUDDY_TABLE = 'BuddyTb', BUDDYEXPENSE_TABLE = 'BuddyExpenseTb',
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

	buddyExpenseTable.init = function (initSuccessCallback, initErrorCallback) {

		var success, error;

		var success = function (tx, res) {
		if (initSuccessCallback) initSuccessCallback(res);
		};

		var error = function (error) {
		logger.log("Error while create table", error);
		if (initErrorCallback) initErrorCallback(res);
		};

		var createTables = function (tx) {
			query = 'CREATE TABLE IF NOT EXISTS ' + BUDDYEXPENSE_TABLE + '(id INTEGER NOT NULL PRIMARY KEY ASC AUTOINCREMENT, ' + 'exp_amount REAL NOT NULL,' + 'exp_desc TEXT,' + 'exp_date INTEGER NOT NULL,' + 'exp_place TEXT,' + 'exp_currency TEXT,' + 'exp_owner INTEGER NOT NULL)';
			tx.executeSql(query);
		}  

		//Keep an instance of db
		this.db = db;

		// Create tables
		db.transaction(createTables, error, success);

	};

	_.extend(buddyExpenseTable, {
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

			var sql = "INSERT INTO " + BUDDYEXPENSE_TABLE + " (exp_amount, exp_date, exp_owner,exp_desc) VALUES (?, ?, ?, ?)";
			var values = [model.get('exp_amount'), model.get('exp_date'), model.get('exp_owner'), model.get('exp_desc')];
			// Set the ID of the model later, in the callback
			this.options.action = "set_id";
			this.options.model = model;
			this.options.success = success;
			this._executeSql(sql, values, _.bind(this.success,this), error);
		},

		destroy: function (model, success, error) {
			logger.log("sql destroy");
			var id = (model.id || model.attributes.id);
			this._executeSql("DELETE FROM " + BUDDYEXPENSE_TABLE + " WHERE id = ?", [id], success, error);
		},

		find: function (model, success, error) {
			logger.log("sql find");
			var id = (model.id || model.attributes.id);
			var sql = "SELECT id, exp_amount, exp_date, exp_owner, exp_desc FROM " + BUDDYEXPENSE_TABLE + " WHERE id = ?";
			this._executeSql(sql, [id], success, error);
		},

		findAll: function (model, success, error, options) {
			logger.log("sql findAll");
			var sql, values = [];
			if (options.search === undefined){
				sql = "SELECT id, exp_amount, exp_date, exp_owner, exp_desc FROM " + BUDDYEXPENSE_TABLE;
			}
			else{
				sql = "SELECT id, exp_amount, exp_date, exp_owner, exp_desc FROM " + BUDDYEXPENSE_TABLE + " WHERE exp_owner = ?";
				values = [options.search.exp_owner];
			}
			this._executeSql(sql , values, success, error);
		},

		update: function (model, success, error) {
			logger.log("sql update")
			var id = (model.id || model.attributes.id);
			var sql = "UPDATE " + BUDDYEXPENSE_TABLE + " SET exp_amount = ?, exp_date = ?, exp_owner = ?, exp_desc = ? WHERE id = ?"
			var values = [model.get('exp_amount'), model.get('exp_date'), model.get('exp_owner'), model.get('exp_desc'), id];
			this._executeSql(sql, values, success, error);
		},

		_executeSql: function (SQL, params, successCallback, errorCallback) {
			this.db.transaction(function(tx) {
			  tx.executeSql(SQL, params, successCallback, errorCallback);
			});
		}

	});		

	
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
			var query = 'CREATE TABLE IF NOT EXISTS ' + BUDDY_TABLE + '(id INTEGER NOT NULL PRIMARY KEY ASC AUTOINCREMENT,' + 'name STRING NOT NULL UNIQUE,' + 'number TEXT,' + 'total_expense REAL NOT NULL,' + 'def_currency TEXT ,' + 'email TEXT)';
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
	buddyExpenseTable.init();
	module.buddyExpenseTable = buddyExpenseTable;


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
	    case "read":  (model.id ? table.find(model, success, error) : table.findAll(model, success, error,options)); 
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

