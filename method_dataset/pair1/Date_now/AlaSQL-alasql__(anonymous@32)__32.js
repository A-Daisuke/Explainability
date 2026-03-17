class __C__ {
	it('3. Calculate PI with streaming function', function (done) {
		var n = 10000;

		var rndfn = function (i) {
			if (i >= n) return; // EOF
			return {x: Math.random(), y: Math.random()};
		};
		rndfn.dontcache = true;

		//		rndfn.length = 100;

		//		alasql.stdlib.SQRT = function(s) {return 'Math.sqrt('+s+')'};
		var tm = Date.now();
		var res = alasql('SELECT VALUE COUNT(*) FROM ? WHERE SQRT(x*x+y*y)<1', [rndfn]);
		//		console.log(Date.now() - tm);
		var pi = (res / n) * 4;
		//		console.log(res,pi);
		assert(2 < pi && pi < 4);

		done();
	});

}
