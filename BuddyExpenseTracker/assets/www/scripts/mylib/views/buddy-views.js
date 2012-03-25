( function(module, $) {

    module.AddBuddyView = Backbone.View.extend({
        tagName:"form", 
        //since this template will render inside a div, we don't need to specify a tagname, but we do want the fieldcontain
        attributes: {"id": "AB_AddDetailsForm"},

        events : {
            "submit " : "formHandler",
            "click input[data-action='Clear']" : function (){
                //Remove any validation messages
                this.$el.find('.ketchup-custom').empty();
            }

        },

        formHandler : function (e){
            var $form,formJSON,formStatus;
            $form = this.$el;
            formJSON = $form.formParams();
            formStatus = $form.ketchup('isValid');

            if (formStatus === true){
                //form is valid, update the model
                this.model.set(formJSON);
                this.model.save();
                logger.log(this.model);

            }
            else{

            }
            return false;
        },
        
        initialize: function() {
            this.template = _.template($('#buddy-form-template').html());
        },
        
        render: function() {
             $(this.el).html(this.template(this.model.toJSON()));
             // enable validations on the form
             this.$el.ketchup({},{
                '#AB_Name' : 'minlength(3)',
                '#AB_EMail' : 'email'
             });            
             // this.$el.trigger("create");
             return this;
        },
        
        clearView : function(){
            //simulate click event on the reset button to clear the form
            this.$el.find('input[type="reset"]').click();
            //Remove any validation messages
            this.$el.find('.ketchup-custom').empty();
        },
        
        //This function can implement unbinding the view's handlers other events
        beforeClose : function(){

        }
    });

}((buddyExpTrack || {}), jQuery));    


 
