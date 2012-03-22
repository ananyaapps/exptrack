( function(module, $) {

    module.AddBuddyView = Backbone.View.extend({
        tagName:"form", 
        //since this template will render inside a div, we don't need to specify a tagname, but we do want the fieldcontain
        attributes: {"id": "AB_AddDetailsForm"},

        events : {
            // "submit " : "formHandler",

        },

        formHandler : function (e){
            //DOM element that triggered the event
            logger.log("form submission");
            e.stopPropagation();
            return false;
        },
        
        initialize: function() {
            this.template = _.template($('#buddy-form-template').html());
        },
        
        render: function() {
             $(this.el).html(this.template(this.model.toJSON()));
             // enable validations on the form
             // this.$el.ketchup({},{
             //    '#AB_Name' : 'minlength(3)',
             //    '#AB_EMail' : 'email'
             // });
             //this.$el.trigger('create');
             return this;
        },
        clearView : function(){
            logger.log("Clear view function");
            //simulate click event on the reset button to clear the form
            this.$el.find('input[type="reset"]').click();
            //Remove any validation messages
            this.$el.find('.ketchup-custom').remove();
        },
        //This function can implement unbinding the view's handlers other events
        beforeClose : function(){

        }
    });

}((buddyExpTrack || {}), jQuery));    


 
