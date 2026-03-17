class __C__ {
	transformDepList(section_id, deplist) {
		const list = deplist ?? this.deps;
		const deps = [];

		if (Array.isArray(list)) {
			for (let i = 0; i < list.length; i++) {
				const dep = {};

				for (const k in list[i]) {
					if (list[i].hasOwnProperty(k)) {
						if (k.charAt(0) === '!')
							dep[k] = list[i][k];
						else if (k.indexOf('.') !== -1)
							dep['cbid.%s'.format(k)] = list[i][k];
						else
							dep['cbid.%s.%s.%s'.format(
								this.uciconfig ?? this.section.uciconfig ?? this.map.config,
								this.ucisection ?? section_id,
								k
							)] = list[i][k];
					}
				}

				for (const k in dep) {
					if (dep.hasOwnProperty(k)) {
						deps.push(dep);
						break;
					}
				}
			}
		}

		return deps;
	},

}
