function __method_wrapper__() {
		o.textvalue = function(section_id) {
			var ips = L.toArray(this.cfgvalue(section_id)),
			    list = [];

			for (var i = 0; i < ips.length; i++) {
				if (i > 7) {
					list.push(E('em', {
						'class': 'ifacebadge cbi-tooltip-container'
					}, [
						_('+ %d more', 'Label indicating further amount of allowed ips').format(ips.length - i),
						E('span', {
							'class': 'cbi-tooltip'
						}, [
							E('ul', ips.map(function(ip) {
								return E('li', [
									E('span', { 'class': 'ifacebadge' }, [ ip ])
								]);
							}))
						])
					]));

					break;
				}

				list.push(E('span', { 'class': 'ifacebadge' }, [ ips[i] ]));
			}

			if (!list.length)
				list.push('*');

			return E('span', { 'style': 'display:inline-flex;flex-wrap:wrap;gap:.125em' }, list);
		};

}
