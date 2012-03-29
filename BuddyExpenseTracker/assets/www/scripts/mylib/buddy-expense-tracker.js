var buddyExpTrack = {};
//Controller sub-module
( function(module, $) {

	$(document).ready(function() {
	if( typeof (PhoneGap) !== 'undefined') {
		$('body > *').css({
			minHeight : '100% !important',
			minWidth : '100% !important'
		});
	}
	
	logger.log("In document ready");
	// $('body').load('scripts/views/templates.html',function (text){
	// 	logger.log(text);
	// })
	});

$(document).bind("mobileinit", function() {
	//buddyExpTrack.buddyController.init();
	// Disable the page transitions, as they dont work properly in Android
	// todo : Disable only for android based devices
	logger.log("In mobileinit");
	initAppRouter();
	//Initialise database related part
	module.buddy_db.init();
	$.mobile.defaultPageTransition = 'none';
	$.mobile.page.prototype.options.addBackBtn = true;
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	$.mobile.useFastClick = false;
	});	

//Initialise the router
function initAppRouter()
{
		// bc  => pagebeforecreate
  //       c   => pagecreate
  //       i   => pageinit
  //       bs  => pagebeforeshow
  //       s   => pageshow
  //       bh  => pagebeforehide
  //       h   => pagehide
  //       rm  => pageremove
		//Initialise router
		module.router = new $.mobile.Router({
		"(?:index.html$|#HomeScreen)": {handler: "firstPage", events: "i,bs,s,h"},
		"#AddBuddy$": {handler: "addBuddyPage", events: "i,c,h,bs,rm"},
		"#AddBuddyPick$": {handler: "addBuddyPickPage", events: "i,h"},
		"#EditBuddies$": {handler: "editBuddiesPage", events: "i,h,s"},
		},
		{
			firstPage: function(type,match,ui){
				logger.log("firstPage: "+type+" "+match[0]);
			},
			
			//Function to handle transitions to & from addBuddyPage
			addBuddyPage: function(type,match,ui,page){
				logger.log("addBuddyPage: "+type+" "+match[0]);
				if (!arguments.callee.store)
				{
					arguments.callee.store = {};
				}
				var buddy,addBuddyView;
				switch(type){
					//markup is not applied by jquery-mobile at pagecreate event
					case 'pagecreate':
						// case 'pageinit':
						//Create an empty buddy model
						buddy = new module.Buddy();
						//Create a view
						var $container = $(page).find('#AB_content');
						addBuddyView = new module.AddBuddyView({model: buddy});
						arguments.callee.store.buddy = buddy;
						arguments.callee.store.addBuddyView = addBuddyView;
						$container.append(addBuddyView.render().$el);
						addBuddyView.$el.trigger("create");
					break;

					case 'pagehide':
						//retirve the reference to view
						addBuddyView = arguments.callee.store.addBuddyView;
						//Call a function to soft clear the view 
						addBuddyView.clearView();
					break;

					case 'pageremove' :
						arguments.callee.store.addBuddyView.close();
						delete arguments.callee.store;
					break;

					case 'pagebeforeshow' :
					break;

					default:
					break;
				}
			},

			//Function to handle transitions to & from addBuddyPickPage
			addBuddyPickPage: function(type,match,ui,page){
				logger.log("addBuddyPickPage: "+type+" "+match[0]);
				switch(type){
					case 'pageinit':
						module.AddBuddyPickObj.init($('#AddBuddyPick'));
					break;

					case 'pagehide':
						module.AddBuddyPickObj.pagehide();
					break;

					default:
					break;
				}
			},
			editBuddiesPage : function(type,match,ui){
				logger.log("editBuddiesPage: "+type+" "+match[0]);
				switch(type){
					case 'pageinit':
						module.EditBuddyObj.init($('#EditBuddies'));
					break;

					case 'pagehide':
						module.EditBuddyObj.pagehide();
					break;

					case 'pageshow':
						module.EditBuddyObj.pageshow();
					break;					

					default:
					break;
				}
			},
			//Useful for automatically closing the views properly avoiding any memory leakage
			showView:function (selector, view) {
			        if (this.currentView)
			            this.currentView.close();
			        $(selector).html(view.render().el);
			        this.currentView = view;
			        return view;
			    },			
		},
		{ 
			defaultHandler: function(type, ui, page) {
				logger.log("Default handler called due to unknown route (" 
					+ type + ", " + ui + ", " + page + ")");
		},
		// defaultHandlerEvents: "s",
		ajaxApp : true,
		firstMatchOnly : true
	});
}

}((buddyExpTrack || {}), jQuery));

