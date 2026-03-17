function __method_wrapper__() {
		o.cfgvalue = function(/* ... */) {
			var val = form.ListValue.prototype.cfgvalue.apply(this, arguments);

			switch (val || '') {
			case 'always':
			case '0':
				return 'always';

			case 'better':
			case '1':
				return 'better';

			case 'failure':
			case '2':
				return 'failure';

			default:
				return 'always';
			}
		};

}
