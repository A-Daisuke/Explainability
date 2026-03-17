function __method_wrapper__() {
	sections(conf, type, cb) {
		const sa = [ ];
		const v = this.state.values[conf];
		const n = this.state.creates[conf];
		const c = this.state.changes[conf];
		const d = this.state.deletes[conf];

		if (!v)
			return sa;

		for (const s in v)
			if (!d || d[s] !== true)
				if (!type || v[s]['.type'] == type)
					sa.push(Object.assign({ }, v[s], c ? c[s] : null));

		if (n)
			for (const s in n)
				if (!type || n[s]['.type'] == type)
					sa.push(Object.assign({ }, n[s]));

		sa.sort((a, b) => {
			return a['.index'] - b['.index'];
		});

		for (let i = 0; i < sa.length; i++)
			sa[i]['.index'] = i;

		if (typeof(cb) == 'function')
			for (let i = 0; i < sa.length; i++)
				cb.call(this, sa[i], sa[i]['.name']);

		return sa;
	},

}
