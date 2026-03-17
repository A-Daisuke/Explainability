function __method_wrapper__() {
yy.Select.prototype.Select = function () {
	var self = this;
	var args = [];
	if (arguments.length > 1) {
		args = Array.prototype.slice.call(arguments);
	} else if (arguments.length == 1) {
		if (Array.isArray(arguments[0])) {
			args = arguments[0];
		} else {
			args = [arguments[0]];
		}
	} else {
		throw new Error('Wrong number of arguments of Select() function');
	}

	self.columns = [];

	args.forEach(function (arg) {
		if (typeof arg == 'string') {
			self.columns.push(new yy.Column({columnid: arg}));
		} else if (typeof arg == 'function') {
			var pari = 0;
			if (self.preparams) {
				pari = self.preparams.length;
			} else {
				self.preparams = [];
			}
			self.preparams.push(arg);
			self.columns.push(new yy.Column({columnid: '*', func: arg, param: pari}));
		} else {
			// Unknown type
		}
	});

	//	console.log(self instanceof yy.Select);
	return self;
};

}
