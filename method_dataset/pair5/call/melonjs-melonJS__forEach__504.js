class __C__ {
	forEach(callback, thisArg) {
		let i = 0;
		const shapes = this.shapes;

		const len = shapes.length;

		if (typeof callback !== "function") {
			throw new Error(callback + " is not a function");
		}

		while (i < len) {
			callback.call(thisArg ?? this, shapes[i], i, shapes);
			i++;
		}
	}

}
