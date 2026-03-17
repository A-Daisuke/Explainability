const __obj__ = {
	renderWidget: function(section_id, option_index, cfgvalue) {
		var values = L.toArray((cfgvalue != null) ? cfgvalue : this.default),
		    isOutputOnly = false,
		    choices = {};

		if (this.option == 'dest') {
			for (var i = 0; i < this.section.children.length; i++) {
				var opt = this.section.children[i];
				if (opt.option == 'src') {
					var val = opt.cfgvalue(section_id) || opt.default;
					isOutputOnly = (val == null || val == '');
					break;
				}
			}

			this.title = isOutputOnly ? _('Output zone') :  _('Destination zone');
		}

		if (this.allowlocal) {
			choices[''] = E('span', {
				'class': 'zonebadge',
				'style': firewall.getZoneColorStyle(null)
			}, [
				E('strong', _('Device')),
				(this.allowany || this.allowlocal)
					? E('span', ' (%s)'.format(this.option != 'dest' ? _('output') : _('input'))) : ''
			]);
		}
		else if (!this.multiple && (this.rmempty || this.optional)) {
			choices[''] = E('span', {
				'class': 'zonebadge',
				'style': firewall.getZoneColorStyle(null)
			}, E('em', _('unspecified')));
		}

		if (this.allowany) {
			choices['*'] = E('span', {
				'class': 'zonebadge',
				'style': firewall.getZoneColorStyle(null)
			}, [
				E('strong', _('Any zone')),
				(this.allowany && this.allowlocal && !isOutputOnly) ? E('span', ' (%s)'.format(_('forward'))) : ''
			]);
		}

		for (var i = 0; i < this.zones.length; i++) {
			var zone = this.zones[i],
			    name = zone.getName(),
			    networks = zone.getNetworks(),
			    ifaces = [];

			if (!this.filter(section_id, name))
				continue;

			for (var j = 0; j < networks.length; j++) {
				var network = this.lookupNetwork(networks[j]);

				if (!network)
					continue;

				var span = E('span', {
					'class': 'ifacebadge' + (network.isUp() ? ' ifacebadge-active' : '')
				}, network.getName() + ': ');

				var devices = getDevices(network);

				for (var k = 0; k < devices.length; k++) {
					span.appendChild(E('img', {
						'title': devices[k].getI18n(),
						'src': L.resource('icons/%s%s.svg'.format(devices[k].getType(), devices[k].isUp() ? '' : '_disabled'))
					}));
				}

				if (!devices.length)
					span.appendChild(E('em', _('(empty)')));

				ifaces.push(span);
			}

			if (!ifaces.length)
				ifaces.push(E('em', _('(empty)')));

			choices[name] = E('span', {
				'class': 'zonebadge',
				'style': firewall.getZoneColorStyle(zone)
			}, [ E('strong', name) ].concat(ifaces));
		}

		var widget = new ui.Dropdown(values, choices, {
			id: this.cbid(section_id),
			sort: true,
			multiple: this.multiple,
			optional: this.optional || this.rmempty,
			disabled: (this.readonly != null) ? this.readonly : this.map.readonly,
			select_placeholder: E('em', _('unspecified')),
			display_items: this.display_size || this.size || 3,
			dropdown_items: this.dropdown_size || this.size || 5,
			validate: L.bind(this.validate, this, section_id),
			datatype: L.hasSystemFeature('firewall4')
				? ( this.multiple ? 'list(or(uciname,"*"))' : 'or(uciname,"*")' )
				: this.multiple ? 'list(or(and(uciname,maxlength(11)),"*"))' : 'or(and(uciname,maxlength(11)),"*")',
			create: !this.nocreate,
			create_markup: '' +
				'<li data-value="{{value}}">' +
					'<span class="zonebadge" style="background:repeating-linear-gradient(45deg,rgba(204,204,204,0.5),rgba(204,204,204,0.5) 5px,rgba(255,255,255,0.5) 5px,rgba(255,255,255,0.5) 10px)">' +
						'<strong>{{value}}:</strong> <em>('+_('create')+')</em>' +
					'</span>' +
				'</li>'
		});

		var elem = widget.render();

		if (this.option == 'src') {
			elem.addEventListener('cbi-dropdown-change', L.bind(function(ev) {
				var opt = this.map.lookupOption('dest', section_id),
				    val = ev.detail.instance.getValue();

				if (opt == null)
					return;

				var cbid = opt[0].cbid(section_id),
				    label = document.querySelector('label[for="widget.%s"]'.format(cbid)),
				    node = document.getElementById(cbid);

				L.dom.content(label, val == '' ? _('Output zone') : _('Destination zone'));

				if (val == '') {
					if (L.dom.callClassMethod(node, 'getValue') == '')
						L.dom.callClassMethod(node, 'setValue', '*');

					var emptyval = node.querySelector('[data-value=""]'),
					    anyval = node.querySelector('[data-value="*"]');

					L.dom.content(anyval.querySelector('span'), E('strong', _('Any zone')));

					if (emptyval != null)
						emptyval.parentNode.removeChild(emptyval);
				}
				else {
					const anyval = node.querySelector('[data-value="*"]') || '';
					const emptyval = node.querySelector('[data-value=""]') || '';

					if (emptyval == null && anyval) {
						emptyval = anyval.cloneNode(true);
						emptyval.removeAttribute('display');
						emptyval.removeAttribute('selected');
						emptyval.setAttribute('data-value', '');
					}

					if (opt[0]?.allowlocal && emptyval)
						L.dom.content(emptyval.querySelector('span'), [
							E('strong', _('Device')), E('span', ' (%s)'.format(_('input')))
						]);
					if (opt[0]?.allowany && anyval && emptyval) {
						L.dom.content(anyval.querySelector('span'), [
							E('strong', _('Any zone')), E('span', ' (%s)'.format(_('forward')))
						]);

						anyval.parentNode.insertBefore(emptyval, anyval);
					}
				}

			}, this));
		}
		else if (isOutputOnly) {
			var emptyval = elem.querySelector('[data-value=""]');
			emptyval.parentNode.removeChild(emptyval);
		}

		return elem;
	},

};
