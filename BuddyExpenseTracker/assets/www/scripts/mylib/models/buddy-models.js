( function(module, $) {

module.Buddy = Backbone.Model.extend({
	defaults: {
            name: '',
            number: '',
            total_expense: '',
            email: ''
        }
});

module.Buddies = Backbone.Collection.extend({
    model: module.Buddy,
});	

}((buddyExpTrack || {}), jQuery));