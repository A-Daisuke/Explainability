function __method_wrapper__() {
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

}
