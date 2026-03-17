class __C__ {
	__init__(value, choices, options) {
		if (!L.isObject(choices))
			choices = {};

		if (!Array.isArray(value))
			value = (value != null && value != '') ? [ value ] : [];

		if (!options.multiple && value.length > 1)
			value.length = 1;

		this.values = value;
		this.choices = choices;
		this.options = Object.assign({
			multiple: false,
			widget: 'select',
			orientation: 'horizontal'
		}, options);

		if (this.choices.hasOwnProperty(''))
			this.options.optional = true;
	},

}
