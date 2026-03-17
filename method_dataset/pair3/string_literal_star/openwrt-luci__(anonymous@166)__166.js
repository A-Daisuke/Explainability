function __method_wrapper__() {
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
