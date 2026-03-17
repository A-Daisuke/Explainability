const origin = (origin, callback) => {
	if (config.autoOrigin === true) {
		fullyQualifiedDomainNames()
			.then((names) => callback(
				null,
				names.flatMap((name) => [ `http://${ name }`, `https://${ name }`, name ]),
			))
			.catch((error) => callback(error, false))
		return
	}

	if (config.allowOrigin === '*') {
		callback(null, true)
		return
	}

	if (config.allowOrigin != null) {
		callback(null, config.allowOrigin.split(','))
		return
	}

	callback(null, false)
	return
}
