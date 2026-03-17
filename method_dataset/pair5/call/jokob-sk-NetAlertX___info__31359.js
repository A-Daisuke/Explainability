function __method_wrapper__() {
	_info: function () {
		if (!this.s.dt.oFeatures.bInfo) {
			return;
		}

		var dt = this.s.dt,
			dtApi = this.s.dtApi,
			language = dt.oLanguage,
			info = dtApi.page.info(),
			total = info.recordsDisplay,
			max = info.recordsTotal;

		// If the scroll type is `cont` (continuous) we need to use `baseRowTop`, which
		// also means we need to work out the difference between the current scroll position
		// and the "base" for when it was required
		var diffRows = (this.s.lastScrollTop - this.s.baseScrollTop) / this.s.heights.row;
		var start = Math.floor(this.s.baseRowTop + diffRows) + 1;

		// For a jump scroll type, we just use the straightforward calculation based on
		// `topRowFloat`
		if (this.s.scrollType === 'jump') {
			start = Math.floor(this.s.topRowFloat) + 1;
		}

		var
			possibleEnd = start + Math.floor(this.s.heights.viewport / this.s.heights.row),
			end = possibleEnd > total ? total : possibleEnd,
			result;

		if (total === 0 && total == max) {
			/* Empty record set */
			result = language.sInfoEmpty + language.sInfoPostFix;
		}
		else if (total === 0) {
			// Empty record set after filtering
			result =
				language.sInfoEmpty +
				' ' +
				language.sInfoFiltered +
				language.sInfoPostFix;
		}
		else if (total == max) {
			// Normal record set
			result = language.sInfo + language.sInfoPostFix;
		}
		else {
			// Record set after filtering
			result = language.sInfo + ' ' + language.sInfoFiltered + language.sInfoPostFix;
		}

		result = this._macros(result, start, end, max, total);

		var callback = language.fnInfoCallback;
		if (callback) {
			result = callback.call(
				dt.oInstance,
				dt,
				start,
				end,
				max,
				total,
				result
			);
		}

		// DT 1.x features
		var n = dt.aanFeatures.i;
		if (typeof n != 'undefined') {
			for (var i = 0, iLen = n.length; i < iLen; i++) {
				$(n[i]).html(result);
			}

			$(dt.nTable).triggerHandler('info.dt');
		}

		// DT 2.x features
		$('div.dt-info', dtApi.table().container()).each(function () {
			$(this).html(result);
			dtApi.trigger('info', [dtApi.settings()[0], this, result]);
		});
	},

}
