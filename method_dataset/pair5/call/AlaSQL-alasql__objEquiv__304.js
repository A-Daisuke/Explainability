	function objEquiv(a, b) {
		if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b)) return false;
		// an identical 'prototype' property.
		if (a.prototype !== b.prototype) return false;
		//~~~I've managed to break Object.keys through screwy arguments passing.
		//   Converting to array solves the problem.
		var aIsArgs = isArguments(a),
			bIsArgs = isArguments(b);
		if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs)) return false;
		if (aIsArgs) {
			a = pSlice.call(a);
			b = pSlice.call(b);
			return _deepEqual(a, b);
		}
		try {
			var ka = Object.keys(a),
				kb = Object.keys(b),
				key,
				i;
		} catch (e) {
			//happens when one is a string literal and the other isn't
			return false;
		}
		// having the same number of owned properties (keys incorporates
		// hasOwnProperty)
		if (ka.length != kb.length) return false;
		//the same set of keys (although not necessarily the same order),
		ka.sort();
		kb.sort();
		//~~~cheap key test
		for (i = ka.length - 1; i >= 0; i--) {
			if (ka[i] != kb[i]) return false;
		}
		//equivalent values for every corresponding key, and
		//~~~possibly expensive deep test
		for (i = ka.length - 1; i >= 0; i--) {
			key = ka[i];
			if (!_deepEqual(a[key], b[key])) return false;
		}
		return true;
	}
