function __method_wrapper__() {
alasql.test = function (name, times, fn) {
	if (arguments.length === 0) {
		alasql.log(alasql.con.results);
		return;
	}

	var tm = Date.now();

	if (arguments.length === 1) {
		fn();
		alasql.con.log(Date.now() - tm);
		return;
	}

	if (arguments.length === 2) {
		fn = times;
		times = 1;
	}

	for (var i = 0; i < times; i++) {
		fn();
	}
	alasql.con.results[name] = Date.now() - tm;
};

}
