function __method_wrapper__() {
yy.Print.prototype.execute = function (databaseid, params, cb) {
	//	console.log(this.url);
	var self = this;
	var res = 1;
	//console.log(this);
	alasql.precompile(this, databaseid, params); /** @todo Change from alasql to this */

	if (this.exprs && this.exprs.length > 0) {
		var rs = this.exprs.map(function (expr) {
			// console.log(48748747654, 'var y;return ' + expr.toJS('({})', '', null));
			var exprfn = new Function(
				'params,alasql,p',
				'var y;return ' + expr.toJS('({})', '', null)
			).bind(self);
			var r = exprfn(params, alasql);
			return JSONtoString(r);
		});
		console.log.apply(console, rs);
	} else if (this.select) {
		var r = this.select.execute(databaseid, params);
		console.log(JSONtoString(r));
	} else {
		console.log();
	}

	if (cb) res = cb(res);
	return res;
};

}
