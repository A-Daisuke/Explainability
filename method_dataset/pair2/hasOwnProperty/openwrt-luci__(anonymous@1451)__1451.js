function __method_wrapper__() {
		return initNetworkState().then(L.bind(function() {
			if (options == null ||
			    typeof(options) != 'object' ||
			    typeof(options.device) != 'string')
			    return null;

			var existingDevice = uci.get('wireless', options.device);
			if (existingDevice == null || existingDevice['.type'] != 'wifi-device')
				return null;

			/* XXX: need to add a named section (wifinet#) here */
			var sid = uci.add('wireless', 'wifi-iface');
			for (var key in options)
				if (options.hasOwnProperty(key))
					uci.set('wireless', sid, key, options[key]);

			var radioname = existingDevice['.name'],
			    netid = getWifiNetidBySid(sid) || [];

			return this.instantiateWifiNetwork(sid, radioname, _state.radios[radioname], netid[0], null);
		}, this));

}
