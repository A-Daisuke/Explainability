function __method_wrapper__() {
	add(config, sectiontype, sectionname) {
		let num_sections_type = 0;
		let next_index = 0;

		for (const name in this.data) {
			num_sections_type += (this.data[name]['.type'] == sectiontype);
			next_index = Math.max(next_index, this.data[name]['.index']);
		}

		const section_id = sectionname ?? (sectiontype + num_sections_type);

		if (!this.data.hasOwnProperty(section_id)) {
			this.data[section_id] = {
				'.name': section_id,
				'.type': sectiontype,
				'.anonymous': (sectionname == null),
				'.index': next_index + 1
			};
		}

		return section_id;
	},

}
