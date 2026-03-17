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

			case 'backup':
			case '2':
				return 'backup';

			case 'all':
			case '3':
				return 'all';

			case 'filter':
			case '4':
				return 'filter';

			case 'filter_active':
			case '5':
				return 'filter_active';

			case 'filter_backup':
			case '6':
				return 'filter_backup';

			default:
				return 'none';
			}
		};

}
