class __C__ {
		error(type, fmt /*, ...*/) {
			try {
				LuCI.prototype.raise.apply(LuCI.prototype,
					Array.prototype.slice.call(arguments));
			}
			catch (e) {
				if (!e.reported) {
					if (classes.ui)
						classes.ui.addNotification(e.name || _('Runtime error'),
							E('pre', {}, e.message), 'danger');
					else
						DOM.content(document.querySelector('#maincontent'),
							E('pre', { 'class': 'alert-message error' }, e.message));

					e.reported = true;
				}

				throw e;
			}
		},

}
