function __method_wrapper__() {
		return initNetworkState().then(L.bind(function() {
			var devices = {};

			/* find simple devices */
			var uciInterfaces = uci.sections('network', 'interface');
			for (var i = 0; i < uciInterfaces.length; i++) {
				var ifnames = L.toArray(uciInterfaces[i].ifname);

				for (var j = 0; j < ifnames.length; j++) {
					if (ifnames[j].charAt(0) == '@')
						continue;

					if (isIgnoredIfname(ifnames[j]) || isVirtualIfname(ifnames[j]) || isWifiIfname(ifnames[j]))
						continue;

					devices[ifnames[j]] = this.instantiateDevice(ifnames[j]);
				}
			}

			for (var ifname in _state.netdevs) {
				if (devices.hasOwnProperty(ifname))
					continue;

				if (isIgnoredIfname(ifname) || isWifiIfname(ifname))
					continue;

				if (_state.netdevs[ifname].wireless)
					continue;

				devices[ifname] = this.instantiateDevice(ifname);
			}

			/* find VLAN devices */
			var uciSwitchVLANs = uci.sections('network', 'switch_vlan');
			for (var i = 0; i < uciSwitchVLANs.length; i++) {
				if (typeof(uciSwitchVLANs[i].ports) != 'string' ||
				    typeof(uciSwitchVLANs[i].device) != 'string' ||
				    !_state.switches.hasOwnProperty(uciSwitchVLANs[i].device))
					continue;

				var ports = uciSwitchVLANs[i].ports.split(/\s+/);
				for (var j = 0; j < ports.length; j++) {
					var m = ports[j].match(/^(\d+)([tu]?)$/);
					if (m == null)
						continue;

					var netdev = _state.switches[uciSwitchVLANs[i].device].netdevs[m[1]];
					if (netdev == null)
						continue;

					if (!devices.hasOwnProperty(netdev))
						devices[netdev] = this.instantiateDevice(netdev);

					_state.isSwitch[netdev] = true;

					if (m[2] != 't')
						continue;

					var vid = uciSwitchVLANs[i].vid || uciSwitchVLANs[i].vlan;
					    vid = (vid != null ? +vid : null);

					if (vid == null || vid < 0 || vid > 4095)
						continue;

					var vlandev = '%s.%d'.format(netdev, vid);

					if (!devices.hasOwnProperty(vlandev))
						devices[vlandev] = this.instantiateDevice(vlandev);

					_state.isSwitch[vlandev] = true;
				}
			}

			/* find bridge VLAN devices */
			var uciBridgeVLANs = uci.sections('network', 'bridge-vlan');
			for (var i = 0; i < uciBridgeVLANs.length; i++) {
				var basedev = uciBridgeVLANs[i].device,
				    local = uciBridgeVLANs[i].local,
				    alias = uciBridgeVLANs[i].alias,
				    vid = +uciBridgeVLANs[i].vlan,
				    ports = L.toArray(uciBridgeVLANs[i].ports);

				if (local == '0')
					continue;

				if (isNaN(vid) || vid < 0 || vid > 4095)
					continue;

				var vlandev = '%s.%s'.format(basedev, alias || vid);

				_state.isBridge[basedev] = true;

				if (!_state.bridges.hasOwnProperty(basedev))
					_state.bridges[basedev] = {
						name:    basedev,
						ifnames: []
					};

				if (!devices.hasOwnProperty(vlandev))
					devices[vlandev] = this.instantiateDevice(vlandev);

				ports.forEach(function(port_name) {
					var m = port_name.match(/^([^:]+)(?::[ut*]+)?$/),
					    p = m ? m[1] : null;

					if (!p)
						return;

					if (_state.bridges[basedev].ifnames.filter(function(sd) { return sd.name == p }).length)
						return;

					_state.netdevs[p] = _state.netdevs[p] || {
						name: p,
						ipaddrs: [],
						ip6addrs: [],
						type: 1,
						devtype: 'ethernet',
						stats: {},
						flags: {}
					};

					_state.bridges[basedev].ifnames.push(_state.netdevs[p]);
					_state.netdevs[p].bridge = _state.bridges[basedev];
				});
			}

			/* find wireless interfaces */
			var uciWifiIfaces = uci.sections('wireless', 'wifi-iface'),
			    networkCount = {};

			for (var i = 0; i < uciWifiIfaces.length; i++) {
				if (typeof(uciWifiIfaces[i].device) != 'string')
					continue;

				networkCount[uciWifiIfaces[i].device] = (networkCount[uciWifiIfaces[i].device] || 0) + 1;

				var netid = '%s.network%d'.format(uciWifiIfaces[i].device, networkCount[uciWifiIfaces[i].device]);

				devices[netid] = this.instantiateDevice(netid);
			}

			/* find uci declared devices */
			var uciDevices = uci.sections('network', 'device');

			for (var i = 0; i < uciDevices.length; i++) {
				var type = uciDevices[i].type,
				    name = uciDevices[i].name;

				if (!type || !name || devices.hasOwnProperty(name))
					continue;

				if (type == 'bridge')
					_state.isBridge[name] = true;

				devices[name] = this.instantiateDevice(name);
			}

			var rv = [];

			for (var netdev in devices)
				if (devices.hasOwnProperty(netdev))
					rv.push(devices[netdev]);

			rv.sort(deviceSort);

			return rv;
		}, this));

}
