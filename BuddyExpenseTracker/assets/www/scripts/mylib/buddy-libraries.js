/*global jQuery,window*/
/**
 * @author prasanna
 */

///////////////////// JQUERY PLUGINS : START //////////////////////////////////////
//
//create closure. Create JQuery plugin for text resize
//
( function($) {
	//
	// plugin definition
	//
	$.fn.textResize = function(options) {
		var opts = $.extend({}, $.fn.textResize.defaults, options);
		// iterate and reformat each matched element
		return this.each(function() {
			var $this = $(this), currFontSize = $this.css('fontSize'), finalNum = parseFloat(currFontSize, 10), stringEnding = currFontSize.slice(-2);
			if(opts.direction === '+') {
				finalNum *= opts.scale;
			} else {
				finalNum /= opts.scale;
			}
			$this.css('fontSize', finalNum + stringEnding);
		});
	};
	//
	// plugin defaults
	//
	$.fn.textResize.defaults = {
		scale : 1.2,
		direction : '+'
	};
	//
	//end of closure
	//
}(jQuery));

//
//create closure. Create JQuery plugin for clearing form
//
(function($) {
	//plugin defaults
	var defaults = {
		//Whether to clear the form
		form : true,
		//Whether to clear the non-form elements
		non_form : false,
		//Array of classes to clear, incase of non-form elements
		classes : ['.buddy_error', '.buddy_waitmsg'],
		//Label classes to be removed (to clear any label markup)
		label_classes : 'missing'
	};

	//
	// plugin definition
	//
	$.fn.clearForm = function(options) {
		var opts = $.extend({}, defaults, options), length, i;
		//Check if the form elements need to be cleared
		if(opts.form === true) {
			// iterate over each input element and clear the value
			this.find('input').each(function(index) {
				$(this).val('');
			});
		}
		//Check if the non-form elements need to be cleared
		if(opts.non_form === true) {
			length = opts.classes.length;
			for( i = 0; i < length; i = i + 1) {
				this.find(opts.classes[i]).html('');
			}
		}

		return this;
	};
	//Public function to clear the labels from any formatting
	$.fn.clearForm.clearLabels = function(labels) {
		//Clear all the labels
		if(labels === undefined) {
			window.logger.log('$.fn.clearForm.clearLabels() called with no arguments');
		} else {
			labels.each(function(index) {
				$(this).prev().removeClass("missing");
			});
		}
	};
	//
	// Allow the plugin defaults to be modified outside
	//
	$.fn.clearForm.defaults = defaults;
}(jQuery));

//
//create closure. Create JQuery plugin for showing status smessages
//
(function($) {
	//
	// plugin definition
	//
	//Map status against css classes
	var classMapping = {
		message : "buddy_msg",
		error : "buddy_error",
		wait : "buddy_msg"
	};

	$.fn.setStatus = function(options) {
		var opts = $.extend({}, $.fn.setStatus.defaults, options);
		// iterate and reformat each matched element
		return this.each(function() {
			var $this = $(this);
			//Remove all the classes
			$this.removeClass();
			switch(opts.status) {
				case 'message':
					$this.addClass(classMapping.message);
					break;

				case 'wait':
					$this.addClass(classMapping.message);
					break;

				case 'error':
					$this.addClass(classMapping.error);
					break;

				default:
					break;

			}
		});
	};
	//
	// plugin defaults
	//
	$.fn.setStatus.defaults = {
		status : 'message'
	};
	//
	//end of closure
	//
}(jQuery));

//
//create closure. Create JQuery plugin for setting selected status on list elements
//prasanna : very ugly workaround
//
(function($) {
	//
	// plugin definition
	//
	$.fn.setSelectedState = function(status) {
		// iterate and reformat each matched element
		return this.each(function() {
			var $this = $(this),
			tagName = $this.prop('tagName').toLowerCase(),
			//un select the contact by default
			sel_status;
			//No parameter, default action
			if(status === undefined) {
				sel_status = $this.data('sel-status') || false;
			} else if(status === true) {
				//The element needs to be selected now hence set the status as false
				sel_status = false;
			} else {
				sel_status = true;
			}

			if(sel_status !== true) {
				//Contact is selected
				$this.data('sel-status', true);
				//The style related stuffs depend on the element type
				switch (tagName) {
					case 'a':
						//prasanna : Imp : This is very tricky workwround. Code might break with future releases
						$this.attr('data-theme', 'b');
						$this.children().children().eq(1).attr('data-theme', 'b').removeClass('ui-btn-up-d ui-btn-hover-d').addClass('ui-btn-up-b ui-btn-hover-b');
						break;

					case 'input':
						$this.attr('data-theme', 'b').parent().attr('data-theme', 'b').removeClass('ui-btn-up-d ui-btn-hover-d').addClass('ui-btn-up-b ui-btn-hover-b');
						break;

					default:
						break;
				}
			} else {
				//Contact is de-selected
				$this.data('sel-status', false);
				//The style related stuffs depend on the element type
				switch (tagName) {
					case 'a':
						$this.attr('data-theme', 'd');
						$this.children().children().eq(1).attr('data-theme', 'd').removeClass('ui-btn-up-b ui-btn-hover-b').addClass('ui-btn-up-d ui-btn-hover-d');
						break;

					case 'input':
						$this.attr('data-theme', 'd').parent().attr('data-theme', 'd').removeClass('ui-btn-up-b ui-btn-hover-b').addClass('ui-btn-up-d ui-btn-hover-d');
						break;

					default:
						break;
				}
			}
		});
	};
	//
	// plugin defaults
	//

	//
	//end of closure
	//
}(jQuery));

//
//create closure. Create JQuery plugin for serializing form to object
//
(function($) {
	//
	// plugin definition
	//
	$.fn.serializeObject = function()
	{
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
	};

	//
	//end of closure
	//
}(jQuery));
///////////////////// JQUERY PLUGINS : END ////////////////////////////////////

///////////////////// PHONEGAP extensions : START ////////////////////////
/**
 * Returns the formatted contact string, as required by
 * @param successCB success callback
 * @param errorCB error callback
 */

window.Contact.prototype.getFormattedText = function() {
	var str = '<li><a href="#">';
	str += this.displayName + '</a><a class="buddy_select" href="#" >Select</a></li>';
	return str;
};

window.Contact.prototype.getDBObject = function() {
	var buddy = {};
	buddy.name = this.displayName;
	//check if the contact has phone number set
	if(this.phoneNumbers !== null && this.phoneNumbers.length > 0) {
		buddy.number = this.phoneNumbers[0].value;
	}
	//check if the contact has any email set
	if(this.emails !== null && this.emails.length > 0) {
		buddy.email = this.emails[0].value;
	}
	return buddy;
};
///////////////////// PHONEGAP extensions : END   ////////////////////////

///////////////////// Backbone extensions : 	  ////////////////////////
Backbone.View.prototype.close = function () {
    console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};
///////////////////// Backbone extensions : END   ////////////////////////