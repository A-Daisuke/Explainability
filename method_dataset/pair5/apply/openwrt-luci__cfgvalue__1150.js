function __method_wrapper__() {
		o.cfgvalue = function(/* ... */) {
			var val = form.ListValue.prototype.cfgvalue.apply(this, arguments);

			switch (val || '') {
			case 'loose':
			case '1':
				return 'loose';

			case 'strict':
			case '2':
				return 'strict';

			default:
				return '';
			}
		};

}
