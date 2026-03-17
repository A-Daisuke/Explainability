const __obj__ = {
	exprToKey: function(expr) {
		var kind, spec;

		if (!Array.isArray(expr) && typeof(expr) == 'object') {
			for (var k in expr) {
				if (expr.hasOwnProperty(k)) {
					kind = k;
					spec = expr[k];
					break;
				}
			}
		}

		switch (kind || '-') {
		case 'meta':
		case 'ct':
		case 'rt':
			return '%h.%h'.format(kind, spec.key);

		case 'tcp option':
			return 'tcpoption.%h.%h'.format(spec.name, spec.field);

		case 'reject':
			return 'reject.%h'.format(spec.type);
		}

		return null;
	},

};
