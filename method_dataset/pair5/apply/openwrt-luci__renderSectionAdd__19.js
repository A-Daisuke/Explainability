function __method_wrapper__() {
		s.renderSectionAdd = function(extra_class) {
			var el = form.GridSection.prototype.renderSectionAdd.apply(this, arguments),
				nameEl = el.querySelector('.cbi-section-create-name');
			ui.addValidator(nameEl, 'uciname', true, function(v) {
				let sections = [
					...uci.sections('libreswan', 'crypto_proposal'),
					...uci.sections('libreswan', 'tunnel'),
				];
				if (sections.find(function(s) {
					return s['.name'] == v;
				})) {
					return _('This may not share the same name as other proposals or configured tunnels.');
				}
				if (v.length > 15) return _('Name length shall not exceed 15 characters');
				return true;
			}, 'blur', 'keyup');
			return el;
		};

}
