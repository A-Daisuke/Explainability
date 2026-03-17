function __method_wrapper__() {
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

}
