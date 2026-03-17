function __method_wrapper__() {
	set(conf, sid, opt, val) {
		const v = this.state.values;
		const n = this.state.creates;
		const c = this.state.changes;
		const d = this.state.deletes;

		sid = this.resolveSID(conf, sid);

		if (sid == null || opt == null || opt.charAt(0) == '.')
			return;

		if (n[conf]?.[sid]) {
			if (val != null)
				n[conf][sid][opt] = val;
			else
				delete n[conf][sid][opt];
		}
		else if (val != null && val !== '') {
			/* do not set within deleted section */
			if (d[conf] && d[conf][sid] === true)
				return;

			/* only set in existing sections */
			if (!v[conf]?.[sid])
				return;

			c[conf] ??= {};
			c[conf][sid] ??= {};

			/* undelete option */
			if (d[conf]?.[sid]) {
				if (isEmpty(d[conf][sid], opt))
					delete d[conf][sid];
				else
					delete d[conf][sid][opt];
			}

			c[conf][sid][opt] = val;
		}
		else {
			/* revert any change for to-be-deleted option */
			if (c[conf]?.[sid]) {
				if (isEmpty(c[conf][sid], opt))
					delete c[conf][sid];
				else
					delete c[conf][sid][opt];
			}

			/* only delete existing options */
			if (v[conf]?.[sid]?.hasOwnProperty(opt)) {
				d[conf] ??= { };
				d[conf][sid] ??= { };

				if (d[conf][sid] !== true)
					d[conf][sid][opt] = true;
			}
		}
	},

}
