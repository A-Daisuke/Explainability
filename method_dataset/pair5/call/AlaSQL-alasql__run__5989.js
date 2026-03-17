function __method_wrapper__() {
	mocha.run = function (fn) {
		var options = mocha.options;
		mocha.globals('location');

		var query = Mocha.utils.parseQuery(global.location.search || '');
		if (query.grep) mocha.grep(query.grep);
		if (query.invert) mocha.invert();

		return Mocha.prototype.run.call(mocha, function (err) {
			// The DOM Document is not available in Web Workers.
			if (global.document) {
				Mocha.utils.highlightTags('code');
			}
			if (fn) fn(err);
		});
	};

}
