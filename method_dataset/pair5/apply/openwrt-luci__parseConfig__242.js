function __method_wrapper__() {
		ss.parseConfig = function(data) {
			var lines = String(data).split(/(\r?\n)+/),
			    section = null,
			    config = { peers: [] },
			    s;

			for (var i = 0; i < lines.length; i++) {
				var line = lines[i].replace(/#.*$/, '').trim();

				if (line.match(/^\[(\w+)\]$/)) {
					section = RegExp.$1.toLowerCase();

					if (section == 'peer')
						config.peers.push(s = {});
					else
						s = config;
				}
				else if (section && line.match(/^(\w+)\s*=\s*(.+)$/)) {
					var key = RegExp.$1,
					    val = RegExp.$2.trim();

					if (val.length)
						s[section + '_' + key.toLowerCase()] = val;
				}
			}

			if (config.interface_address) {
				config.interface_address = config.interface_address.split(/[, ]+/);

				for (var i = 0; i < config.interface_address.length; i++)
					if (!stubValidator.apply('ipaddr', config.interface_address[i]))
						return _('Address setting is invalid');
			}

			if (config.interface_dns) {
				config.interface_dns = config.interface_dns.split(/[, ]+/);

				for (var i = 0; i < config.interface_dns.length; i++)
					if (!stubValidator.apply('ipaddr', config.interface_dns[i], ['nomask']))
						return _('DNS setting is invalid');
			}

			if (!config.interface_privatekey || validateBase64(null, config.interface_privatekey) !== true)
				return _('PrivateKey setting is missing or invalid');

			if (!stubValidator.apply('port', config.interface_listenport || '0'))
				return _('ListenPort setting is invalid');

			for (var i = 0; i < config.peers.length; i++) {
				var pconf = config.peers[i];

				if (pconf.peer_publickey != null && validateBase64(null, pconf.peer_publickey) !== true)
					return _('PublicKey setting is invalid');

				if (pconf.peer_presharedkey != null && validateBase64(null, pconf.peer_presharedkey) !== true)
					return _('PresharedKey setting is invalid');

				if (pconf.peer_allowedips) {
					pconf.peer_allowedips = pconf.peer_allowedips.split(/[, ]+/);

					for (var j = 0; j < pconf.peer_allowedips.length; j++)
						if (!stubValidator.apply('ipaddr', pconf.peer_allowedips[j]))
							return _('AllowedIPs setting is invalid');
				}
				else {
					pconf.peer_allowedips = [ '0.0.0.0/0', '::/0' ];
				}

				if (pconf.peer_endpoint) {
					var host_port = pconf.peer_endpoint.match(/^\[([a-fA-F0-9:]+)\]:(\d+)$/) || pconf.peer_endpoint.match(/^(.+):(\d+)$/);

					if (!host_port || !stubValidator.apply('host', host_port[1]) || !stubValidator.apply('port', host_port[2]))
						return _('Endpoint setting is invalid');

					pconf.peer_endpoint = [ host_port[1], host_port[2] ];
				}

				if (pconf.peer_persistentkeepalive == 'off' || pconf.peer_persistentkeepalive == '0')
					delete pconf.peer_persistentkeepalive;

				if (!stubValidator.apply('port', pconf.peer_persistentkeepalive || '0'))
					return _('PersistentKeepAlive setting is invalid');
			}

			return config;
		};

}
