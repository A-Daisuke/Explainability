function __method_wrapper__() {
yy.Select.prototype.OrderBy = function () {
	var self = this;
	var args = [];

	self.order = [];

	if (arguments.length == 0) {
		//		self.order.push(new yy.OrderExpression({expression: new yy.Column({columnid:"_"}), direction:'ASC'}));
		args = ['_'];
	} else if (arguments.length > 1) {
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

	if (args.length > 0) {
		args.forEach(function (arg) {
			var expr = new yy.Column({columnid: arg});
			if (typeof arg == 'function') {
				expr = arg;
			}
			self.order.push(new yy.OrderExpression({expression: expr, direction: 'ASC'}));
		});
	}
	return self;
};

}
