function __method_wrapper__() {
	encodeSvcParamValue(key, value) {
		switch (key) {
			case 'mandatory':
				const seen = new Set();
				const keys = value.split(',')
					.map(k => k.trim())
					.filter(k => {
						if (seen.has(k)) return false; // D3 Figure 16
						seen.add(k);
						return true;
					})
					.map(k => this.svcParamKeyToNumber(k))
					.filter(n => n != null)
					.filter(n => n != 0) // D3 Figure 15
					.sort((a, b) => a - b); // Ascending order - D2 Figure 9
				return keys.map(n => [(n >> 8) & 0xff, n & 0xff]).flat();

			case 'ech': // Assume ech is in base64
				return Array.prototype.map.call(atob(value), c => c.charCodeAt(0)); // OR Uint8Array.fromBase64(value)
			case 'alpn':
				/* (RFC 9460 §7.1.1 The wire-format value for "alpn" consists of
				at least one alpn-id prefixed by its length as a single octet */
				return value.split(',').map(v => {
					const len = v.length;
					return [len, ...[...v].map(c => c.charCodeAt(0))];
				}).flat();

			case 'no-default-alpn':
				return []; // zero-length value - D3 Figure 13

			case 'port': // D2 Figure 4
				const port = parseInt(value, 10);
				return [(port >> 8) & 0xff, port & 0xff];

			case 'ipv4hint':
				return value.split(',').map(ip => ip.trim().split('.').map(x => parseInt(x, 10))).flat();

			// case 'ech':
			// 	return value.match(/.{1,2}/g).map(b => parseInt(b, 16));

			case 'ipv6hint':
				return value.split(',').map(ip => {
					ip = ip.trim();

					// Check for IPv4-in-IPv6 (e.g. ::192.0.2.33) - D2 Figure 8
					let ipv4Tail = null;
					if (ip.match(/\d+\.\d+\.\d+\.\d+$/)) {
						const parts = ip.split(':');
						ipv4Tail = parts.pop(); // last part is IPv4
						ip = parts.join(':');

						const octets = ipv4Tail.split('.').map(n => parseInt(n, 10));
						if (octets.length !== 4) return null;

						const word1 = ((octets[0] << 8) | octets[1]).toString(16).padStart(4, '0');
						const word2 = ((octets[2] << 8) | octets[3]).toString(16).padStart(4, '0');

						ip += `:${word1}:${word2}`;
					}

					// Split and expand abbreviated ::
					let parts = ip.trim().split(':');
					// Expand shorthand :: into full 8-part address
					if (parts.includes('')) {
						const missing = 8 - parts.filter(p => p !== '').length;
						const expanded = [];
						for (let i = 0; i < parts.length; i++) {
							if (parts[i] === '' && (i === 0 || parts[i - 1] !== '')) {
								for (let j = 0; j < missing; j++) expanded.push('0000');
							} else if (parts[i] !== '') {
								expanded.push(parts[i].padStart(4, '0'));
							}
						}
						parts = expanded;
					} else {
						parts = parts.map(p => p.padStart(4, '0'));
					}
					return parts.map(p => [
						parseInt(p.slice(0, 2), 16),
						parseInt(p.slice(2, 4), 16)
					]).flat();
				}).flat();

			default:
				// Support custom keyNNNN = value (RFC 9461 §8)
				/* In wire format, the keys are represented by their numeric values
				in network byte order, concatenated in strictly increasing numeric order. */
				if (/^key\d{1,5}$/i.test(key)) {
					return value.split(',').map(v => {
						// interpret as ASCII text — one value or comma-separated
						return [...v].map(c => c.charCodeAt(0));
					}).flat();
				}
				return [];
		}
	},

}
