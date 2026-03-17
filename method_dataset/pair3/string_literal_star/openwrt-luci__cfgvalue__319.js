function __method_wrapper__() {
	cfgvalue: function(section_id) {
		var ports = L.toArray(uci.get('network', section_id, 'ports'));

		for (var i = 0; i < ports.length; i++) {
			var s = ports[i].split(/:/);

			if (s[0] != this.port)
				continue;

			var t = /t/.test(s[1] || '') ? 't' : 'u';

			return /\x2a/.test(s[1] || '') ? [t, '*'] : [t];
		}

		return ['-'];
	},

}
