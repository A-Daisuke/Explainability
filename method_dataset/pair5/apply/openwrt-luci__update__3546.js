class __C__ {
	update(data, placeholderText) {
		const placeholder = placeholderText ?? this.options.placeholder ?? _('No data', 'empty table placeholder');
		const sorting = this.getActiveSortState();

		if (!Array.isArray(data))
			return;

		const headings = [].slice.call(this.node.firstElementChild.querySelectorAll('th, .th'));

		if (sorting) {
			const list = data.map(L.bind((row) => {
				return [ this.deriveSortKey(row[sorting[0]], sorting[0]), row ];
			}, this));

			list.sort((a, b) => {
				return sorting[1]
					? -L.naturalCompare(a[0], b[0])
					: L.naturalCompare(a[0], b[0]);
			});

			data.length = 0;

			list.forEach(item => {
				data.push(item[1]);
			});

			headings.forEach((th, i) => {
				if (i == sorting[0])
					th.setAttribute('data-sort-direction', sorting[1] ? 'desc' : 'asc');
				else
					th.removeAttribute('data-sort-direction');
			});
		}

		this.data = data;
		this.placeholder = placeholder;

		let n = 0;
		const rows = this.node.querySelectorAll('tr, .tr');
		const trows = [];
		const captionClasses = this.options.captionClasses;
		const trTag = (rows[0] && rows[0].nodeName == 'DIV') ? 'div' : 'tr';
		const tdTag = (headings[0] && headings[0].nodeName == 'DIV') ? 'div' : 'td';

		data.forEach(row => {
			trows[n] = E(trTag, { 'class': 'tr' });

			for (let i = 0; i < headings.length; i++) {
				const text = (headings[i].innerText ?? '').trim();
				const raw_val = Array.isArray(row[i]) ? row[i][0] : null;
				const disp_val = Array.isArray(row[i]) ? row[i][1] : row[i];
				const td = trows[n].appendChild(E(tdTag, {
					'class': 'td',
					'data-title': (text !== '') ? text : null,
					'data-value': raw_val
				}, (disp_val != null) ? ((disp_val instanceof DocumentFragment) ? disp_val.cloneNode(true) : disp_val) : ''));

				if (typeof(captionClasses) == 'object')
					DOMTokenList.prototype.add.apply(td.classList, L.toArray(captionClasses[i]));

				if (!td.classList.contains('cbi-section-actions'))
					headings[i].setAttribute('data-sortable-row', true);
			}

			trows[n].classList.add('cbi-rowstyle-%d'.format((n++ % 2) ? 2 : 1));
		});

		for (let i = 0; i < n; i++) {
			if (rows[i+1])
				this.node.replaceChild(trows[i], rows[i+1]);
			else
				this.node.appendChild(trows[i]);
		}

		while (rows[++n])
			this.node.removeChild(rows[n]);

		if (placeholder && this.node.firstElementChild === this.node.lastElementChild) {
			const trow = this.node.appendChild(E(trTag, { 'class': 'tr placeholder' }));
			const td = trow.appendChild(E(tdTag, { 'class': 'td' }, placeholder));

			if (typeof(captionClasses) == 'object')
				DOMTokenList.prototype.add.apply(td.classList, L.toArray(captionClasses[0]));
		}

		return this.node;
	},

}
