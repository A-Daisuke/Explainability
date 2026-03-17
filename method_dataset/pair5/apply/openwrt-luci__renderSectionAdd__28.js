function __method_wrapper__() {
		s.renderSectionAdd = function(extra_class) {
			var el = form.GridSection.prototype.renderSectionAdd.apply(this, arguments),
				nameEl = el.querySelector('.cbi-section-create-name');
			ui.addValidator(nameEl, 'uciname', true, function(v) {
				let sections = [
					...uci.sections('mwan3', 'interface'),
					...uci.sections('mwan3', 'member'),
					...uci.sections('mwan3', 'policy'),
					...uci.sections('mwan3', 'rule')
				];

				for (let j = 0; j < sections.length; j++) {
					if (sections[j]['.name'] == v) {
						return _('Members may not share the same name as configured interfaces, policies or rules.');
					}
				}
				if (v.length > 15) return _('Name length shall not exceed 15 characters');
				return true;
			}, 'blur', 'keyup');
			return el;
		};

}
