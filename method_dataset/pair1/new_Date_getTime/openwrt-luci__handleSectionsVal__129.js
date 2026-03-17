function handleSectionsVal(action, section_id, option, value) {
	let date, oldValue, w_device, w_ssid, w_bssid, t_sections;

	w_device = uci.get('wireless', section_id, 'device');
	w_ssid = uci.get('wireless', section_id, 'ssid');
	w_bssid = uci.get('wireless', section_id, 'bssid');
	t_sections = uci.sections('travelmate', 'uplink');

	for (let i = 0; i < t_sections.length; i++) {
		if (t_sections[i].device === w_device && t_sections[i].ssid === w_ssid && t_sections[i].bssid === w_bssid) {
			if (action === 'get') {
				return t_sections[i][option];
			}
			else if (action === 'set') {
				if (option === 'enabled') {
					oldValue = t_sections[i][option];
					if (oldValue !== value && value === '0') {
						date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().substr(0, 19).replace(/-/g, '.').replace('T', '-');
						uci.set('travelmate', t_sections[i]['.name'], 'con_end', date);
					}
					else if (oldValue !== value && value === '1') {
						uci.unset('travelmate', t_sections[i]['.name'], 'con_end');
					}
				}
				return uci.set('travelmate', t_sections[i]['.name'], option, value);
			}
			else if (action === 'del') {
				return uci.unset('travelmate', t_sections[i]['.name'], option);
			}
		}
	}
}
