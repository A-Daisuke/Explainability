const __obj__ = {
		action: function (e, dt, node, config) {
			var items = this.select.items();
			var mod = config.selectorModifier;
			
			if (mod) {
				if (typeof mod === 'function') {
					mod = mod.call(dt, e, dt, node, config);
				}

				this[items + 's'](mod).select();
			}
			else {
				this[items + 's']().select();
			}
		}

};
