function __method_wrapper__() {
		o.cfgvalue = function(/* ... */) {
			var val = form.ListValue.prototype.cfgvalue.apply(this, arguments);

			switch (val || '') {
			case 'stable':
			case '0':
				return 'stable';

			case 'bandwidth':
			case '1':
				return 'bandwidth';

			case 'count':
			case '2':
				return 'count';

			default:
				return '';
			}
		};

}
