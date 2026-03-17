function __method_wrapper__() {
		o.cfgvalue = function(/* ... */) {
			var val = form.ListValue.prototype.cfgvalue.apply(this, arguments);

			switch (val || '') {
			case 'arp':
			case '1':
				return 'arp';

			case 'mii':
			case '2':
				return 'mii';

			default:
				return 'mii';
			}
		};

}
