class __C__ {
	forEach(callback, thisArg) {
		let i = 0;
		const children = this.getChildren();

		const len = children.length;

		if (typeof callback !== "function") {
			throw new Error(callback + " is not a function");
		}

		while (i < len) {
			callback.call(thisArg ?? this, children[i], i, children);
			i++;
		}
	}

}
