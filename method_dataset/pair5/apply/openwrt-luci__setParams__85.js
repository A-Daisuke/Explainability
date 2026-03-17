function setParams(o, params) {
	if (!params) return;
	for (var key in params) {
		var val = params[key];
		if (key === 'values') {
			for (var j = 0; j < val.length; j++) {
				var args = val[j];
				if (!Array.isArray(args))
					args = [args];
				o.value.apply(o, args);
			}
		} else if (key === 'depends') {
			if (!Array.isArray(val))
				val = [val];

			var deps = [];
			for (var j = 0; j < val.length; j++) {
				var d = {};
				for (var vkey in val[j])
					d[vkey] = val[j][vkey];
				for (var k = 0; k < o.deps.length; k++) {
					for (var dkey in o.deps[k]) {
						d[dkey] = o.deps[k][dkey];
					}
				}
				deps.push(d);
			}
			o.deps = deps;
		} else {
			o[key] = params[key];
		}
	}
	if (params['datatype'] === 'bool') {
		o.enabled = 'true';
		o.disabled = 'false';
	}
}
