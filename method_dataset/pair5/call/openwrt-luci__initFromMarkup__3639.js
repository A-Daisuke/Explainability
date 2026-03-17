class __C__ {
	initFromMarkup(node) {
		if (!dom.elem(node))
			node = document.querySelector(node);

		if (!node)
			throw 'Invalid table selector';

		const options = {};
		const headrow = node.querySelector('tr, .tr');

		if (!headrow)
			return;

		options.id = node.id;
		options.classes = [].slice.call(node.classList).filter(c => c != 'table');
		options.sortable = [];
		options.captionClasses = [];

		headrow.querySelectorAll('th, .th').forEach((th, i) => {
			options.sortable[i] = !th.classList.contains('cbi-section-actions');
			options.captionClasses[i] = [].slice.call(th.classList).filter(c => c != 'th');
		});

		headrow.addEventListener('click', UI.prototype.createHandlerFn(this, 'handleSort'));

		this.id = node.id;
		this.node = node;
		this.options = options;
	},

}
