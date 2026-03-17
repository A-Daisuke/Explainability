function __method_wrapper__() {
		displayChanges() {
			const list = E('div', { 'class': 'uci-change-list' });

			const dlg = UI.prototype.showModal(`${_('Configuration')} / ${_('Changes')}`, [
			E('div', { 'class': 'cbi-section' }, [
				E('strong', _('Legend:')),
				E('div', { 'class': 'uci-change-legend' }, [
					E('div', { 'class': 'uci-change-legend-label' }, [
						E('ins', '&#160;'), ' ', _('Section added') ]),
					E('div', { 'class': 'uci-change-legend-label' }, [
						E('del', '&#160;'), ' ', _('Section removed') ]),
					E('div', { 'class': 'uci-change-legend-label' }, [
						E('var', {}, E('ins', '&#160;')), ' ', _('Option changed') ]),
					E('div', { 'class': 'uci-change-legend-label' }, [
						E('var', {}, E('del', '&#160;')), ' ', _('Option removed') ])]),
				E('br'), list,
				E('div', { 'class': 'button-row' }, [
					E('button', {
						'class': 'btn cbi-button',
						'click': UI.prototype.hideModal
					}, [ _('Close') ]), ' ',
					new UIComboButton('0', {
						0: [ _('Save & Apply') ],
						1: [ _('Apply unchecked') ]
					}, {
						classes: {
							0: 'btn cbi-button cbi-button-positive important',
							1: 'btn cbi-button cbi-button-negative important'
						},
						click: L.bind((ev, mode) => { this.apply(mode == '0') }, this)
					}).render(), ' ',
					E('button', {
						'class': 'btn cbi-button cbi-button-reset',
						'click': L.bind(this.revert, this)
					}, [ _('Revert') ])])])
		]);

			for (const config in this.changes) {
				if (!this.changes.hasOwnProperty(config))
					continue;

				list.appendChild(E('h5', '# /etc/config/%s'.format(config)));

				for (let i = 0, added = null; i < this.changes[config].length; i++) {
					const chg = this.changes[config][i];
					const tpl = this.changeTemplates['%s-%d'.format(chg[0], chg.length)];

					list.appendChild(E(tpl.replace(/%([01234])/g, (m0, m1) => {
						switch (+m1) {
						case 0:
							return config;

						case 2:
							if (added != null && chg[1] == added[0])
								return `@${added[1]}[-1]`;
							else
								return chg[1];

						case 4:
							return "'%h'".format(chg[3].replace(/'/g, "'\"'\"'"));

						default:
							return chg[m1-1];
						}
					})));

					if (chg[0] == 'add')
						added = [ chg[1], chg[2] ];
				}
			}

			list.appendChild(E('br'));
			dlg.classList.add('uci-dialog');
		},

}
