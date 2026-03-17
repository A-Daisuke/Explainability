function __method_wrapper__() {
utils.glob = function (value, pattern) {
	var i = 0;
	var s = '^';

	while (i < pattern.length) {
		var c = pattern[i],
			c1 = '';
		if (i < pattern.length - 1) c1 = pattern[i + 1];

		if (c === '[' && c1 === '^') {
			s += '[^';
			i++;
		} else if (c === '[' || c === ']') {
			s += c;
		} else if (c === '*') {
			s += '.*';
		} else if (c === '?') {
			s += '.';
		} else if ('/.*+?|(){}'.indexOf(c) > -1) {
			s += '\\' + c;
		} else {
			s += c;
		}
		i++;
	}

	s += '$';
	return ('' + (value || '')).toUpperCase().search(RegExp(s.toUpperCase())) > -1;
};

}
