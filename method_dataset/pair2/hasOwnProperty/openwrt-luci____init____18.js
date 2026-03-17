class __C__ {
	__init__(data) {
		data = Object.assign({}, data);

		this.data = {};

		let num_sections = 0;
		const section_ids = [];

		for (const sectiontype in data) {
			if (!data.hasOwnProperty(sectiontype))
				continue;

			if (Array.isArray(data[sectiontype])) {
				for (let i = 0, index = 0; i < data[sectiontype].length; i++) {
					const item = data[sectiontype][i];
					let anonymous;
					let name;

					if (!L.isObject(item))
						continue;

					if (typeof(item['.name']) == 'string') {
						name = item['.name'];
						anonymous = false;
					}
					else {
						name = sectiontype + num_sections;
						anonymous = true;
					}

					if (!this.data.hasOwnProperty(name))
						section_ids.push(name);

					this.data[name] = Object.assign(item, {
						'.index': num_sections++,
						'.anonymous': anonymous,
						'.name': name,
						'.type': sectiontype
					});
				}
			}
			else if (L.isObject(data[sectiontype])) {
				this.data[sectiontype] = Object.assign(data[sectiontype], {
					'.anonymous': false,
					'.name': sectiontype,
					'.type': sectiontype
				});

				section_ids.push(sectiontype);
				num_sections++;
			}
		}

		section_ids.sort(L.bind((a, b) => {
			const indexA = (this.data[a]['.index'] != null) ? +this.data[a]['.index'] : 9999;
			const indexB = (this.data[b]['.index'] != null) ? +this.data[b]['.index'] : 9999;

			if (indexA != indexB)
				return (indexA - indexB);

			return L.naturalCompare(a, b);
		}, this));

		for (let i = 0; i < section_ids.length; i++)
			this.data[section_ids[i]]['.index'] = i;
	},

}
