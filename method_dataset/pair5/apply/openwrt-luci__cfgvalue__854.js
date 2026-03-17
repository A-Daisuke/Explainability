function __method_wrapper__() {
		o.cfgvalue = function(/* ... */) {
			var val = form.ListValue.prototype.cfgvalue.apply(this, arguments);

			switch (val || '') {
			case 'none':
			case '0':
				return 'none';

			case 'active':
			case '1':
				return 'active';

			case 'follow':
			case '2':
				return 'follow';

			default:
				return 'none';
			}
		};

}
