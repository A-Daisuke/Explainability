const __obj__ = {
	render: function(args) {

		args = args || {};

		var graph = this.graph;

		var series = args.series || graph.series;
		var vis = args.vis || graph.vis;

		var dotSize = this.dotSize;

		vis.selectAll('*').remove();

		series.forEach( function(series) {

			if (series.disabled) return;
			var opacity = series.opacity === undefined ? 1 : series.opacity;

			var nodes = vis.selectAll("path")
				.data(series.stack.filter( function(d) { return d.y !== null } ))
				.enter().append("svg:circle")
					.attr("cx", function(d) { return graph.x(d.x) })
					.attr("cy", function(d) { return graph.y(d.y) })
					.attr("r", function(d) { return ("r" in d) ? d.r : dotSize})
					.attr("opacity", function(d) { return ("opacity" in d) ? d.opacity : opacity});
			if (series.className) {
				nodes.classed(series.className, true);
			}

			Array.prototype.forEach.call(nodes[0], function(n) {
				n.setAttribute('fill', series.color);
			} );

		}, this );
	}

};
