function __method_wrapper__() {
	this.ceil = function(time, unit) {

		var date, floor, year, offset;

		if (unit.name == 'day') {

			var nearFuture = new Date((time + unit.seconds - 1) * 1000);

			var rounded = new Date(0);
			rounded.setFullYear(nearFuture.getFullYear());
			rounded.setMonth(nearFuture.getMonth());
			rounded.setDate(nearFuture.getDate());
			rounded.setMilliseconds(0);
			rounded.setSeconds(0);
			rounded.setMinutes(0);
			rounded.setHours(0);

			return rounded.getTime() / 1000;
		}

		if (unit.name == 'month') {

			date = new Date(time * 1000);

			floor = new Date(date.getFullYear(), date.getMonth()).getTime() / 1000;
			if (floor == time) return time;

			year = date.getFullYear();
			var month = date.getMonth();

			if (month == 11) {
				month = 0;
				year = year + 1;
			} else {
				month += 1;
			}

			return new Date(year, month).getTime() / 1000;
		}

		if (unit.name == 'year') {

			date = new Date(time * 1000);

			floor = new Date(date.getUTCFullYear(), 0).getTime() / 1000;
			if (floor == time) return time;

			year = date.getFullYear() + 1;

			return new Date(year, 0).getTime() / 1000;
		}
		offset = new Date(time * 1000).getTimezoneOffset() * 60;
		return Math.ceil((time - offset) / unit.seconds) * unit.seconds + offset;
	};

}
