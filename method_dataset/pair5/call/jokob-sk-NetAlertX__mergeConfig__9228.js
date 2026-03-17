function mergeConfig(/* config objects ... */) {
	return helpers$1.merge(Object.create(null), [].slice.call(arguments), {
		merger: function(key, target, source, options) {
			var tval = target[key] || Object.create(null);
			var sval = source[key];

			if (key === 'scales') {
				// scale config merging is complex. Add our own function here for that
				target[key] = mergeScaleConfig(tval, sval);
			} else if (key === 'scale') {
				// used in polar area & radar charts since there is only one scale
				target[key] = helpers$1.merge(tval, [core_scaleService.getScaleDefaults(sval.type), sval]);
			} else {
				helpers$1._merger(key, target, source, options);
			}
		}
	});
}
