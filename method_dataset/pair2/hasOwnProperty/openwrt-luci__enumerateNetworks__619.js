function enumerateNetworks() {
	var uciInterfaces = uci.sections('network', 'interface'),
	    networks = {};

	for (var i = 0; i < uciInterfaces.length; i++)
		networks[uciInterfaces[i]['.name']] = this.instantiateNetwork(uciInterfaces[i]['.name']);

	for (var i = 0; i < _state.ifaces.length; i++)
		if (networks[_state.ifaces[i].interface] == null)
			networks[_state.ifaces[i].interface] =
				this.instantiateNetwork(_state.ifaces[i].interface, _state.ifaces[i].proto);

	var rv = [];

	for (var network in networks)
		if (networks.hasOwnProperty(network))
			rv.push(networks[network]);

	rv.sort(networkSort);

	return rv;
}
