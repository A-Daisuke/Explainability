function __method_wrapper__() {
		or() {
			const errors = [];

			for (let i = 0; i < arguments.length; i += 2) {
				if (typeof arguments[i] != 'function') {
					if (arguments[i] == this.value)
						return this.assert(true);
					errors.push('"%s"'.format(arguments[i]));
					i--;
				}
				else if (arguments[i].apply(this, arguments[i+1])) {
					return this.assert(true);
				}
				else {
					errors.push(this.error);
				}
			}

			const t = _('One of the following: %s');

			return this.assert(false, t.format(`\n - ${errors.join('\n - ')}`));
		},

}
