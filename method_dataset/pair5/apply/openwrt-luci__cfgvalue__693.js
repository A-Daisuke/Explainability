function __method_wrapper__() {
		o.cfgvalue = function(/* ... */) {
			var val = form.ListValue.prototype.cfgvalue.apply(this, arguments);

			switch (val || '') {
			case 'layer2':
			case '0':
				return 'layer2';

			case 'layer2+3':
			case '1':
				return 'layer2+3';

			case 'layer3+4':
			case '2':
				return 'layer3+4';

			case 'encap2+3':
			case '4':
				return 'encap2+3';

			case 'encap3+4':
			case '5':
				return 'encap3+4';

			default:
				return '';
			}
		};

}
