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

//todo : prasanna : this plugin may not be required
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


/*
  jQuery Ketchup Plugin - Tasty Form Validation
  ---------------------------------------------
  
  Version 0.3.1 - 12. Jan 2011
  
  Copyright (c) 2011 by Sebastian Senf:
    http://mustardamus.com/
    http://usejquery.com/
    http://twitter.com/mustardamus

  Dual licensed under the MIT and GPL licenses:
    http://www.opensource.org/licenses/mit-license.php
    http://www.gnu.org/licenses/gpl.html

  Demo: http://demos.usejquery.com/ketchup-plugin/
  Repo: http://github.com/mustardamus/ketchup-plugin
*/

(function(g){g.ketchup={defaults:{attribute:"data-validate",validateIndicator:"validate",eventIndicator:"on",validateEvents:"blur",validateElements:["input","textarea","select"],createErrorContainer:null,showErrorContainer:null,hideErrorContainer:null,addErrorMessages:null},dataNames:{validationString:"ketchup-validation-string",validations:"ketchup-validations",events:"ketchup-events",elements:"ketchup-validation-elements",container:"ketchup-container"},validations:{},helpers:{},validation:function(b,
c,d,h){var j;if(typeof c=="function")c=c;else{j=c;c=d}this.validations[b]={message:j,func:c,init:h||function(){}};return this},message:function(b,c){this.addMessage(b,c);return this},messages:function(b){for(name in b)this.addMessage(name,b[name]);return this},addMessage:function(b,c){if(this.validations[b])this.validations[b].message=c},helper:function(b,c){this.helpers[b]=c;return this},init:function(b,c,d){this.options=c;var h=this;c=this.initFunctions().initFields(b,d);c.each(function(){var j=
g(this);h.bindValidationEvent(b,j).callInitFunctions(b,j)});b.data(this.dataNames.elements,c);this.bindFormSubmit(b)},initFunctions:function(){var b=this.options,c=["createErrorContainer","showErrorContainer","hideErrorContainer","addErrorMessages"];for(f=0;f<c.length;f++){var d=c[f];b[d]||(b[d]=this[d])}return this},initFields:function(b,c){var d=this,h=this.dataNames,j=g(!c?this.fieldsFromForm(b):this.fieldsFromObject(b,c));j.each(function(){var l=g(this),m=d.extractValidations(l.data(h.validationString),
d.options.validateIndicator);l.data(h.validations,m)});return j},callInitFunctions:function(b,c){var d=c.data(this.dataNames.validations);for(i=0;i<d.length;i++)d[i].init.apply(this.helpers,[b,c])},fieldsFromForm:function(b){var c=this,d=this.options,h=this.dataNames,j=d.validateElements,l=[];j=typeof j=="string"?[j]:j;for(i=0;i<j.length;i++){var m=b.find(j[i]+"["+d.attribute+"*="+d.validateIndicator+"]");m.each(function(){var k=g(this),p=k.attr(d.attribute),q=c.extractEvents(p,d.eventIndicator);
k.data(h.validationString,p).data(h.events,q?q:d.validateEvents)});l.push(m.get())}return this.normalizeArray(l)},fieldsFromObject:function(b,c){var d=this.options,h=this.dataNames,j=[];for(s in c){var l,m;if(typeof c[s]=="string"){l=c[s];m=d.validateEvents}else{l=c[s][0];m=c[s][1]}var k=b.find(s);l=this.mergeValidationString(k,l);m=this.mergeEventsString(k,m);k.data(h.validationString,d.validateIndicator+"("+l+")").data(h.events,m);j.push(k.get())}return this.normalizeArray(j)},mergeEventsString:function(b,
c){var d=b.data(this.dataNames.events),h="";if(d){d=d.split(" ");for(i=0;i<d.length;i++)if(c.indexOf(d[i])==-1)h+=" "+d[i]}return g.trim(c+h)},mergeValidationString:function(b,c){var d=this.options,h=b.data(this.dataNames.validationString),j=function(k){var p=k.name;if(k.arguments.length)p=p+"("+k.arguments.join(",")+")";return p},l=function(k,p){for(i=0;i<k.length;i++)if(k[i].name==p.name)return true};if(h){var m=this.extractValidations(d.validateIndicator+"("+c+")",d.validateIndicator);d=this.extractValidations(h,
d.validateIndicator);c="";for(o=0;o<d.length;o++)c+=j(d[o])+",";for(n=0;n<m.length;n++)l(d,m[n])||(c+=j(m[n])+",")}return c},bindFormSubmit:function(b){var c=this;b.submit(function(){return c.allFieldsValid(b,true)})},allFieldsValid:function(b,c){var d=this,h=true;b.data(this.dataNames.elements).each(function(){var j=g(this);if(d.validateElement(j,b)!=true){c==true&&d.triggerValidationEvents(j);h=false}});b.trigger("formIs"+(h?"Valid":"Invalid"),[b]);return h},bindValidationEvent:function(b,c){var d=
this,h=this.options,j=this.dataNames,l=c.data(j.events).split(" ");for(i=0;i<l.length;i++){c.bind("ketchup."+l[i],function(){var m=d.validateElement(c,b),k=c.data(j.container);if(m!=true){if(!k){k=h.createErrorContainer(b,c);c.data(j.container,k)}h.addErrorMessages(b,c,k,m);h.showErrorContainer(b,c,k)}else k&&h.hideErrorContainer(b,c,k)});this.bindValidationEventBridge(c,l[i])}return this},bindValidationEventBridge:function(b,c){b.bind(c,function(){b.trigger("ketchup."+c)})},validateElement:function(b,
c){var d=[],h=b.data(this.dataNames.validations),j=[c,b,b.val()];for(i=0;i<h.length;i++)h[i].func.apply(this.helpers,j.concat(h[i].arguments))||d.push(h[i].message);c.trigger("fieldIs"+(d.length?"Invalid":"Valid"),[c,b]);return d.length?d:true},elementIsValid:function(b){var c=this.dataNames;if(b.data(c.validations)){c=b.parentsUntil("form").last().parent();return this.validateElement(b,c)==true?true:false}else if(b.data(c.elements))return this.allFieldsValid(b);return null},triggerValidationEvents:function(b){for(var c=
b.data(this.dataNames.events).split(" "),d=0;d<c.length;d++)b.trigger("ketchup."+c[d])},extractValidations:function(b,c){for(var d=b.substr(b.indexOf(c)+c.length+1),h="",j=[],l=0,m=[],k=0;k<d.length;k++)switch(d.charAt(k)){case "(":h+="(";l++;break;case ")":if(l){h+=")";l--}else j.push(g.trim(h));break;case ",":if(l)h+=",";else{j.push(g.trim(h));h=""}break;default:h+=d.charAt(k)}for(v=0;v<j.length;v++){l=j[v].indexOf("(");d=j[v];h=[];if(l!=-1){d=g.trim(j[v].substr(0,l));h=g.map(j[v].substr(d.length).split(","),
function(p){return g.trim(p.replace("(","").replace(")",""))})}if((l=this.validations[d])&&l.message){k=l.message;for(a=1;a<=h.length;a++)k=k.replace("{arg"+a+"}",h[a-1]);m.push({name:d,arguments:h,func:l.func,message:k,init:l.init})}}return m},extractEvents:function(b,c){var d=false,h=b.indexOf(c+"(");if(h!=-1)d=b.substr(h+c.length+1).split(")")[0];return d},normalizeArray:function(b){var c=[];for(i=0;i<b.length;i++)for(e=0;e<b[i].length;e++)b[i][e]&&c.push(b[i][e]);return c},createErrorContainer:function(b,
c){if(typeof b=="function"){this.defaults.createErrorContainer=b;return this}else{var d=c.offset();return g("<div/>",{html:"<ul></ul><span></span>","class":"ketchup-error",css:{top:d.top,left:d.left+c.outerWidth()-20}}).appendTo("body")}},showErrorContainer:function(b,c,d){if(typeof b=="function"){this.defaults.showErrorContainer=b;return this}else d.show().animate({top:c.offset().top-d.height(),opacity:1},"fast")},hideErrorContainer:function(b,c,d){if(typeof b=="function"){this.defaults.hideErrorContainer=
b;return this}else d.animate({top:c.offset().top,opacity:0},"fast",function(){d.hide()})},addErrorMessages:function(b,c,d,h){if(typeof b=="function"){this.defaults.addErrorMessages=b;return this}else{b=d.children("ul");b.html("");for(i=0;i<h.length;i++)g("<li/>",{text:h[i]}).appendTo(b)}}};g.fn.ketchup=function(b,c){var d=g(this);if(typeof b=="string")switch(b){case "validate":g.ketchup.triggerValidationEvents(d);break;case "isValid":return g.ketchup.elementIsValid(d)}else this.each(function(){g.ketchup.init(d,
g.extend({},g.ketchup.defaults,b),c)});return this}})(jQuery);
jQuery.ketchup.validation("required","This field is required.",function(g,b,c){g=b.attr("type").toLowerCase();return g=="checkbox"||g=="radio"?b.attr("checked")==true:c.length!=0}).validation("minlength","This field must have a minimal length of {arg1}.",function(g,b,c,d){return c.length>=+d}).validation("maxlength","This field must have a maximal length of {arg1}.",function(g,b,c,d){return c.length<=+d}).validation("rangelength","This field must have a length between {arg1} and {arg2}.",function(g,
b,c,d,h){return c.length>=d&&c.length<=h}).validation("min","Must be at least {arg1}.",function(g,b,c,d){return this.isNumber(c)&&+c>=+d}).validation("max","Can not be greater than {arg1}.",function(g,b,c,d){return this.isNumber(c)&&+c<=+d}).validation("range","Must be between {arg1} and {arg2}.",function(g,b,c,d,h){return this.isNumber(c)&&+c>=+d&&+c<=+h}).validation("number","Must be a number.",function(g,b,c){return this.isNumber(c)}).validation("digits","Must be digits.",function(g,b,c){return/^\d+$/.test(c)}).validation("email",
"Must be a valid E-Mail.",function(g,b,c){return this.isEmail(c)}).validation("url","Must be a valid URL.",function(g,b,c){return this.isUrl(c)}).validation("username","Must be a valid username.",function(g,b,c){return this.isUsername(c)}).validation("match","Must be {arg1}.",function(g,b,c,d){return b.val()==d}).validation("contain","Must contain {arg1}",function(g,b,c,d){return this.contains(c,d)}).validation("date","Must be a valid date.",function(g,b,c){return this.isDate(c)}).validation("minselect",
"Select at least {arg1} checkboxes.",function(g,b,c,d){return d<=this.inputsWithName(g,b).filter(":checked").length},function(g,b){this.bindBrothers(g,b)}).validation("maxselect","Select not more than {arg1} checkboxes.",function(g,b,c,d){return d>=this.inputsWithName(g,b).filter(":checked").length},function(g,b){this.bindBrothers(g,b)}).validation("rangeselect","Select between {arg1} and {arg2} checkboxes.",function(g,b,c,d,h){g=this.inputsWithName(g,b).filter(":checked").length;return d<=g&&h>=
g},function(g,b){this.bindBrothers(g,b)});
jQuery.ketchup.helper("isNumber",function(g){return/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(g)}).helper("contains",function(g,b){return g.indexOf(b)!=-1}).helper("isEmail",function(g){return/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(g)}).helper("isUrl",function(g){return/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(g)}).helper("isUsername",
function(g){return/^([a-zA-Z])[a-zA-Z_-]*[\w_-]*[\S]$|^([a-zA-Z])[0-9_-]*[\S]$|^[a-zA-Z]*[\S]$/.test(g)}).helper("isDate",function(g){return!/Invalid|NaN/.test(new Date(g))}).helper("inputsWithName",function(g,b){return $('input[name="'+b.attr("name")+'"]',g)}).helper("inputsWithNameNotSelf",function(g,b){return this.inputsWithName(g,b).filter(function(){return $(this).index()!=b.index()})}).helper("getKetchupEvents",function(g){g=g.data("events").ketchup;var b=[];for(i=0;i<g.length;i++)b.push(g[i].namespace);
return b.join(" ")}).helper("bindBrothers",function(g,b){this.inputsWithNameNotSelf(g,b).bind(this.getKetchupEvents(b),function(){b.ketchup("validate")})});

$.ketchup

.createErrorContainer(function(form, el) {
  return $('<ul/>', {
           'class': 'ketchup-custom'
         }).insertAfter(el);
})

.addErrorMessages(function(form, el, container, messages) {
  container.html('');

  for(i = 0; i < messages.length; i++) {
    $('<li/>', {
      text: messages[i]
    }).appendTo(container);
  }
})

.showErrorContainer(function(form, el, container) {
  container.show();
  //container.slideDown('fast');
})

.hideErrorContainer(function(form, el, container) {
  container.hide();
  //container.slideUp('fast');
});

$('#custom-behavior').ketchup({
  validateEvents: 'blur focus keyup'
});

//override the default email validation function
$.ketchup.validation('email', 'Must be a valid e-mail', function(form, el, value) {
  if(value === null || $.trim(value).length === 0){
  	return true;
  }
  else{
  	return this.isEmail(value);
  }

});

$('#own-validation').ketchup();



///////////////////// JQUERY FORM-PARAMS PLUGIN : START ////////////////////////////////////
(function( $ ) {
	var radioCheck = /radio|checkbox/i,
		keyBreaker = /[^\[\]]+/g,
		numberMatcher = /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/;

	var isNumber = function( value ) {
		if ( typeof value == 'number' ) {
			return true;
		}

		if ( typeof value != 'string' ) {
			return false;
		}

		return value.match(numberMatcher);
	};

	$.fn.extend({
		/**
		 * @parent dom
		 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/form_params/form_params.js
		 * @plugin jquery/dom/form_params
		 * @test jquery/dom/form_params/qunit.html
		 * <p>Returns an object of name-value pairs that represents values in a form.  
		 * It is able to nest values whose element's name has square brackets. </p>
		 * Example html:
		 * @codestart html
		 * &lt;form>
		 *   &lt;input name="foo[bar]" value='2'/>
		 *   &lt;input name="foo[ced]" value='4'/>
		 * &lt;form/>
		 * @codeend
		 * Example code:
		 * @codestart
		 * $('form').formParams() //-> { foo:{bar:2, ced: 4} }
		 * @codeend
		 * 
		 * @demo jquery/dom/form_params/form_params.html
		 * 
		 * @param {Boolean} [convert] True if strings that look like numbers and booleans should be converted.  Defaults to true.
		 * @return {Object} An object of name-value pairs.
		 */
		formParams: function( convert ) {
			if ( this[0].nodeName.toLowerCase() == 'form' && this[0].elements ) {

				return jQuery(jQuery.makeArray(this[0].elements)).getParams(convert);
			}
			return jQuery("input[name], textarea[name], select[name]", this[0]).getParams(convert);
		},
		getParams: function( convert ) {
			var data = {},
				current;

			convert = convert === undefined ? true : convert;

			this.each(function() {
				var el = this,
					type = el.type && el.type.toLowerCase();
				//if we are submit, ignore
				if ((type == 'submit') || !el.name ) {
					return;
				}

				var key = el.name,
					value = $.data(el, "value") || $.fn.val.call([el]),
					isRadioCheck = radioCheck.test(el.type),
					parts = key.match(keyBreaker),
					write = !isRadioCheck || !! el.checked,
					//make an array of values
					lastPart;

				if ( convert ) {
					if ( isNumber(value) ) {
						value = parseFloat(value);
					} else if ( value === 'true' || value === 'false' ) {
						value = Boolean(value);
					}

				}

				// go through and create nested objects
				current = data;
				for ( var i = 0; i < parts.length - 1; i++ ) {
					if (!current[parts[i]] ) {
						current[parts[i]] = {};
					}
					current = current[parts[i]];
				}
				lastPart = parts[parts.length - 1];

				//now we are on the last part, set the value
				if ( lastPart in current && type === "checkbox" ) {
					if (!$.isArray(current[lastPart]) ) {
						current[lastPart] = current[lastPart] === undefined ? [] : [current[lastPart]];
					}
					if ( write ) {
						current[lastPart].push(value);
					}
				} else if ( write || !current[lastPart] ) {
					current[lastPart] = write ? value : undefined;
				}

			});
			return data;
		}
	});

})(jQuery)
///////////////////// JQUERY FORM-PARAMS PLUGIN : END ////////////////////////////////////
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