function sectionNameCheck(extra_class) {
	var el = form.GridSection.prototype.renderSectionAdd.apply(this, arguments),
		nameEl = el.querySelector('.cbi-section-create-name');
	ui.addValidator(nameEl, 'uciname', true, function(v) {
		let sections = [
			...uci.sections('ipsec', 'remote'),
			...uci.sections('ipsec', 'tunnel'),
			...uci.sections('ipsec', 'crypto_proposal'),
		];
		if (sections.find(function(s) {
			return s['.name'] == v;
		})) {
			return _('Remotes, Encryption Proposals and Tunnels may not share the same names.') + ' ' + 
				_('Use combinations like tunnel1_phase1 that do not exceed 15 characters.');
		}
		if (v.length > 15) return _('Name length shall not exceed 15 characters');
		return true;
	}, 'blur', 'keyup');
	return el;
};
