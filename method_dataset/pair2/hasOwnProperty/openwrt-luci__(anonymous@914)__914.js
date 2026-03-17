function __method_wrapper__() {
		return this.getNetwork(name).then(L.bind(function(existingNetwork) {
			if (name != null && /^[a-zA-Z0-9_]+$/.test(name) && existingNetwork == null) {
				var sid = uci.add('network', 'interface', name);

				if (sid != null) {
					if (L.isObject(options))
						for (var key in options)
							if (options.hasOwnProperty(key))
								uci.set('network', sid, key, options[key]);

					return this.instantiateNetwork(sid);
				}
			}
			else if (existingNetwork != null && existingNetwork.isEmpty()) {
				if (L.isObject(options))
					for (var key in options)
						if (options.hasOwnProperty(key))
							existingNetwork.set(key, options[key]);

				return existingNetwork;
			}
		}, this));

}
