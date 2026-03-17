function __method_wrapper__() {
		series.forEach( function(series) {

			if (series.disabled) return;

			var barWidth = this.barWidth(series);

			var nodes = vis.selectAll("path")
				.data(series.stack.filter( function(d) { return d.y !== null } ))
				.enter().append("svg:rect")
				.attr("x", function(d) { return graph.x(d.x) + barXOffset })
				.attr("y", function(d) { return (graph.y(d.y0 + Math.abs(d.y))) * (d.y < 0 ? -1 : 1 ) })
				.attr("width", seriesBarWidth)
				.attr("height", function(d) { return graph.y.magnitude(Math.abs(d.y)) })
				.attr("opacity", series.opacity)
				.attr("transform", transform);

			Array.prototype.forEach.call(nodes[0], function(n) {
				n.setAttribute('fill', series.color);
			} );

			if (this.unstack) barXOffset += seriesBarWidth;

		}, this );

}
