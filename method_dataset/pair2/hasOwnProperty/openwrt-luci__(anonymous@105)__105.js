function __method_wrapper__() {
	return callNetworkProtoHandlers().then(function(protos) {
		/* Register "none" protocol */
		if (!protos.hasOwnProperty('none'))
			Object.assign(protos, { none: { no_device: false } });

		/* Hack: emulate relayd protocol */
		if (!protos.hasOwnProperty('relay') && L.hasSystemFeature('relayd'))
			Object.assign(protos, { relay: { no_device: true } });

		Object.assign(_protospecs, protos);

		return Promise.all(Object.keys(protos).map(function(p) {
			return Promise.resolve(L.require('protocol.%s'.format(p))).catch(function(err) {
				if (L.isObject(err) && err.name != 'NetworkError')
					L.error(err);
			});
		})).then(function() {
			return protos;
		});
	}).catch(function() {

}
