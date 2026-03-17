class __C__ {
	cloneOptions(src_section, dest_section) {
		for (let i = 0; i < src_section.children.length; i++) {
			const o1 = src_section.children[i];

			if (o1.modalonly === false && src_section === this)
				continue;

			let o2;

			if (o1.subsection) {
				o2 = dest_section.option(o1.constructor, o1.option, o1.subsection.constructor, o1.subsection.sectiontype, o1.subsection.title, o1.subsection.description);

				for (const k in o1.subsection) {
					if (!o1.subsection.hasOwnProperty(k))
						continue;

					switch (k) {
					case 'map':
					case 'children':
					case 'parentoption':
						continue;

					default:
						o2.subsection[k] = o1.subsection[k];
					}
				}

				this.cloneOptions(o1.subsection, o2.subsection);
			}
			else {
				o2 = dest_section.option(o1.constructor, o1.option, o1.title, o1.description);
			}

			for (const k in o1) {
				if (!o1.hasOwnProperty(k))
					continue;

				switch (k) {
				case 'map':
				case 'section':
				case 'option':
				case 'title':
				case 'description':
				case 'subsection':
					continue;

				default:
					o2[k] = o1[k];
				}
			}
		}
	},

}
