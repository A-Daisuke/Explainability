function __method_wrapper__() {
yy.Select.prototype.GroupBy = function () {
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

	self.group = [];

	args.forEach(function (arg) {
		var expr = new yy.Column({columnid: arg});
		self.group.push(expr);
	});

	return self;
};

}
