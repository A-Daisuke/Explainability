function __method_wrapper__() {
		o.validate = function (section_id, value) {
			if (!value) {
				return true;
			}
			if (!/^[*a-z0-9][a-z0-9.-]*$/.test(value)) {
				return _('Invalid domain. Allowed lowercase a-z, numbers and hyphen -');
			}
			if (value.startsWith('*')) {
				let method = this.section.children.filter(function (o) { return o.option == 'validation_method'; })[0].formvalue(section_id);
				if (method && method !== 'dns') {
					return _('wildcards * require Validation method: DNS');
				}
			}
			return true;
		};

}
