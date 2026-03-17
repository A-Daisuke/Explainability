function __method_wrapper__() {
		return initNetworkState().then(function() {
			if (newName == null || !/^[a-zA-Z0-9_]+$/.test(newName) || uci.get('network', newName) != null)
				return false;

			var oldNetwork = uci.get('network', oldName);

			if (oldNetwork == null || oldNetwork['.type'] != 'interface')
				return false;

			var sid = uci.add('network', 'interface', newName);

			for (var key in oldNetwork)
				if (oldNetwork.hasOwnProperty(key) && key.charAt(0) != '.')
					uci.set('network', sid, key, oldNetwork[key]);

			uci.sections('luci', 'ifstate', function(s) {
				if (s.interface == oldName)
					uci.set('luci', s['.name'], 'interface', newName);
			});

			uci.sections('network', 'alias', function(s) {
				if (s.interface == oldName)
					uci.set('network', s['.name'], 'interface', newName);
			});

			uci.sections('network', 'route', function(s) {
				if (s.interface == oldName)
					uci.set('network', s['.name'], 'interface', newName);
			});

			uci.sections('network', 'route6', function(s) {
				if (s.interface == oldName)
					uci.set('network', s['.name'], 'interface', newName);
			});

			uci.sections('wireless', 'wifi-iface', function(s) {
				var networks = L.toArray(s.network).map(function(network) { return (network == oldName ? newName : network) });

				if (networks.length > 0)
					uci.set('wireless', s['.name'], 'network', networks.join(' '));
			});

			uci.remove('network', oldName);

			return true;
		});

}
