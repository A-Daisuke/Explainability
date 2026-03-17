function __method_wrapper__() {
	_aggregateDevices: function(fn, first) {
		var devices = this.network ? this.network.getDevices() : [],
		    rv = 0;

		for (var i = 0; i < devices.length; i++) {
			var v = devices[i][fn].apply(devices[i]);

			if (v != null) {
				if (first)
					return v;

				rv += v;
			}
		}

		return first ? null : [ rv, devices.length ];
	},

}
