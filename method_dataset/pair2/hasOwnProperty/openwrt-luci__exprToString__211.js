function __method_wrapper__() {
	exprToString: function(expr, hint) {
		var kind, spec;

		if (typeof(expr) != 'object') {
			var s;

			if (hint)
				s = expr_translations['%s.%h'.format(hint, expr)];

			return s || '%h'.format(expr);
		}

		if (Array.isArray(expr)) {
			kind = 'list';
			spec = expr;
		}
		else {
			for (var k in expr) {
				if (expr.hasOwnProperty(k)) {
					kind = k;
					spec = expr[k];
				}
			}
		}

		if (!kind)
			return '';

		switch (kind) {
		case 'prefix':
			return '%h/%d'.format(spec.addr, spec.len);

		case 'set':
		case 'list':
			var items = [],
			    lis = [];

			for (var i = 0; i < spec.length; i++) {
				items.push('<span class="nft-set-item">%s</span>'.format(this.exprToString(spec[i])));
				lis.push('<span class="ifacebadge">%s</span>'.format(this.exprToString(spec[i])));
			}

			var tpl;

			if (kind == 'set')
				tpl = '<div class="nft-set cbi-tooltip-container">{ <span class="nft-set-items">%s</span> }<div class="cbi-tooltip">%s</div></div>';
			else
				tpl = '<div class="nft-list cbi-tooltip-container"><span class="nft-list-items">%s</span><div class="cbi-tooltip">%s</div></div>';

			return tpl.format(items.join(', '), lis.join('<br />'));

		case 'concat':
			var items = [];

			for (var i = 0; i < spec.length; i++)
				items.push(this.exprToString(spec[i]));

			return items.join('+');

		case 'range':
			return '%s-%s'.format(this.exprToString(spec[0], hint), this.exprToString(spec[1], hint));

		case 'payload':
			if (spec.protocol && spec.field) {
				var k = '%h.%h'.format(spec.protocol, spec.field);
				return expr_translations[k] || '<em>%s</em>'.format(k);
			}
			else if (spec.base && spec.offset != null && spec.len != null) {
				var k = 'payload.%h'.format(spec.base);
				return (expr_translations[k] || '<em>@%s,%%d,%%d</em>'.format(spec.base)).format(spec.offset + 1, spec.offset + spec.len + 1);
			}

			return 'payload: %s'.format(kind, JSON.stringify(spec));

		case '&':
		case '|':
		case '^':
			return '%s %h %s'.format(
				this.exprToString(spec[0], hint),
				kind,
				Array.isArray(spec[1]) ? '(%h)'.format(spec[1].join('|')) : this.exprToString(spec[1], hint));

		default:
			var k = this.exprToKey(expr);

			if (k)
				return expr_translations[k] || '<em>%s</em>'.format(k);

			return '%s: %s'.format(kind, JSON.stringify(spec));
		}
	},

}
