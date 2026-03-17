function __method_wrapper__() {
	populateIfacesOptions: function(s, tab, data) {
		var o;
		var net_devices = data[3];

		// Interfaces to listen on
		// This value: lldpd.init handles as a list value, and produces a CSV for lldpd.conf: 'configure system interface pattern'
		o = s.taboption(tab, lldpd.CBIMultiIOSelect, 'interface',
			_('Network IO'),
			_('Specify which interface (not) to listen upon and send LLDPDU from. ' +
			  'Absent any value, LLDPd uses all available physical interfaces.'));

		o.value('*');
		net_devices.forEach(nd => {
			o.value(nd.getName());
			o.value('!'+nd.getName());
			o.value('!!'+nd.getName());
		});
		o.value('!*:*');
		o.validate = validateioentries;

		// ChassisID interfaces
		// This value: lldpd.init handles as a list value, and produces a CSV for the -C param
		o = s.taboption(tab, lldpd.CBIMultiIOSelect, 'cid_interface',
			_('Network IO for chassis ID'),
			_('Specify which interfaces (not) to use for computing chassis ID. ' +
			  'Absent any value, all interfaces are considered. ' +
			  'LLDPd takes the first MAC address from all the considered ' +
			  'interfaces to compute the chassis ID.'));

		o.value('*');
		o.value('!*');
		net_devices.forEach(nd => {
			o.value(nd.getName());
			o.value('!'+nd.getName());
			o.value('!!'+nd.getName());
		});
		o.value('!*:*');
		o.validate = validateioentries;

	},

}
