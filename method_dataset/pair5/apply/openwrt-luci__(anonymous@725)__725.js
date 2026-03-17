function __method_wrapper__() {
			]).then(function(data) {
				var hostnames = [];

				uci.sections('ddns', 'service', function(s) {
					if (typeof(s?.lookup_host) == 'string' && s?.enabled == '1')
						hostnames.push(s.lookup_host);
				});

				uci.sections('system', 'system', function(s) {
					if (typeof(s?.hostname) == 'string' && s?.hostname?.indexOf('.') > 0)
						hostnames.push(s.hostname);
				});

				for (var i = 0; i < data[0].length; i++)
					hostnames.push.apply(hostnames, data[0][i].getIPAddrs().map(function(ip) { return ip.split('/')[0] }));

				for (var i = 0; i < data[1].length; i++)
					hostnames.push.apply(hostnames, data[1][i].getIP6Addrs().map(function(ip) { return ip.split('/')[0] }));

				var ips = [ '0.0.0.0/0', '::/0' ];

				var dns = [];

				var lan = data[2];
				if (lan) {
					var lanIp = lan.getIPAddr();
					if (lanIp) {
						dns.unshift(lanIp)
					}
				}

				var qrm, qrs, qro;

				qrm = new form.JSONMap({ config: { endpoint: hostnames[0], allowed_ips: ips, addresses: eips, dns_servers: dns } }, null, _('The generated configuration can be imported into a WireGuard client application to set up a connection towards this device.'));
				qrm.parent = parent;

				qrs = qrm.section(form.NamedSection, 'config');

				function handleConfigChange(ev, section_id, value) {
					var code = this.map.findElement('.qr-code'),
					    conf = this.map.findElement('.client-config'),
					    endpoint = this.section.getUIElement(section_id, 'endpoint'),
					    ips = this.section.getUIElement(section_id, 'allowed_ips');
					    eips = this.section.getUIElement(section_id, 'addresses');
					    dns = this.section.getUIElement(section_id, 'dns_servers');

					if (this.isValid(section_id)) {
						conf.firstChild.data = configGenerator(endpoint.getValue(), ips.getValue(), eips.getValue(), dns.getValue());
						code.style.opacity = '.5';

						buildSVGQRCode(conf.firstChild.data, code);
					}
				};

				qro = qrs.option(form.Value, 'endpoint', _('Connection endpoint'), _('The public hostname or IP address of this system the peer should connect to. This usually is a static public IP address, a static hostname or a DDNS domain.'));
				qro.datatype = 'or(ipaddr,hostname)';
				hostnames.forEach(function(hostname) { qro.value(hostname) });
				qro.onchange = handleConfigChange;

				qro = qrs.option(form.DynamicList, 'allowed_ips', _('Allowed IPs'), _('IP addresses that are allowed inside the tunnel. The peer will accept tunnelled packets with source IP addresses matching this list and route back packets with matching destination IP.'));
				qro.datatype = 'ipaddr';
				qro.default = ips;
				ips.forEach(function(ip) { qro.value(ip) });
				qro.onchange = handleConfigChange;

				qro = qrs.option(form.DynamicList, 'dns_servers', _('DNS Servers'), _('DNS servers for the remote clients using this tunnel to your openwrt device. Some wireguard clients require this to be set.'));
				qro.datatype = 'ipaddr';
				qro.default = dns;
				qro.onchange = handleConfigChange;

				qro = qrs.option(form.DynamicList, 'addresses', _('Addresses'), _('IP addresses for the peer to use inside the tunnel. Some clients require this setting.'));
				qro.datatype = 'ipaddr';
				qro.default = eips;
				eips.forEach(function(eip) { qro.value(eip) });
				qro.onchange = handleConfigChange;

				qro = qrs.option(form.DummyValue, 'output');
				qro.renderWidget = function() {
					var peer_config = configGenerator(hostnames[0], ips, eips, dns);

					var node = E('div', {
						'style': 'display:flex;flex-wrap:wrap;align-items:center;gap:.5em;width:100%'
					}, [
						E('div', {
							'class': 'qr-code',
							'style': 'width:320px;flex:0 1 320px;text-align:center'
						}, [
							E('em', { 'class': 'spinning' }, [ _('Generating QR code…') ])
						]),
						E('pre', {
							'class': 'client-config',
							'style': 'flex:1;white-space:pre;overflow:auto',
							'click': function(ev) {
								var sel = window.getSelection(),
								    range = document.createRange();

								range.selectNodeContents(ev.currentTarget);

								sel.removeAllRanges();
								sel.addRange(range);
							}
						}, [ peer_config ])
					]);

					buildSVGQRCode(peer_config, node.firstChild);

					return node;
				};

				return qrm.render().then(function(nodes) {
					mapNode.classList.add('hidden');
					mapNode.nextElementSibling.classList.add('hidden');

					headNode.appendChild(E('span', [ ' » ', _('Generate configuration') ]));
					mapNode.parentNode.appendChild(E([], [
						nodes,
						E('div', {
							'class': 'right'
						}, [
							E('button', {
								'class': 'btn',
								'click': function() {
									nodes.parentNode.removeChild(nodes.nextSibling);
									nodes.parentNode.removeChild(nodes);
									mapNode.classList.remove('hidden');
									mapNode.nextSibling.classList.remove('hidden');
									headNode.removeChild(headNode.lastChild);
								}
							}, [ _('Back to peer configuration') ])
						])
					]));

					if (!s.formvalue(s.section, 'listen_port')) {
						nodes.appendChild(E('div', { 'class': 'alert-message' }, [
							E('p', [
								_('No fixed interface listening port defined, peers might not be able to initiate connections to this WireGuard instance!')
							])
						]));
					}
				});
			});

}
