function __method_wrapper__() {
	_mergerIf: function(key, target, source) {
		if (!isValidKey(key)) {
			// We want to ensure we do not copy prototypes over
			// as this can pollute global namespaces
			return;
		}

		var tval = target[key];
		var sval = source[key];

		if (helpers.isObject(tval) && helpers.isObject(sval)) {
			helpers.mergeIf(tval, sval);
		} else if (!target.hasOwnProperty(key)) {
			target[key] = helpers.clone(sval);
		}
	},

}
