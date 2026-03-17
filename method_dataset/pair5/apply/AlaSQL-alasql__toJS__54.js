function __method_wrapper__() {
yy.FuncValue.prototype.toJS = function (context, tableid, defcols) {
	var s = '';
	var funcid = this.funcid;
	// IF this is standard compile functions
	if (!alasql.fn[funcid] && alasql.stdlib[funcid.toUpperCase()]) {
		if (this.args && this.args.length > 0) {
			s += alasql.stdlib[funcid.toUpperCase()].apply(
				this,
				this.args.map(function (arg) {
					return arg.toJS(context, tableid);
				})
			);
		} else {
			s += alasql.stdlib[funcid.toUpperCase()]();
		}
	} else if (!alasql.fn[funcid] && alasql.stdfn[funcid.toUpperCase()]) {
		if (this.newid) s += 'new ';
		s += 'alasql.stdfn[' + JSON.stringify(this.funcid.toUpperCase()) + '](';
		if (this.args && this.args.length > 0) {
			s += this.args
				.map(function (arg) {
					return arg.toJS(context, tableid, defcols);
				})
				.join(',');
		}
		s += ')';
	} else {
		// This is user-defined run-time function
		// TODO arguments!!!
		//		var s = '';
		if (this.newid) s += 'new ';
		s += 'alasql.fn[' + JSON.stringify(this.funcid) + '](';
		if (this.args && this.args.length > 0) {
			s += this.args
				.map(function (arg) {
					return arg.toJS(context, tableid, defcols);
				})
				.join(',');
		}
		s += ')';
	}
	return s;
};

}
