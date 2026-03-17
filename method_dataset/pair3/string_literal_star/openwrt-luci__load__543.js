const __obj__ = {
		load: function(section_id) {
			var cfgvalue = L.toArray(this.super('load', [section_id]) || this.default).sort();

			['all', 'tcp', 'udp', 'icmp'].concat(cfgvalue).forEach(L.bind(function(value) {
				switch (value) {
				case 'all':
				case 'any':
				case '*':
					this.addChoice('all', _('Any'));
					break;

				case 'tcpudp':
					this.addChoice('tcp', 'TCP');
					this.addChoice('udp', 'UDP');
					break;

				default:
					var m = value.match(/^(0x[0-9a-f]{1,2}|[0-9]{1,3})$/),
					    p = lookupProto(m ? +m[1] : value);

					this.addChoice(p[2], p[1]);
					break;
				}
			}, this));

			if (cfgvalue == '*' || cfgvalue == 'any' || cfgvalue == 'all')
				cfgvalue = 'all';

			return cfgvalue;
		},

};
