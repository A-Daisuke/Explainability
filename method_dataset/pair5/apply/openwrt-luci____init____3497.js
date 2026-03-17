function __method_wrapper__() {
	__init__(captions, options, placeholder) {
		if (!Array.isArray(captions)) {
			this.initFromMarkup(captions);

			return;
		}

		const id = options.id ?? 'table%08x'.format(Math.random() * 0xffffffff);

		const table = E('table', { 'id': id, 'class': 'table' }, [
			E('tr', { 'class': 'tr table-titles', 'click': UI.prototype.createHandlerFn(this, 'handleSort') })
		]);

		this.id = id;
		this.node = table
		this.options = options;

		const sorting = this.getActiveSortState();

		for (let i = 0; i < captions.length; i++) {
			if (captions[i] == null)
				continue;

			const th = E('th', { 'class': 'th' }, [ captions[i] ]);

			if (typeof(options.captionClasses) == 'object')
				DOMTokenList.prototype.add.apply(th.classList, L.toArray(options.captionClasses[i]));

			if (options.sortable !== false && (typeof(options.sortable) != 'object' || options.sortable[i] !== false)) {
				th.setAttribute('data-sortable-row', true);

				if (sorting && sorting[0] == i)
					th.setAttribute('data-sort-direction', sorting[1] ? 'desc' : 'asc');
			}

			table.firstElementChild.appendChild(th);
		}

		if (placeholder) {
			const trow = table.appendChild(E('tr', { 'class': 'tr placeholder' }));
			const td = trow.appendChild(E('td', { 'class': 'td' }, placeholder));

			if (typeof(captionClasses) == 'object')
				DOMTokenList.prototype.add.apply(td.classList, L.toArray(captionClasses[0]));
		}

		DOMTokenList.prototype.add.apply(table.classList, L.toArray(options.classes));
	},

}
