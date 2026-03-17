function __method_wrapper__() {
	_configure: function() {
		var me = this;
		var start = me.min;
		var offset = 0;

		core_scale.prototype._configure.call(me);

		if (start === 0) {
			start = me._getFirstTickValue(me.minNotZero);
			offset = valueOrDefault$b(me.options.ticks.fontSize, core_defaults.global.defaultFontSize) / me._length;
		}

		me._startValue = log10(start);
		me._valueOffset = offset;
		me._valueRange = (log10(me.max) - log10(start)) / (1 - offset);
	},

}
