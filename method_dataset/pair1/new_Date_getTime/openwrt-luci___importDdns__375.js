function _importDdns(ddnsDomains) {
	let certSections = uci.sections('acme', 'cert');
	let certSectionNames = new Map();
	let certSectionDomains = new Map();
	for (let s of certSections) {
		certSectionNames.set(s['.name'], null);
		if (s.domains) {
			for (let d of s.domains) {
				certSectionDomains.set(d, s['.name']);
			}
		}
	}
	let importedDomains = {};
	let importedErrors = [];
	for (let ddnsDomain of ddnsDomains) {
		let sectionId = ddnsDomain.sectionId;
		// ensure unique sectionId
		if (certSectionNames.has(sectionId)) {
			sectionId += '_' + new Date().getTime();
		}
		if (ddnsDomain.domains) {
			for (let d of ddnsDomain.domains) {
				let dupDomainSection = certSectionDomains.get(d);
				if (dupDomainSection) {
					let errorText = _('The domain %s in DDNS %s is already configured in %s. Please check it after the importing.')
						.format(d, sectionId, dupDomainSection);
					importedErrors.push(errorText);
				}
			}
		}
		importedDomains[sectionId] = {
			'domains': ddnsDomain.domains,
			'validation_method': 'dns',
			'dns': ddnsDomain.dnsApi,
			'credentials': ddnsDomain.credentials,
		};
	}
	ui.showModal(_('Check the configurations of the added domain certificates'), [
		E('p', JSON.stringify(importedDomains, null, 2)),
		E('p', importedErrors.join('<br />')),
		E('div', { 'class': 'right' }, [
			E('button', {
				'class': 'btn cbi-button',
				'click': ui.hideModal
			}, _('Cancel')),
			' ',
			E('button', {
				'class': 'btn cbi-button-action',
				'click': ui.createHandlerFn(this, function (ev) {
					for (let [sectionId, opts] of Object.entries(importedDomains)) {
						uci.add('acme', 'cert', sectionId);
						for (let [key, val] of Object.entries(opts)) {
							uci.set('acme', sectionId, key, val);
						}
					}
					uci.save().then(() => window.location.reload());
				})
			}, _('Save'))
		])
	]);
}
