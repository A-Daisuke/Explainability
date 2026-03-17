function __method_wrapper__() {
		]).then(function(data) {
			var netifd_ifaces = data[0],
			    board_json    = data[1],
			    luci_devs     = data[2];

			var s = {
				isTunnel: {}, isBridge: {}, isSwitch: {}, isWifi: {},
				ifaces: netifd_ifaces, radios: data[3], hosts: data[4],
				netdevs: {}, bridges: {}, switches: {}, hostapd: {}
			};

			for (var name in luci_devs) {
				var dev = luci_devs[name];

				if (isVirtualIfname(name))
					s.isTunnel[name] = true;

				if (!s.isTunnel[name] && isIgnoredIfname(name))
					continue;

				s.netdevs[name] = s.netdevs[name] || {
					idx:      dev.ifindex,
					name:     name,
					rawname:  name,
					flags:    dev.flags,
					link:     dev.link,
					stats:    dev.stats,
					macaddr:  dev.mac,
					type:     dev.type,
					devtype:  dev.devtype,
					mtu:      dev.mtu,
					qlen:     dev.qlen,
					wireless: dev.wireless,
					parent:   dev.parent,
					ipaddrs:  [],
					ip6addrs: []
				};

				if (Array.isArray(dev.ipaddrs))
					for (var i = 0; i < dev.ipaddrs.length; i++)
						s.netdevs[name].ipaddrs.push(dev.ipaddrs[i].address + '/' + dev.ipaddrs[i].netmask);

				if (Array.isArray(dev.ip6addrs))
					for (var i = 0; i < dev.ip6addrs.length; i++)
						s.netdevs[name].ip6addrs.push(dev.ip6addrs[i].address + '/' + dev.ip6addrs[i].netmask);
			}

			for (var name in luci_devs) {
				var dev = luci_devs[name];

				if (!dev.bridge)
					continue;

				var b = {
					name:    name,
					id:      dev.id,
					stp:     dev.stp,
					ifnames: []
				};

				for (var i = 0; dev.ports && i < dev.ports.length; i++) {
					var subdev = s.netdevs[dev.ports[i]];

					if (subdev == null)
						continue;

					b.ifnames.push(subdev);
					subdev.bridge = b;
				}

				s.bridges[name] = b;
				s.isBridge[name] = true;
			}

			for (var name in luci_devs) {
				var dev = luci_devs[name];

				if (!dev.parent || dev.devtype != 'dsa')
					continue;

				s.isSwitch[dev.parent] = true;
				s.isSwitch[name] = true;
			}

			if (L.isObject(board_json.switch)) {
				for (var switchname in board_json.switch) {
					var layout = board_json.switch[switchname],
					    netdevs = {},
					    nports = {},
					    ports = [],
					    pnum = null,
					    role = null;

					if (L.isObject(layout) && Array.isArray(layout.ports)) {
						for (var i = 0, port; (port = layout.ports[i]) != null; i++) {
							if (typeof(port) == 'object' && typeof(port.num) == 'number' &&
								(typeof(port.role) == 'string' || typeof(port.device) == 'string')) {
								var spec = {
									num:   port.num,
									role:  port.role || 'cpu',
									index: (port.index != null) ? port.index : port.num
								};

								if (port.device != null) {
									spec.device = port.device;
									spec.tagged = spec.need_tag;
									netdevs[port.num] = port.device;
								}

								ports.push(spec);

								if (port.role != null)
									nports[port.role] = (nports[port.role] || 0) + 1;
							}
						}

						ports.sort(function(a, b) {
							return L.naturalCompare(a.role, b.role) || L.naturalCompare(a.index, b.index);
						});

						for (var i = 0, port; (port = ports[i]) != null; i++) {
							if (port.role != role) {
								role = port.role;
								pnum = 1;
							}

							if (role == 'cpu')
								port.label = 'CPU (%s)'.format(port.device);
							else if (nports[role] > 1)
								port.label = '%s %d'.format(role.toUpperCase(), pnum++);
							else
								port.label = role.toUpperCase();

							delete port.role;
							delete port.index;
						}

						s.switches[switchname] = {
							ports: ports,
							netdevs: netdevs
						};
					}
				}
			}

			if (L.isObject(board_json.dsl) && L.isObject(board_json.dsl.modem)) {
				s.hasDSLModem = board_json.dsl.modem;
			}

			_init = null;

			var objects = [];

			if (L.isObject(s.radios))
				for (var radio in s.radios)
					if (L.isObject(s.radios[radio]) && Array.isArray(s.radios[radio].interfaces))
						for (var i = 0; i < s.radios[radio].interfaces.length; i++)
							if (L.isObject(s.radios[radio].interfaces[i]) && s.radios[radio].interfaces[i].ifname)
								objects.push('hostapd.%s'.format(s.radios[radio].interfaces[i].ifname));

			return (objects.length ? L.resolveDefault(rpc.list.apply(rpc, objects), {}) : Promise.resolve({})).then(function(res) {
				for (var k in res) {
					var m = k.match(/^hostapd\.(.+)$/);
					if (m)
						s.hostapd[m[1]] = res[k];
				}

				return (_state = s);
			});
		});

}
