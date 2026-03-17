function globListToRegExp(section_id, option) {
	var list = L.toArray(uci.get('rpcd', section_id, option)),
	    positivePatterns = [],
	    negativePatterns = [];

	if (option == 'read')
		list.push.apply(list, L.toArray(uci.get('rpcd', section_id, 'write')));

	for (var i = 0; i < list.length; i++) {
		var array, glob;

		if (list[i].match(/^\s*!/)) {
			glob = list[i].replace(/^\s*!/, '').trim();
			array = negativePatterns;
		}
		else {
			glob = list[i].trim(),
			array = positivePatterns;
		}

		array.push(glob.replace(/[.*+?^${}()|[\]\\]/g, function(m) {
			switch (m[0]) {
			case '?':
				return '.';

			case '*':
				return '.*';

			default:
				return '\\' + m[0];
			}
		}));
	}

	return [
		new RegExp('^' + (positivePatterns.length ? '(' + positivePatterns.join('|') + ')' : '') + '$'),
		new RegExp('^' + (negativePatterns.length ? '(' + negativePatterns.join('|') + ')' : '') + '$')
	];
}
