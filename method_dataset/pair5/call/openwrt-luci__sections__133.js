function __method_wrapper__() {
	sections(config, sectiontype, callback) {
		const rv = [];

		for (const section_id in this.data)
			if (sectiontype == null || this.data[section_id]['.type'] == sectiontype)
				rv.push(this.data[section_id]);

		rv.sort((a, b) => { return a['.index'] - b['.index'] });

		if (typeof(callback) == 'function')
			for (let i = 0; i < rv.length; i++)
				callback.call(this, rv[i], rv[i]['.name']);

		return rv;
	},

}
