function __method_wrapper__() {
	pie: function(id, data) {
		var total = data.reduce(function(n, d) { return n + d.value }, 0);

		data.sort(function(a, b) { return b.value - a.value });

		if (total === 0)
			data = [{
				value: 1,
				color: '#cccccc',
				label: [ _('no traffic') ]
			}];

		for (var i = 0; i < data.length; i++) {
			if (!data[i].color) {
				var hue = 120 / (data.length-1) * i;
				data[i].color = 'hsl(%u, 80%%, 50%%)'.format(hue);
				data[i].label.push(hue);
			}
		}

		var node = L.dom.elem(id) ? id : document.getElementById(id),
		    key = L.dom.elem(id) ? id.id : id,
		    ctx = node.getContext('2d');

		if (chartRegistry.hasOwnProperty(key))
			chartRegistry[key].destroy();

		chartRegistry[key] = new Chart(ctx).Doughnut(data, {
			segmentStrokeWidth: 1,
			percentageInnerCutout: 30
		});

		return chartRegistry[key];
	},

}
