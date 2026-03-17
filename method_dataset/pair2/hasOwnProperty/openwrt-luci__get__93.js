function __method_wrapper__() {
	get(config, section, option) {
		if (section == null)
			return null;

		if (option == null)
			return this.data[section];

		if (!this.data.hasOwnProperty(section))
			return null;

		const value = this.data[section][option];

		if (Array.isArray(value))
			return value;

		if (value != null)
			return String(value);

		return null;
	},

}
