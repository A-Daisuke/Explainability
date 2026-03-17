const __obj__ = {
	_resolveDataElementOptions: function(point, index) {
		var me = this;
		var chart = me.chart;
		var dataset = me.getDataset();
		var custom = point.custom || {};
		var data = dataset.data[index] || {};
		var values = core_datasetController.prototype._resolveDataElementOptions.apply(me, arguments);

		// Scriptable options
		var context = {
			chart: chart,
			dataIndex: index,
			dataset: dataset,
			datasetIndex: me.index
		};

		// In case values were cached (and thus frozen), we need to clone the values
		if (me._cachedDataOpts === values) {
			values = helpers$1.extend({}, values);
		}

		// Custom radius resolution
		values.radius = resolve$1([
			custom.radius,
			data.r,
			me._config.radius,
			chart.options.elements.point.radius
		], context, index);

		return values;
	}

};
