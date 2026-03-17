function __method_wrapper__() {
	return (...args: [] /* empty array */) => {
		if (!inThrottle) {
			fn.apply(this, args);
			lastTime = Date.now();
			inThrottle = true;
		} else {
			clearTimeout(lastFn);
			lastFn = setTimeout(
				() => {
					if (Date.now() - lastTime >= wait) {
						fn.apply(this, args);
						lastTime = Date.now();
					}
				},
				Math.max(wait - (Date.now() - lastTime), 0),
			);
		}
	};

}
