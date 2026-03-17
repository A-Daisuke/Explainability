const __obj__ = {
	renderExpr: function(expr, table) {
		var kind, spec;

		for (var k in expr) {
			if (expr.hasOwnProperty(k)) {
				kind = k;
				spec = expr[k];
			}
		}

		if (!kind)
			return E([]);

		switch (kind) {
		case 'match':
			return this.renderMatchExpr(spec);

		case 'ct helper':
			return E('span', {
					'class': 'ifacebadge'
			}, action_translations[kind].format(spec));

		case 'reject':
			var k = 'reject.%s'.format(spec.type);

			return E('span', {
				'class': 'ifacebadge'
			}, (action_translations[k] || k).format(this.exprToString(spec.expr)));

		case 'accept':
		case 'notrack':
		case 'drop':
			return E('span', {
				'class': 'ifacebadge'
			}, action_translations[kind] || '<em>%h</em>'.format(kind));

		case 'jump':
			return E('span', {
				'class': 'ifacebadge'
			}, action_translations.jump.format(table, spec.target, spec.target));

		case 'goto':
			return E('span', {
				'class': 'ifacebadge'
			}, action_translations.goto.format(table, spec.target, spec.target));

		case 'continue':
			return E('span', {
				'class': 'ifacebadge'
			}, action_translations.continue);

		case 'return':
			return E('span', {
				'class': 'ifacebadge'
			}, action_translations.return);

		case 'snat':
		case 'dnat':
			var k = '%h.%h'.format(kind, spec.family),
			    a = [];

			if (spec.addr) {
				k += '.addr';
				a.push(this.exprToString(spec.addr));
			}

			if (spec.port) {
				k += '.port';
				a.push(this.exprToString(spec.port));
			}

			return E('span', { 'class': 'ifacebadge' }, [
				E('span', ''.format.apply(action_translations[k] || k, a)),
				this.renderNatFlags(spec)
			]);

		case 'redirect':
			var k = 'redirect',
			    a = [];

			if (spec && spec.port) {
				k += '.port';
				a.push(this.exprToString(spec.port));
			}

			return E('span', { 'class': 'ifacebadge' }, [
				E('span', ''.format.apply(action_translations[k] || k, a)),
				this.renderNatFlags(spec)
			]);

		case 'masquerade':
			return E('span', { 'class': 'ifacebadge' }, [
				E('span', action_translations.masquerade),
				this.renderNatFlags(spec)
			]);

		case 'mangle':
			return E('span', { 'class': 'ifacebadge' },
				action_translations.mangle.format(
					this.exprToString(spec.key),
					this.exprToString(spec.value)
				));

		case 'limit':
			var k = 'limit';
			var a = [
				this.renderRateUnit(spec.rate, spec.rate_unit),
				expr_translations['unit.%h'.format(spec.per)] || spec.per
			];

			if (spec.inv)
				k += '.inv';

			if (spec.burst) {
				k += '.burst';
				a.push(this.renderRateUnit(spec.burst, spec.burst_unit));
			}

			return E('span', { 'class': 'ifacebadge', 'cbi-tooltip': JSON.stringify(spec) },
				''.format.apply(action_translations[k] || k, a));

		case 'flow':
			return E('span', {
				'class': 'ifacebadge'
			}, action_translations.flow.format(spec.flowtable.replace(/^@/, '')));

		case 'log':
			return E('span', {
				'class': 'ifacebadge'
			}, spec?.prefix ?
				''.format.apply(action_translations['log.prefix'], [spec?.prefix])
				: action_translations.log);

		default:
			return E('span', {
				'class': 'ifacebadge',
				'data-tooltip': JSON.stringify(spec)
			}, [ '{ ', E('strong', {}, [ kind ]), ' }' ]);
		}
	},

};
