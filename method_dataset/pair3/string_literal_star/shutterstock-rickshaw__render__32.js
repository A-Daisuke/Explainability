function __method_wrapper__() {
	render: function(args) {

		args = args || {};

		var graph = this.graph;

		var series = args.series || graph.series;
		var vis = args.vis || graph.vis;

		var dotSize = this.dotSize;

		vis.selectAll('*').remove();

		var data = series
			.filter(function(s) { return !s.disabled })
			.map(function(s) { return s.stack });

		var nodes = vis.selectAll("path")
			.data(data)
			.enter().append("svg:path")
			.attr("d", this.seriesPathFactory());

		var i = 0;
		series.forEach(function(series) {
			if (series.disabled) return;
			series.path = nodes[0][i++];
			this._styleSeries(series);
		}, this);

		series.forEach(function(series) {

			if (series.disabled) return;

			var nodes = vis.selectAll("x")
				.data(series.stack.filter( function(d) { return d.y !== null } ))
				.enter().append("svg:circle")
				.attr("cx", function(d) { return graph.x(d.x) })
				.attr("cy", function(d) { return graph.y(d.y) })
				.attr("r", function(d) { return ("r" in d) ? d.r : dotSize});

			Array.prototype.forEach.call(nodes[0], function(n) {
				if (!n) return;
				n.setAttribute('data-color', series.color);
				n.setAttribute('fill', 'white');
				n.setAttribute('stroke', series.color);
				n.setAttribute('stroke-width', this.strokeWidth);

			}.bind(this));

		}, this);
	}

}
