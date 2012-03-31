( function(module, $) {

module.Buddy = Backbone.Model.extend({
	table : module.buddyTable,
	defaults: {
            name: '',
            number: '',
            total_expense: 0,
            email: ''
        }
});

module.Buddies = Backbone.Collection.extend({
    model: module.Buddy,
    table : module.buddyTable
});	

module.buddies = new module.Buddies();
// Fetch the current collection from the database
module.buddies.fetch();

}((buddyExpTrack || {}), jQuery));