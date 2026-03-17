function __method_wrapper__() {
		o.cfgvalue = function(/* ... */) {
			var val = form.ListValue.prototype.cfgvalue.apply(this, arguments);

			switch (val || '') {
			case 'slow':
			case '0':
				return 'slow';

			case 'fast':
			case '1':
				return 'fast';

			default:
				return '';
			}
		};

}
