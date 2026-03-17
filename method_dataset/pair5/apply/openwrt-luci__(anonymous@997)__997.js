function __method_wrapper__() {
	return new Promise(function(resolveFn, rejectFn) {
		var cmd = ev.target.getAttribute('data-command'),
		    pkg = ev.target.getAttribute('data-package'),
		    rem = document.querySelector('input[name="autoremove"]'),
		    owr = document.querySelector('input[name="overwrite"]'),
		    i18n = document.querySelector('input[name="i18ninstall"]');

		var dlg = ui.showModal(_('Executing package manager'), [
			E('p', { 'class': 'spinning' },
				_('Waiting for the <em>%s %h</em> command to complete…').format(L.hasSystemFeature('apk') ? 'apk' : 'opkg', cmd))
		]);

		var argv = [ cmd ];

		if (cmd == 'remove')
			argv.push('--force-removal-of-dependent-packages')

		if (rem && rem.checked)
			argv.push('--autoremove');

		if (owr && owr.checked)
			argv.push('--force-overwrite');

		if (i18n && i18n.checked)
			argv.push.apply(argv, i18n.getAttribute('data-packages').split(' '));

		if (pkg != null)
			argv.push(pkg);

		fs.exec_direct('/usr/libexec/package-manager-call', argv, 'json').then(function(res) {
			dlg.removeChild(dlg.lastChild);

			if (res.pkmcmd)
				dlg.appendChild(E('pre', [ res.pkmcmd ]));

			if (res.stdout)
				dlg.appendChild(E('pre', [ res.stdout ]));

			if (res.stderr) {
				dlg.appendChild(E('h5', _('Errors')));
				dlg.appendChild(E('pre', { 'class': 'errors' }, [ res.stderr ]));
			}

			if (res.code !== 0)
				dlg.appendChild(E('p', _('The <em>%s %h</em> command failed with code <code>%d</code>.').format(L.hasSystemFeature('apk') ? 'apk' : 'opkg', cmd, (res.code & 0xff) || -1)));

			dlg.appendChild(E('div', { 'class': 'button-row' },
				E('div', {
					'class': 'btn',
					'click': L.bind(function(res) {
						if (ui.menu && ui.menu.flushCache)
							ui.menu.flushCache();

						ui.hideModal();
						updateLists();

						if (res.code !== 0)
							rejectFn(new Error(res.stderr || '%s error %d'.format(L.hasSystemFeature('apk') ? 'apk' : 'opkg', res.code)));
						else
							resolveFn(res);
					}, this, res)
				}, _('Dismiss'))));
		}).catch(function(err) {
			ui.addNotification(null, E('p', _('Unable to execute <em>%s %s</em> command: %s').format(L.hasSystemFeature('apk') ? 'apk' : 'opkg', cmd, err)));
			ui.hideModal();
		});
	});

}
