( function(module, $) {

module.Buddy = Backbone.Model.extend({
	table : module.buddyTable,
	defaults: {
            name: '',
            number: '',
            total_expense: 0,
			// sel_status -> tells if the buddy is selected for editing
            sel_status : false,
            email: ''
        }
});

module.Buddies = Backbone.Collection.extend({
    model: module.Buddy,
    table : module.buddyTable
});	

module.Expense = Backbone.Model.extend({
    table : module.buddyExpenseTable,
    
    defaults : {
        exp_amount : '',
        exp_date : new Date(),
        exp_desc : ''
    }
});

module.Expenses = Backbone.Collection.extend({
    model : module.Expense,
    table : module.buddyTable
});

module.buddies = new module.Buddies();
// Fetch the current collection from the database
module.buddies.fetch();

}((buddyExpTrack || {}), jQuery));