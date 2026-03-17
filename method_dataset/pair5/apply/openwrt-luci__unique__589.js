function __method_wrapper__() {
		unique(subvalidator, subargs) {
			const ctx = this;
			const option = findParent(ctx.field, '[data-widget][data-name]');
			const section = findParent(option, '.cbi-section');
			const query = '[data-widget="%s"][data-name="%s"]'.format(option.getAttribute('data-widget'), option.getAttribute('data-name'));
			let unique = true;

			section.querySelectorAll(query).forEach(sibling => {
				if (sibling === option)
					return;

				const input = sibling.querySelector('[data-type]');
				const values = input ? (input.getAttribute('data-is-list') ? input.value.match(/[^ \t]+/g) : [ input.value ]) : null;

				if (values !== null && values.indexOf(ctx.value) !== -1)
					unique = false;
			});

			if (!unique)
				return this.assert(false, _('unique value'));

			if (typeof(subvalidator) === 'function')
				return this.apply(subvalidator, null, subargs);

			return this.assert(true);
		},

}
