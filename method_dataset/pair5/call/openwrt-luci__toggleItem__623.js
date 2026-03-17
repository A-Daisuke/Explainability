function __method_wrapper__() {
			widget.toggleItem = function(sb, li) {
				var value = li.getAttribute('data-value'),
				    toggleFn = ui.Dropdown.prototype.toggleItem;

				toggleFn.call(this, sb, li);

				if (value == 'all') {
					var items = li.parentNode.querySelectorAll('li[data-value]');

					for (var j = 0; j < items.length; j++)
						if (items[j] !== li)
							toggleFn.call(this, sb, items[j], false);
				}
				else {
					toggleFn.call(this, sb, li.parentNode.querySelector('li[data-value="all"]'), false);
				}
			};

}
