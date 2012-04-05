( function(module, $) {

    //Home screen view, to encapsulate the home screen
    module.HomeView = Backbone.View.extend({
        events : {
            "click button" : "clickHandler"
        },

        clickHandler : function (e){
            //Find out the action
            // Yes..this is a little strange way of getting the action
            var action = $(e.currentTarget).jqmData('action');
            switch (action){
                case 'AddBuddy1' :
                    $.mobile.changePage("#AddBuddy");
                break;

                case 'ExpenseList':
                    $.mobile.changePage("#ExpenseList");
                break;

                case 'AddExpense':
                    $.mobile.changePage("#AddExpense");
                break;
            }
            return false;
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
            "click input:jqmData(action='Clear')" : function (){
                //Remove any validation messages
                this.$el.find('.ketchup-custom').empty();
            }

        },

        formHandler : function (e){
            var $form,formJSON,formStatus,buddy,count;
            $form = this.$el;
            formJSON = $form.formParams();
            formStatus = $form.ketchup('isValid');

            // Check if the form is valid
            if (formStatus === true){
                // Add only one buddy
                if (!_.isNumber(formJSON.count) ){
                    //Create a buddy model
                    buddy = new module.Buddy(formJSON);
                    buddy.on('sync',this.modelSync,this);
                    buddy.save();
                }
                else{
                    _(_.range(formJSON.count)).each(function(count){
                        var model,attr={};
                        _.extend(attr,formJSON,{name : (formJSON.name + count)});
                        //Create a buddy model
                        model = new module.Buddy(attr);
                        model.on('sync',this.modelSync,this);
                        model.save();
                    },this);
                }
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
                model.off('sync',this.modelSync);
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

    module.AddExpenseView = Backbone.View.extend({
        tagName:"form", 
        
        attributes: {"method" : "post"},

        initialize: function() {
            this.template = _.template($('#buddy-add-expense').html());
        },
        
        render: function() {
            // Render the template using default attributes
             $(this.el).html(this.template(module.Expense.prototype.defaults);
             // this.$el.trigger("create");
             return this;
        },
        // Define the child view, within this view itself
        BuddySelectView : Backbone.View.extend(
            tagName : "li",

            attributes : {"data-role" : "fieldcontain"},

            initialize : function (){
                this.template = _.template('<label for="AE_Name_C">Buddy Name:</label>
                    <select name="name_s" id="AE_Name_C">
                    <% _.each(collection.pluck(\'name\'), function (buddy_name){ %>
                    <option value="<%= buddy_name %>"><%= buddy_name %></option>
                    <% }); %>
                </select>');
            },

          render: function() {
                    // Render the template using default attributes
                     $(this.el).html(module.buddies);
                     // this.$el.trigger("create");
                     return this;
                }
        )


    });

    module.ExpenseListView = Backbone.View.extend({
        // todo : somehow this dependency on data should be removed
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

            _.each(this.collection.models, function (buddy) {
                    // prasanna : todo : imp : should the child views be destroyed also, during this view close 
                    var view;
                    view = new module.expenseView({"model":buddy});
                    this.$list.append(view.render().el);
                }, this);
            
            return this;
        },
        
        // A new buddy is added, hence collection needs to be updated
        addBuddy : function(buddy,buddies,options){
            var view;
            view = new module.expenseView({"model":buddy});
            this.$list.append(view.render().$el);
            this.trigger("list-refresh");

        },

        userInput : function (e){
            var action,delModels;
            action = $(e.target).jqmData('action');
            switch(action){
                case 'SelectAll':
                    this.collection.each(function(buddy){
                        buddy.set('sel_status',true);
                    });
                break;

                case 'Deselect':
                    this.collection.each(function(buddy){
                            buddy.set('sel_status',false);
                        });
                break;                

                case 'Delete':
                    // models to be deleted
                    delModels = this.collection.where({sel_status : true});
                    if (confirm("Sure to delete " + delModels.length + " entries?")){
                        // Destroy the selected models
                        _.each(delModels,function(buddy){
                            buddy.destroy();                            
                        });
                    }
                break;

                default:
                break;
            }
        },

        // This event handler is called after list-refresh event 
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
                // toggle the selected state
                var sel_status = this.model.get('sel_status');
                this.model.set('sel_status',!sel_status);
                return false;
            }
        },

        initialize : function(){
            this.template = _.template($('#buddy-expense-template').html());
            this.model.on("change",this.modelChange,this);
            // Model is destroyed, delete the view
            this.model.on("destroy",function(){
                this.close();
            },this);

        },

        render : function(){
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

        modelChange : function(model,options){
            // Check what has changed
            if (options.changes.sel_status === true){
                $button = this.$el.find('button');
                if (model.get('sel_status') === true){
                    $button.attr('data-theme','b').parent().attr('data-theme','b').
                        removeClass('ui-btn-up-d ui-btn-hover-d').addClass('ui-btn-up-b ui-btn-hover-b');
                }
                else{
                     $button.attr('data-theme','d').parent().attr('data-theme','d').
                            removeClass('ui-btn-up-b ui-btn-hover-b').addClass('ui-btn-up-d ui-btn-hover-d');                
                }
            }
        },
        //This function can implement unbinding the view's handlers other events
        beforeClose : function(){
            this.model.off("change",this.modelChange);
            this.model.off("destroy");
        }        

    });

}((buddyExpTrack || {}), jQuery));    


 

