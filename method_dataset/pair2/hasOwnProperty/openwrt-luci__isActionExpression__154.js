const __obj__ = {
	isActionExpression: function(expr) {
		for (var k in expr) {
			if (expr.hasOwnProperty(k)) {
				switch (k) {
				case 'accept':
				case 'notrack':
				case 'reject':
				case 'drop':
				case 'jump':
				case 'goto':
				case 'continue':
				case 'snat':
				case 'dnat':
				case 'redirect':
				case 'mangle':
				case 'masquerade':
				case 'return':
				case 'flow':
				case 'ct helper':
				case 'log':
					return true;
				}
			}
		}

		return false;
	},

};
