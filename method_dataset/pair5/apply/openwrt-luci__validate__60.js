class __C__ {
	validate() {
		/* element is detached */
		if (!findParent(this.field, 'body') && !findParent(this.field, '[data-field]'))
			return true;

		this.field.classList.remove('cbi-input-invalid');
		this.value = (this.field.value != null) ? this.field.value : '';
		this.error = null;

		let valid;

		if (this.value.length === 0)
			valid = this.assert(this.optional, _('non-empty value'));
		else
			valid = this.vstack[0].apply(this, this.vstack[1]);

		if (valid !== true) {
			const message = _('Expecting: %s').format(this.error);
			this.field.setAttribute('data-tooltip', message);
			this.field.setAttribute('data-tooltip-style', 'error');
			this.field.dispatchEvent(new CustomEvent('validation-failure', {
				bubbles: true,
				detail: {
					message: message
				}
			}));
			return false;
		}

		if (typeof(this.vfunc) == 'function')
			valid = this.vfunc(this.value);

		if (valid !== true) {
			this.assert(false, valid);
			this.field.setAttribute('data-tooltip', valid);
			this.field.setAttribute('data-tooltip-style', 'error');
			this.field.dispatchEvent(new CustomEvent('validation-failure', {
				bubbles: true,
				detail: {
					message: valid
				}
			}));
			return false;
		}

		this.field.removeAttribute('data-tooltip');
		this.field.removeAttribute('data-tooltip-style');
		this.field.dispatchEvent(new CustomEvent('validation-success', { bubbles: true }));
		return true;
	},

}
