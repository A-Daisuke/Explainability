const __obj__ = {
	renderWidget: function(section_id, option_index, cfgvalue) {
		var widget = new ui.Dropdown(cfgvalue || ['-'], {
			'-': E([], [
				E('span', { 'class': 'hide-open', 'style': 'font-family:monospace' }, [ '—' ]),
				E('span', { 'class': 'hide-close' }, [ _('Not Member', 'VLAN port state') ])
			]),
			'u': E([], [
				E('span', { 'class': 'hide-open', 'style': 'font-family:monospace' }, [ 'U' ]),
				E('span', { 'class': 'hide-close' }, [ _('Untagged', 'VLAN port state') ])
			]),
			't': E([], [
				E('span', { 'class': 'hide-open', 'style': 'font-family:monospace' }, [ 'T' ]),
				E('span', { 'class': 'hide-close' }, [ _('Tagged', 'VLAN port state') ])
			]),
			'*': E([], [
				E('span', { 'class': 'hide-open', 'style': 'font-family:monospace' }, [ '*' ]),
				E('span', { 'class': 'hide-close' }, [ _('Is Primary VLAN', 'VLAN port state') ])
			])
		}, {
			id: this.cbid(section_id),
			sort: [ '-', 'u', 't', '*' ],
			optional: false,
			multiple: true
		});

		var field = this;

		widget.toggleItem = function(sb, li, force_state) {
			var lis = li.parentNode.querySelectorAll('li'),
			    toggle = ui.Dropdown.prototype.toggleItem;

			toggle.apply(this, [sb, li, force_state]);

			if (force_state != null)
				return;

			switch (li.getAttribute('data-value'))
			{
			case '-':
				if (li.hasAttribute('selected')) {
					for (var i = 0; i < lis.length; i++) {
						switch (lis[i].getAttribute('data-value')) {
						case '-':
							break;

						case '*':
							toggle.apply(this, [sb, lis[i], false]);
							lis[i].setAttribute('unselectable', '');
							break;

						default:
							toggle.apply(this, [sb, lis[i], false]);
						}
					}
				}
				break;

			case 't':
			case 'u':
				if (li.hasAttribute('selected')) {
					for (var i = 0; i < lis.length; i++) {
						switch (lis[i].getAttribute('data-value')) {
						case li.getAttribute('data-value'):
							break;

						case '*':
							lis[i].removeAttribute('unselectable');
							break;

						default:
							toggle.apply(this, [sb, lis[i], false]);
						}
					}
				}
				else {
					toggle.apply(this, [sb, li, true]);
				}
				break;

			case '*':
				if (li.hasAttribute('selected')) {
					var section_ids = field.section.cfgsections();

					for (var i = 0; i < section_ids.length; i++) {
						var other_widget = field.getUIElement(section_ids[i]),
						    other_value = L.toArray(other_widget.getValue());

						if (other_widget === this)
							continue;

						var new_value = other_value.filter(function(v) { return v != '*' });

						if (new_value.length == other_value.length)
							continue;

						other_widget.setValue(new_value);
						break;
					}
				}
			}
		};

		var node = widget.render();

		node.style.minWidth = '4em';

		if (cfgvalue == '-')
			node.querySelector('li[data-value="*"]').setAttribute('unselectable', '');

		return E('div', { 'style': 'display:inline-block' }, node);
	},

};
