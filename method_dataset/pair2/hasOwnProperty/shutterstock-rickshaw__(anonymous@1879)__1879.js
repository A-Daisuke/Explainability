function __method_wrapper__() {
			self.legend.lines.forEach( function(line) {

				// return reordered series to its original place
				if (l === line && line.hasOwnProperty('originalIndex')) {

					var series = self.graph.series.pop();
					self.graph.series.splice(line.originalIndex, 0, series);
					delete line.originalIndex;
				}

				var lineProperties = propertiesSafe[line.series.name];
				if (lineProperties) {
					line.series.color  = lineProperties.color;
					line.series.stroke = lineProperties.stroke;
				}
			} );

}
