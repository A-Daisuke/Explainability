export function load(asset, onload, onerror) {
	// make sure all parsers have been initialized
	if (parserInitialized === false) {
		initParsers();
	}

	// transform the url if necessary
	if (typeof baseURL[asset.type] !== "undefined") {
		asset.src = baseURL[asset.type] + asset.src;
	}

	const parser = parsers.get(asset.type);

	if (typeof parser === "undefined") {
		throw new Error("load : unknown or invalid resource type : " + asset.type);
	}

	// parser returns the amount of asset to be loaded (usually 1 unless an asset is splitted into several ones)
	return parser.call(this, asset, onload, onerror, {
		nocache: nocache,
		crossOrigin: crossOrigin,
		withCredentials: withCredentials,
	});
}
