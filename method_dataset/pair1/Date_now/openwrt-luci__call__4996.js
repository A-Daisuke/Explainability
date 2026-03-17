			const call = (r, data, duration) => {
				if (Date.now() >= deadline) {
					window.clearTimeout(tt);
					UI.prototype.changes.rollback(checked);
					return;
				}
				else if (r.status === 200 || r.status === 204) {
					document.dispatchEvent(new CustomEvent('uci-applied'));

					UI.prototype.changes.setIndicator(0);
					UI.prototype.changes.displayStatus('notice',
						E('p', _('Configuration changes applied.')));

					window.clearTimeout(tt);
					window.setTimeout(() => {
						//UI.prototype.changes.displayStatus(false);
						window.location = window.location.href.split('#')[0];
					}, L.env.apply_display * 1000);

					return;
				}

				const delay = isNaN(duration) ? 0 : Math.max(1000 - duration, 0);
				window.setTimeout(() => {
					request.request(L.url('admin/uci/confirm'), {
						method: 'post',
						timeout: L.env.apply_timeout * 1000,
						query: UI.prototype.changes.confirm_auth
					}).then(call, call.bind(null, { status: 0, duration: 0 }));
				}, delay);
			};
