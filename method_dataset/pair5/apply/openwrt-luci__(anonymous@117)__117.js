function __method_wrapper__() {
		go.write = L.bind(function(protocol, section_id, value) {
			const port = parseInt(value);
			const ip_protocol = protocol.formvalue(section_id);

			const addr = [];

			if (ip_protocol.match(/ipv4/g))
				addr.push('UDP:%d'.format(port));

			if (ip_protocol.match(/ipv6/g))
				addr.push('UDP6:%d'.format(port));

			if (addr.length > 0) {
				const s = uci.get_first('snmpd', 'agent');
				if (s)
					uci.set('snmpd', s['.name'], 'agentaddress', addr.join(','));
			}

			return form.Value.prototype.write.apply(this, [section_id, value]);
		}, go, this.ip_protocol);

}
