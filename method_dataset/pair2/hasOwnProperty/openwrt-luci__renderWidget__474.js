function __method_wrapper__() {
	renderWidget: function(section_id, option_index, cfgvalue) {
		var values = L.toArray((cfgvalue != null) ? cfgvalue : this.default),
		    choices = {},
		    checked = {},
		    order = [];

		for (var i = 0; i < values.length; i++)
			checked[values[i]] = true;

		values = [];

		if (!this.multiple && (this.rmempty || this.optional))
			choices[''] = E('em', _('unspecified'));

		for (var i = 0; i < this.devices.length; i++) {
			var device = this.devices[i],
			    name = device.getName(),
			    type = device.getType();

			if (name == 'lo' || name == this.exclude || !this.filter(section_id, name))
				continue;

			if (this.noaliases && type == 'alias')
				continue;

			if (this.nobridges && type == 'bridge')
				continue;

			if (this.noinactive && device.isUp() == false)
				continue;

			var item = E([
				E('img', {
					'title': device.getI18n(),
					'src': L.resource('icons/%s%s.svg'.format(type, device.isUp() ? '' : '_disabled'))
				}),
				E('span', { 'class': 'hide-open' }, [ name ]),
				E('span', { 'class': 'hide-close'}, [ device.getI18n() ])
			]);

			var networks = device.getNetworks();

			if (networks.length > 0)
				L.dom.append(item.lastChild, [ ' (', networks.map(function(n) { return n.getName() }).join(', '), ')' ]);

			if (checked[name])
				values.push(name);

			choices[name] = item;
			order.push(name);
		}

		if (this.networks != null) {
			for (var i = 0; i < this.networks.length; i++) {
				var net = this.networks[i],
				    device = network.instantiateDevice('@%s'.format(net.getName()), net),
				    name = device.getName();

				if (name == '@loopback' || name == this.exclude || !this.filter(section_id, name))
					continue;

				if (this.noinactive && net.isUp() == false)
					continue;

				var item = E([
					E('img', {
						'title': device.getI18n(),
						'src': L.resource('icons/alias%s.svg'.format(device.isUp() ? '' : '_disabled'))
					}),
					E('span', { 'class': 'hide-open' }, [ name ]),
					E('span', { 'class': 'hide-close'}, [ device.getI18n() ])
				]);

				if (checked[name])
					values.push(name);

				choices[name] = item;
				order.push(name);
			}
		}

		if (this.includeips) {
			this.devices.forEach(net_dev => {
				['getIPAddrs', 'getIP6Addrs'].forEach(fn => {
					net_dev[fn]().forEach(addr => {
						const name = addr.split('/')[0];
						if (checked[name]) values.push(name);

						choices[name] = E([], [name, ' (', E('strong', net_dev.getName()), ')']);
						order.push(name);
					});
				});
			});
		}

		if (!this.nocreate) {
			var keys = Object.keys(checked).sort(L.naturalCompare);

			for (var i = 0; i < keys.length; i++) {
				if (choices.hasOwnProperty(keys[i]))
					continue;

				choices[keys[i]] = E([
					E('img', {
						'title': _('Absent Interface'),
						'src': L.resource('icons/ethernet_disabled.svg')
					}),
					E('span', { 'class': 'hide-open' }, [ keys[i] ]),
					E('span', { 'class': 'hide-close'}, [ '%s: "%h"'.format(_('Absent Interface'), keys[i]) ])
				]);

				values.push(keys[i]);
				order.push(keys[i]);
			}
		}

		var widget = new ui.Dropdown(this.multiple ? values : values[0], choices, {
			id: this.cbid(section_id),
			sort: order,
			multiple: this.multiple,
			optional: this.optional || this.rmempty,
			disabled: (this.readonly != null) ? this.readonly : this.map.readonly,
			select_placeholder: E('em', _('unspecified')),
			display_items: this.display_size || this.size || 3,
			dropdown_items: this.dropdown_size || this.size || 5,
			validate: L.bind(this.validate, this, section_id),
			create: !this.nocreate,
			create_markup: '' +
				'<li data-value="{{value}}">' +
					'<img title="'+_('Custom Interface')+': &quot;{{value}}&quot;" src="'+L.resource('icons/ethernet_disabled.svg')+'" />' +
					'<span class="hide-open">{{value}}</span>' +
					'<span class="hide-close">'+_('Custom Interface')+': "{{value}}"</span>' +
				'</li>'
		});

		return widget.render();
	},

}
