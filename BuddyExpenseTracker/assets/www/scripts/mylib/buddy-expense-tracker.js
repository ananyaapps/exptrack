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
		// Create a homescreen view, pass the existing HomeScreen itself as the view's root
		new module.HomeView({el:$(document).find('#HomeScreenButtons')});
	});

$(document).bind("mobileinit", function() {
	//buddyExpTrack.buddyController.init();
	// Disable the page transitions, as they dont work properly in Android
	// todo : Disable only for android based devices
	logger.log("In mobileinit");
	initAppRouter();
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
		"(?:index.html$|#HomeScreen)": {handler: "homePage", events: "i,rm"},
		"#AddBuddy(?:[?/](.*))?": {handler: "addBuddyPage", events: "i,c,h,bs,rm"},
		// "#AddBuddy$": {handler: "addBuddyPage", events: "i,c,h,bs,rm"},
		"#AddBuddyPick$": {handler: "addBuddyPickPage", events: "i,h"},
		"#ExpenseList$": {handler: "expenseListPage", events: "c,bs,h,rm"},
		"#AddExpense$": {handler: "addExpensePage", events: "c,bs,h,rm"},
		},
		{
			homePage: function(type,match,ui,page){
				logger.log("homePage: "+type+" "+match[0]);
				switch(type){
					case 'pagecreate':

					break;
				}
			},

			addExpensePage : function(type,match,ui,page){
				var store,addExpenseView;
				// logger.log(match[1]);
				if (!arguments.callee.store)
				{
					arguments.callee.store = {};
				}
				store = arguments.callee.store;

				switch(type){
					case 'pagecreate':
						addExpenseView = new module.AddExpenseView();
						store.addExpenseView = addExpenseView;
						var $container = $(page).find('#AE_content');
						$container.append(addExpenseView.render().el);
						
					break;

					default:
					break;

				}

			},
			
			//Function to handle transitions to & from addBuddyPage
			addBuddyPage: function(type,match,ui,page){
				var store;
				// logger.log(match[1]);
				if (!arguments.callee.store)
				{
					arguments.callee.store = {};
				}
				store = arguments.callee.store;
				var buddy,addBuddyView;
				switch(type){
					//markup is not applied by jquery-mobile at pagecreate event
					case 'pagecreate':
						// case 'pageinit':
						//Create a view
						var $container = $(page).find('#AB_content');
						addBuddyView = new module.AddBuddyView({collection : module.buddies});
						store.addBuddyView = addBuddyView;
						$container.append(addBuddyView.render().el);
					break;

					case 'pagebeforeshow' :

						store.addBuddyView.pagebeforeshow();

					break;

					case 'pagehide':
						//Call a function to soft clear the view 
						addBuddyView = store.addBuddyView.pagehide();
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
			expenseListPage : function(type,match,ui,page){
				var store,view,$header;
				// logger.log(match[1]);
				if (!arguments.callee.store)
				{
					arguments.callee.store = {};
				}
				store = arguments.callee.store;
				
				switch(type){
					case 'pagecreate':
						$footer = $(page).find("div[data-role='footer']");
						// footer would be accessbile within the View
						view = new module.ExpenseListView({"$footer" : $footer,"collection" : module.buddies});
						store.view = view;
						$(page).append(view.render().el);
					break;

					case 'pagehide':
					break;

					case 'pagebeforeshow':
					break;					

					case 'pageremove':
						store.view.close();
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

