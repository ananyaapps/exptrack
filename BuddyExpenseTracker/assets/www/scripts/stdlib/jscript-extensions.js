//Extensions to standard javascript
///////////////////// JAVASCRIPT CORE LIBRARY : START ////////////////////////
Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
};
// Array Remove - By John Resig (MIT Licensed)
Array.method('remove', function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
});

/*
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};
*/
//beget function to create a new object from a given object
if( typeof Object.beget !== 'function') {
	Object.beget = function(o) {
		var F = function() {
		};
		F.prototype = o;
		return new F();
	};
}
///////////////////// JAVASCRIPT CORE LIBRARY : END //////////////////////////