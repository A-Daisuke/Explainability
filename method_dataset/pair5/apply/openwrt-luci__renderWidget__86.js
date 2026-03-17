function __method_wrapper__() {
		renderWidget: function(section_id, option_index, cfgvalue) {
			var maskopt = this.map.lookupOption('netmask', section_id),
			    widget = isCIDR(cfgvalue) ? 'DynamicList' : 'Value';

			if (widget == 'DynamicList') {
				this.datatype = 'or(cidr4,ipmask4)';
				this.placeholder = _('Add IPv4 address…');
			}
			else {
				this.datatype = 'ip4addr("nomask")';
			}

			var node = form[widget].prototype.renderWidget.apply(this, [ section_id, option_index, cfgvalue ]);

			if (widget == 'Value')
				L.dom.append(node, E('button', {
					'class': 'cbi-button cbi-button-neutral',
					'title': _('Switch to CIDR list notation'),
					'aria-label': _('Switch to CIDR list notation'),
					'click': L.bind(this.handleSwitch, this, section_id, option_index)
				}, '…'));

			return node;
		},

}
