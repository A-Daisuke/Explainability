function __method_wrapper__() {
	parseIptablesDump: function(is_ipv6, table, s) {
		var current_chain = null;
		var current_rules = [];
		var seen_chains = {};
		var chain_refs = {};
		var re = /([^\n]*)\n/g;
		var m, m2;
		var raw = document.querySelector('[data-raw-counters="true"]');

		while ((m = re.exec(s)) != null) {
			if (m[1].match(/^Chain (.+) \(policy (\w+) (\d+) packets, (\d+) bytes\)$/)) {
				var chain = RegExp.$1,
				    policy = RegExp.$2,
				    packets = +RegExp.$3,
				    bytes = +RegExp.$4;

				this.updateChainSection(current_chain, current_rules);

				seen_chains[chain] = true;
				current_chain = this.createChainSection(is_ipv6, table, chain, policy, packets, bytes);
				current_rules = [];
			}
			else if (m[1].match(/^Chain (.+) \((\d+) references\)$/)) {
				var chain = RegExp.$1,
				    references = +RegExp.$2;

				this.updateChainSection(current_chain, current_rules);

				seen_chains[chain] = true;
				current_chain = this.createChainSection(is_ipv6, table, chain, null, null, null, references);
				current_rules = [];
			}
			else if (m[1].match(/^num /)) {
				continue;
			}
			else if ((m2 = m[1].match(/^(\d+) +(\d+) +(\d+) +(.*?) +(\S+) +(\S*) +(\S+) +(\S+) +(!?[a-f0-9:.]+(?:\/[a-f0-9:.]+)?) +(!?[a-f0-9:.]+(?:\/[a-f0-9:.]+)?) +(.+)$/)) !== null) {
				var num = +m2[1],
				    pkts = +m2[2],
				    bytes = +m2[3],
				    target = m2[4],
				    proto = m2[5],
				    indev = m2[7],
				    outdev = m2[8],
				    srcnet = m2[9],
				    dstnet = m2[10],
				    options = m2[11] || '-',
				    comment = '-';

				options = options.trim().replace(/(?:^| )\/\* (.+) \*\//,
					function(m1, m2) {
						comment = m2.replace(/^!fw3(: |$)/, '').trim() || '-';
						return '';
					}) || '-';

				current_rules.push([
					E('div', {
						'class': 'nowrap',
						'style': raw ? raw_style : null,
						'data-format': '%.2m',
						'data-value': pkts
					}, (raw ? '%d' : '%.2m').format(pkts)),
					E('div', {
						'class': 'nowrap',
						'style': raw ? raw_style : null,
						'data-format': '%.2mB',
						'data-value': bytes
					}, (raw ? '%d' : '%.2mB').format(bytes)),
					target ? '<span class="target">%s</span>'.format(target) : '-',
					proto,
					(indev !== '*') ? '<span class="ifacebadge nowrap">%s</span>'.format(indev) : '*',
					(outdev !== '*') ? '<span class="ifacebadge nowrap">%s</span>'.format(outdev) : '*',
					srcnet,
					dstnet,
					options,
					[ comment, '%h'.format(comment) ]
				]);

				if (target) {
					chain_refs[target] = chain_refs[target] || [];
					chain_refs[target].push([ current_chain, num ]);
				}
			}
		}

		this.updateChainSection(current_chain, current_rules);

		document.querySelectorAll('[data-table="%s-%s"] [data-chain]'.format(is_ipv6 ? 'ipv6' : 'ipv4', table)).forEach(L.bind(function(cdiv) {
			if (!seen_chains[cdiv.getAttribute('data-chain')]) {
				cdiv.parentNode.removeChild(cdiv);
				return;
			}

			cdiv.querySelectorAll('.target').forEach(L.bind(function(tspan) {
				if (seen_chains[tspan.textContent]) {
					tspan.classList.add('jump');
					tspan.addEventListener('click', this.handleJumpTarget);
				}
			}, this));

			cdiv.querySelectorAll('.references').forEach(L.bind(function(rspan) {
				var refs = chain_refs[cdiv.getAttribute('data-chain')];
				if (refs && refs.length) {
					rspan.classList.add('cbi-tooltip-container');
					rspan.appendChild(E('small', { 'class': 'cbi-tooltip ifacebadge', 'style': 'top:1em; left:auto' }, [ E('ul') ]));

					refs.forEach(L.bind(function(ref) {
						var chain = ref[0].parentNode.getAttribute('data-chain'),
						    num = ref[1];

						rspan.lastElementChild.lastElementChild.appendChild(E('li', {}, [
							_('Chain'), ' ',
							E('span', {
								'class': 'jump',
								'data-num': num,
								'click': this.handleJumpTarget
							}, chain),
							', %s #%d'.format(_('Rule'), num)
						]));
					}, this));
				}
			}, this));
		}, this));
	},

}
