function __method_wrapper__() {
				}).then(r => {
					if (r.status === (checked ? 200 : 204)) {
						let tok = null; try { tok = r.json(); } catch(e) {}
						if (checked && tok !== null && typeof(tok) === 'object' && typeof(tok.token) === 'string')
							UI.prototype.changes.confirm_auth = tok;

						UI.prototype.changes.confirm(checked, Date.now() + L.env.apply_rollback * 1000);
					}
					else if (checked && r.status === 204) {
						UI.prototype.changes.displayStatus('notice',
							E('p', _('There are no changes to apply')));

						window.setTimeout(() => {
							UI.prototype.changes.displayStatus(false);
						}, L.env.apply_display * 1000);
					}
					else {
						UI.prototype.changes.displayStatus('warning',
							E('p', _('Apply request failed with status <code>%h</code>')
								.format(r.responseText ?? r.statusText ?? r.status)));

						window.setTimeout(() => {
							UI.prototype.changes.displayStatus(false);
						}, L.env.apply_display * 1000);
					}
				});

}
