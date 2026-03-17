function __method_wrapper__() {
	this.validateSeries = function(series) {

		if (!Array.isArray(series) && !(series instanceof Rickshaw.Series)) {
			var seriesSignature = Object.prototype.toString.apply(series);
			throw "series is not an array: " + seriesSignature;
		}

		var pointsCount;

		series.forEach( function(s) {

			if (!(s instanceof Object)) {
				throw "series element is not an object: " + s;
			}
			if (!(s.data)) {
				throw "series has no data: " + JSON.stringify(s);
			}
			if (!Array.isArray(s.data)) {
				throw "series data is not an array: " + JSON.stringify(s.data);
			}

			if (s.data.length > 0) {
				var x = s.data[0].x;
				var y = s.data[0].y;

				if (typeof x != 'number' || ( typeof y != 'number' && y !== null ) ) {
					throw "x and y properties of points should be numbers instead of " +
						(typeof x) + " and " + (typeof y);
				}
			}

			if (s.data.length >= 3) {
				// probe to sanity check sort order
				if (s.data[2].x < s.data[1].x || s.data[1].x < s.data[0].x || s.data[s.data.length - 1].x < s.data[0].x) {
					throw "series data needs to be sorted on x values for series name: " + s.name;
				}
			}

		}, this );
	};

}
