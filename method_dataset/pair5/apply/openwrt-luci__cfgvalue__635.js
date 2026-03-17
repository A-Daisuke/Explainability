function __method_wrapper__() {
		o.cfgvalue = function(/* ... */) {
			var val = form.ListValue.prototype.cfgvalue.apply(this, arguments);

			switch (val || '') {
			case 'active-backup':
			case '0':
				return 'active-backup';

			case 'balance-rr':
			case '1':
				return 'balance-rr';

			case 'balance-xor':
			case '2':
				return 'balance-xor';

			case 'broadcast':
			case '3':
				return 'broadcast';

			case '802.3ad':
			case '4':
				return '802.3ad';

			case 'balance-tlb':
			case '5':
				return 'balance-tlb';

			case 'balance-alb':
			case '6':
				return 'balance-alb';

			default:
				return 'balance-rr';
			}
		};

}
