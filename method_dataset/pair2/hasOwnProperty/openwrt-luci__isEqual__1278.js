function isEqual(x, y) {
	if (typeof(y) == 'object' && y instanceof RegExp)
		return (x == null) ? false : y.test(x);

	if (x != null && y != null && typeof(x) != typeof(y))
		return false;

	if ((x == null && y != null) || (x != null && y == null))
		return false;

	if (Array.isArray(x)) {
		if (x.length != y.length)
			return false;

		for (let i = 0; i < x.length; i++)
			if (!isEqual(x[i], y[i]))
				return false;
	}
	else if (typeof(x) == 'object') {
		for (const k in x) {
			if (x.hasOwnProperty(k) && !y.hasOwnProperty(k))
				return false;

			if (!isEqual(x[k], y[k]))
				return false;
		}

		for (const k in y)
			if (y.hasOwnProperty(k) && !x.hasOwnProperty(k))
				return false;
	}
	else if (x != y) {
		return false;
	}

	return true;
};
