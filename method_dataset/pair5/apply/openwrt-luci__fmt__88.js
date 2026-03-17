function __method_wrapper__() {
	fmt: function(fmtstr, args, values) {
		var repl = [],
		    wrap = false,
		    tokens = [];

		if (values == null) {
			values = [];
			wrap = true;
		}

		var get = function(args, key) {
			var names = key.trim().split(/\./),
			    obj = args,
			    ctx = obj;

			for (var i = 0; i < names.length; i++) {
				if (!L.isObject(obj))
					return null;

				ctx = obj;
				obj = obj[names[i]];
			}

			if (typeof(obj) == 'function')
				return obj.call(ctx);

			return obj;
		};

		var isset = function(val) {
			if (L.isObject(val) && !dom.elem(val)) {
				for (var k in val)
					if (val.hasOwnProperty(k))
						return true;

				return false;
			}
			else if (Array.isArray(val)) {
				return (val.length > 0);
			}
			else {
				return (val !== null && val !== undefined && val !== '' && val !== false);
			}
		};

		var parse = function(tokens, text) {
			if (dom.elem(text)) {
				tokens.push('<span data-fmt-placeholder="%d"></span>'.format(values.length));
				values.push(text);
			}
			else {
				tokens.push(String(text).replace(/\\(.)/g, '$1'));
			}
		};

		for (var i = 0, last = 0; i <= fmtstr.length; i++) {
			if (fmtstr.charAt(i) == '%' && fmtstr.charAt(i + 1) == '{') {
				if (i > last)
					parse(tokens, fmtstr.substring(last, i));

				var j = i + 1,  nest = 0;

				var subexpr = [];

				for (var off = j + 1, esc = false; j <= fmtstr.length; j++) {
					var ch = fmtstr.charAt(j);

					if (esc) {
						esc = false;
					}
					else if (ch == '\\') {
						esc = true;
					}
					else if (ch == '{') {
						nest++;
					}
					else if (ch == '}') {
						if (--nest == 0) {
							subexpr.push(fmtstr.substring(off, j));
							break;
						}
					}
					else if (ch == '?' || ch == ':' || ch == '#') {
						if (nest == 1) {
							subexpr.push(fmtstr.substring(off, j));
							subexpr.push(ch);
							off = j + 1;
						}
					}
				}

				var varname  = subexpr[0].trim(),
				    op1      = (subexpr[1] != null) ? subexpr[1] : '?',
				    if_set   = (subexpr[2] != null && subexpr[2] != '') ? subexpr[2] : '%{' + varname + '}',
				    op2      = (subexpr[3] != null) ? subexpr[3] : ':',
				    if_unset = (subexpr[4] != null) ? subexpr[4] : '';

				/* Invalid expression */
				if (nest != 0 || subexpr.length > 5 || varname == '') {
					return fmtstr;
				}

				/* enumeration */
				else if (op1 == '#' && subexpr.length == 3) {
					var items = L.toArray(get(args, varname));

					for (var k = 0; k < items.length; k++) {
						tokens.push.apply(tokens, this.fmt(if_set, Object.assign({}, args, {
							first: k == 0,
							next:  k > 0,
							last:  (k + 1) == items.length,
							item:  items[k]
						}), values));
					}
				}

				/* ternary expression */
				else if (op1 == '?' && op2 == ':' && (subexpr.length == 1 || subexpr.length == 3 || subexpr.length == 5)) {
					var val = get(args, varname);

					if (subexpr.length == 1)
						parse(tokens, isset(val) ? val : '');
					else if (isset(val))
						tokens.push.apply(tokens, this.fmt(if_set, args, values));
					else
						tokens.push.apply(tokens, this.fmt(if_unset, args, values));
				}

				/* unrecognized command */
				else {
					return fmtstr;
				}

				last = j + 1;
				i = j;
			}
			else if (i >= fmtstr.length) {
				if (i > last)
					parse(tokens, fmtstr.substring(last, i));
			}
		}

		if (wrap) {
			var node = E('span', {}, tokens.join('')),
			    repl = node.querySelectorAll('span[data-fmt-placeholder]');

			for (var i = 0; i < repl.length; i++)
				repl[i].parentNode.replaceChild(values[repl[i].getAttribute('data-fmt-placeholder')], repl[i]);

			return node;
		}
		else {
			return tokens;
		}
	},

}
