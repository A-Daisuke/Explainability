function __method_wrapper__() {
	render() {
		const sb = E('div', {
			'id': this.options.id,
			'class': 'cbi-dropdown',
			'multiple': this.options.multiple ? '' : null,
			'optional': this.options.optional ? '' : null,
			'disabled': this.options.disabled ? '' : null,
			'tabindex': -1
		}, E('ul'));

		let keys = Object.keys(this.choices);

		if (this.options.sort === true)
			keys.sort(L.naturalCompare);
		else if (Array.isArray(this.options.sort))
			keys = this.options.sort;

		if (this.options.create)
			for (let i = 0; i < this.values.length; i++)
				if (!this.choices.hasOwnProperty(this.values[i]))
					keys.push(this.values[i]);

		for (let i = 0; i < keys.length; i++) {
			let label = this.choices[keys[i]];

			if (dom.elem(label))
				label = label.cloneNode(true);

			sb.lastElementChild.appendChild(E('li', {
				'data-value': keys[i],
				'selected': (this.values.indexOf(keys[i]) > -1) ? '' : null
			}, [ label ?? keys[i] ]));
		}

		if (this.options.create) {
			const createEl = E('input', {
				'type': 'text',
				'class': 'create-item-input',
				'readonly': this.options.readonly ? '' : null,
				'maxlength': this.options.maxlength,
				'placeholder': this.options.custom_placeholder ?? this.options.placeholder,
				'inputmode': 'text',
				'enterkeyhint': 'done'
			});

			if (this.options.datatype || this.options.validate)
				UI.prototype.addValidator(createEl, this.options.datatype ?? 'string',
				                          true, this.options.validate, 'blur', 'keyup');

			sb.lastElementChild.appendChild(E('li', { 'data-value': '-' }, createEl));
		}

		if (this.options.create_markup)
			sb.appendChild(E('script', { type: 'item-template' },
				this.options.create_markup));

		return this.bind(sb);
	},

}
