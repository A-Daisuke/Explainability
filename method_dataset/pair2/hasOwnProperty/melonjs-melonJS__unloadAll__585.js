export function unloadAll() {
	let name;

	// unload all binary resources
	for (name in binList) {
		if (binList.hasOwnProperty(name)) {
			unload({
				name: name,
				type: "binary",
			});
		}
	}

	// unload all image resources
	for (name in imgList) {
		if (imgList.hasOwnProperty(name)) {
			unload({
				name: name,
				type: "image",
			});
		}
	}

	// unload all tmx resources
	for (name in tmxList) {
		if (tmxList.hasOwnProperty(name)) {
			unload({
				name: name,
				type: "tmx",
			});
		}
	}

	// unload all json resources
	for (name in jsonList) {
		if (jsonList.hasOwnProperty(name)) {
			unload({
				name: name,
				type: "json",
			});
		}
	}

	// unload all video resources
	for (name in videoList) {
		if (videoList.hasOwnProperty(name)) {
			unload({
				name: name,
				type: "json",
			});
		}
	}

	// unload all video resources
	for (name in fontList) {
		if (fontList.hasOwnProperty(name)) {
			unload({
				name: name,
				type: "font",
			});
		}
	}

	// unload all audio resources
	audio.unloadAll();
}
