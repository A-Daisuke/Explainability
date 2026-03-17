function __method_wrapper__() {
	zt.log = function () {
		var space = '                                          ';
		var max =
			0 +
			Math.max.apply(
				Math,
				zt.res.map(function (r) {
					return r.name.length;
				})
			);
		var head = ('Tests' + space).substr(0, max) + '  Time (ms)';
		console.log(head);
		//	console.log(head.map(function(){return '=';}).join());
		zt.res.forEach(function (r) {
			console.log((r.name + space).substr(0, max) + '  ' + ('       ' + r.time).substr(-8));
		});
		zt.res = [];
	};

}
