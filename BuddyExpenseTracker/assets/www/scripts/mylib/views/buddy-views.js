( function(module, $) {

    //Home screen view, to encapsulate the home screen
    module.HomeView = Backbone.View.extend({
        events : {
            "click a" : "clickHandler"
        },

        clickHandler : function (e){
            //Find out the action
            // Yes..this is a little strange way of getting the action
            var action = $(e.currentTarget).attr('data-action');
            switch (action){
                case 'AddBuddy1' :
                    $.mobile.showPageLoadingMsg();
                break;
            }

            logger.log(action);
        },

        initialize : function (){
            //empty function as of now
        }

    });

    module.AddBuddyView = Backbone.View.extend({
        tagName:"form", 
        //since this template will render inside a div, we don't need to specify a tagname, but we do want the fieldcontain
        attributes: {"id": "AB_AddDetailsForm","method" : "post"},

        events : {
            "submit " : "formHandler",
            "click input[data-action='Clear']" : function (){
                //Remove any validation messages
                this.$el.find('.ketchup-custom').empty();
            }

        },

        formHandler : function (e){
            var $form,formJSON,formStatus,buddy;
            $form = this.$el;
            formJSON = $form.formParams();
            formStatus = $form.ketchup('isValid');

            // Check if the form is valid
            if (formStatus === true){
                //Create a buddy model
                buddy = new module.Buddy(formJSON);
                buddy.on('sync',this.modelSync,this);
                buddy.save();
            }
            else{

            }
            return false;
        },
        
        initialize: function() {
            // todo : idea : use the fully finished form as a template
            this.template = _.template($('#buddy-form-template').html());
        },
        
        render: function() {
             $(this.el).html(this.template(module.Buddy.prototype.defaults));
             // enable validations on the form
             this.$el.ketchup({},{
                '#AB_Name' : 'minlength(3)',
                '#AB_EMail' : 'email'
             });
             // this.$el.trigger("create");
             return this;
        },

        // Sync event handler, called after the model is saved / save failed to database
        // In case of error, the error argument will be set to SQLError
        modelSync : function(model,error){
            if (model.isNew()){
                //Check if the object is still new ie some problem during save
                $().toastmessage('showToast', {
                    text     : 'Adding failed : name already exists',
                    sticky   : false,
                    type     : 'error'
                }); 
            }
            else{
                $().toastmessage('showToast', {
                    text     : 'Successfully added buddy.You can add more buddies',
                    sticky   : false,
                    type     : 'success'
                }); 
                // add model to collection
                this.collection.add(model);
                // unbind the event handlers
                model.on('sync',this.modelSync);
            }
            // Clear the form 
            this.pagehide();
        },
        
        //Function called before the page is shown
        pagebeforeshow : function(){
            //Bind to model's events
            // this.model.on("all",this.eventHandlerTest,this);
        },
        // Function called while the view is hidden
        pagehide : function(){
            //simulate click event on the reset button to clear the form
            this.$el.find('input[type="reset"]').click();
            //Remove any validation messages
            this.$el.find('.ketchup-custom').empty();
        },
        
        //This function can implement unbinding the view's handlers other events
        beforeClose : function(){

        }
    });

    module.ExpenseListView = Backbone.View.extend({
        attributes: {"data-role": "content"},

        initialize : function(){
            this.template = _.template($('#buddy-expenselist-template').html());
            // Listen to add event on the collection
            this.collection.on("add",this.addBuddy, this);
            // Listen to this view's refresh event
            this.on("list-refresh",this.listviewRefresh,this);
            // IMP : Noe that we are attaching to jquery's event handlers
            // hence bind the callback to the view, instead of the jQuery's default this
            this.options.$footer.on("click", "input", _.bind(this.userInput,this));
        },
        render : function(){
            $(this.el).html(this.template());
            this.$list = this.$el.find('ul');
            // Maintain a list of child views
            this.buddyViews = [];

            _.each(this.collection.models, function (buddy) {
                    var view;
                    view = new module.expenseView({"model":buddy});
                    this.buddyViews.push(view);
                    this.$list.append(view.render().el);
                }, this);
            
            return this;
        },
        
        // A new buddy is added, hence collection needs to be updated
        addBuddy : function(buddy,buddies,options){
            var view;
            view = new module.expenseView({"model":buddy});
            this.buddyViews.push(view);
            this.$list.append(view.render().$el);
            this.trigger("list-refresh");

        },

        userInput : function (e){
            var action;
            action = $(e.target).jqmData('action');
        },

        listviewRefresh : function (options){
            //somehow these two functions are required to correctly render the listview, after adding a buddy
            this.$list.listview('refresh');
            this.$list.trigger("create");
        },
        //This function can implement unbinding the view's handlers other events
        beforeClose : function(){
            this.collection.off("add",this.addBuddy);
        }        

    });

    // Individual item view
    module.expenseView = Backbone.View.extend({
        tagName : 'li',

        events : {
            "click button" : function(){
                this.setSelState();
            }
        },

        initialize : function(){
            this.template = _.template($('#buddy-expense-template').html());
            // item is not selected by default
            this.selState = false;
        },

        render : function(){
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

        // Set the selected state. If no arguments are passed then invert the state
        setSelState : function(state){
            // Toggle the selected state, by default.If state param is undefined, then this would be the default action
            var toggle = true,$button;

            if (state === true){
                //Dont toggle the state, if this is already selected
                if (this.selState === true){
                    toggle = false;
                }
            }
            else if(state === false){
                //Dont toggle the state, if this is currently not  selected
                if (this.selState === false){
                    toggle = false;
                }
            }
            else{

            }

            // check if the state needs to be toggled
            // todo : optimise : very ugly workaround
            if (toggle === true){
                // toggle the selected state
                this.selState = !this.selState;
                $button = this.$el.find('button');
                if (this.selState === true){
                    $button.attr('data-theme', 'b').parent().attr('data-theme', 'b').
                        removeClass('ui-btn-up-d ui-btn-hover-d').addClass('ui-btn-up-b ui-btn-hover-b');
                }
                else{
                     $button.attr('data-theme', 'd').parent().attr('data-theme', 'd').
                            removeClass('ui-btn-up-b ui-btn-hover-b').addClass('ui-btn-up-d ui-btn-hover-d');
                }
            }

        },
        //This function can implement unbinding the view's handlers other events
        beforeClose : function(){

        }        

    });

}((buddyExpTrack || {}), jQuery));    


 

