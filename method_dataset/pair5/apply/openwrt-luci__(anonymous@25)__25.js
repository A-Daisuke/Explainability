function __method_wrapper__() {
				return L.resolveDefault(fs.exec_direct('/usr/sbin/ip' + suffix + 'tables-save', []), '').then(L.bind(function(res) {
					var lines = res.split(/\n/),
					    table, chain, count, iptables = {};

					for (var i = 0; i < lines.length; i++) {
						var m;

						if ((m = lines[i].match(/^\*(\S+)$/)) != null) {
							table = m[1];
							count = {};
						}
						else if ((m = lines[i].match(/^-A (.+?) ([!-].+)$/)) != null) {
							count[m[1]] = (count[m[1]] || 0) + 1;

							iptables[table] = iptables[table] || {};
							iptables[table][m[1]] = iptables[table][m[1]] || {};
							iptables[table][m[1]][count[m[1]]] = E('span', {
								'style': 'overflow:hidden; text-overflow:ellipsis; max-width:200px',
								'data-tooltip': m[2]
							}, [
								'#%d: '.format(count[m[1]]),
								m[2].replace(/-m comment --comment "(.+?)" /, '')
							]);

							/*
							 * collectd currently does not support comments with spaces:
							 * https://github.com/collectd/collectd/issues/2766
							 */
							var c = m[2].match(/-m comment --comment "(.+)" -/);
							if (c && c[1] != '!fw3' && !c[1].match(/[ \t\n]/))
								iptables[table][m[1]][c[1]] = E('span', {}, [ c[1] ]);
						}
					}

					this.subsection.iptables = iptables;

					return form.SectionValue.prototype.load.apply(this, [section_id]);
				}, this));

}
