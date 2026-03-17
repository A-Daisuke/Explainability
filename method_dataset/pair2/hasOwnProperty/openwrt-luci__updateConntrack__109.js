function __method_wrapper__() {
	updateConntrack: function(conn) {
		var lookup_queue = [ ];
		var rows = [];

		conn.sort(function(a, b) {
			return b.bytes - a.bytes;
		});

		for (var i = 0; i < conn.length; i++)
		{
			var c  = conn[i];

			if ((c.src == '127.0.0.1' && c.dst == '127.0.0.1') ||
				(c.src == '::1'       && c.dst == '::1'))
				continue;

			if (!dns_cache[c.src] && lookup_queue.indexOf(c.src) == -1)
				lookup_queue.push(c.src);

			if (!dns_cache[c.dst] && lookup_queue.indexOf(c.dst) == -1)
				lookup_queue.push(c.dst);

			var src = dns_cache[c.src] || (c.layer3 == 'ipv6' ? '[' + c.src + ']' : c.src);
			var dst = dns_cache[c.dst] || (c.layer3 == 'ipv6' ? '[' + c.dst + ']' : c.dst);

			const network = c.layer3.toUpperCase();
			const protocol = c.layer4.toUpperCase();
			const source ='%h'.format(c.hasOwnProperty('sport') ? (src + ':' + c.sport) : src);
			const destination = '%h'.format(c.hasOwnProperty('dport') ? (dst + ':' + c.dport) : dst);
			const transfer = [ c.bytes, '%1024.2mB (%d %s)'.format(c.bytes, c.packets, _('Pkts.')) ];

			if (filterText) {
				let filterTextExpressions = filterText.split(' ');
				if (filterTextExpressions.some((element) => element.toUpperCase() !== network && element.toUpperCase() !== protocol 
						&& !(c.src.includes(element) || source.includes(element))
						&& !(c.dst.includes(element) || destination.includes(element)))) {
					continue;
				}
			}

			rows.push([
				network,
				protocol,
				source,
				destination,
				transfer,
			]);
		}

		cbi_update_table('#connections', rows, E('em', _('No information available')));

		if (enableLookups && lookup_queue.length > 0) {
			var reduced_lookup_queue = lookup_queue;

			if (lookup_queue.length > 100)
				reduced_lookup_queue = lookup_queue.slice(0, 100);

			callNetworkRrdnsLookup(reduced_lookup_queue, 5000, 1000).then(function(replies) {
				for (var index in reduced_lookup_queue) {
					var address = reduced_lookup_queue[index];

					if (!address)
						continue;

					if (replies[address]) {
						dns_cache[address] = replies[address];
						lookup_queue.splice(reduced_lookup_queue.indexOf(address), 1);
						continue;
					}

					if (recheck_lookup_queue[address] > 2) {
						dns_cache[address] = (address.match(/:/)) ? '[' + address + ']' : address;
						lookup_queue.splice(index, 1);
					}
					else {
						recheck_lookup_queue[address] = (recheck_lookup_queue[address] || 0) + 1;
					}
				}

				var btn = document.querySelector('.btn.toggle-lookups');
				if (btn) {
					btn.firstChild.data = enableLookups ? _('Disable DNS lookups') : _('Enable DNS lookups');
					btn.classList.remove('spinning');
					btn.disabled = false;
				}
			});
		}
	},

}
