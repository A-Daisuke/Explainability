function __method_wrapper__() {
	apply(name, value, args) {
		let func;

		if (typeof(name) === 'function')
			func = name;
		else if (typeof(this.factory.types[name]) === 'function')
			func = this.factory.types[name];
		else
			return false;

		if (value != null)
			this.value = value;

		return func.apply(this, args);
	},

}
