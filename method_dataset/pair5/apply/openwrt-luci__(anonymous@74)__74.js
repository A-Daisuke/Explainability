function __method_wrapper__() {
			s.render = L.bind(function(view /*, ... */) {
				return form.NamedSection.prototype.render.apply(this, this.varargs(arguments, 1))
					.then(L.bind(function(node) {
						node.appendChild(E('div', { 'class': 'control-group' }, [
							E('button', {
								'class': 'btn cbi-button-action',
								'click': ui.createHandlerFn(view, 'option_install_kmod_lp', this.map),
								'disabled': have_kmod_lp || null,
								'title': _('Parallel port line printer device support'),
							}, [ 'kmod-lp' ]),
							' ',
							E('button', {
								'class': 'btn cbi-button-action',
								'click': ui.createHandlerFn(view, 'option_install_kmod_usb', this.map),
								'disabled': have_kmod_usb_printer || null,
								'title': _('For USB connected printers'),
							}, [ 'kmod-usb-printer' ])
						]));
						node.appendChild(E('br'));
						node.appendChild(E('br'));
						return node;
					}, this));
			}, s, this);

}
