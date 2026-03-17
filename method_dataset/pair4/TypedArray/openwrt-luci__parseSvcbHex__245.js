function __method_wrapper__() {
	parseSvcbHex(hex) {
		if (!hex) return null;

		let data = hex.replace(/[\s:]/g, '').toLowerCase();
		let buf = new Uint8Array(data.match(/.{2}/g).map(b => parseInt(b, 16)));
		let view = new DataView(buf.buffer);

		let offset = 0;

		// Parse priority
		if (buf.length < 2) return null;
		let priority = view.getUint16(offset);
		offset += 2;

		// Parse target name (DNS wire format)
		function parseName() {
			let labels = [];
			while (offset < buf.length) {
				let len = buf[offset++];
				if (len === 0) break;
				if (offset + len > buf.length) return null;
				let label = String.fromCharCode(...buf.slice(offset, offset + len));
				labels.push(label);
				offset += len;
			}
			return labels.join('.') + '.';
		}
		let target = parseName();
		if (target === null) return null;

		let svcParams = [];

		// Parse svcParams
		while (offset + 4 <= buf.length) {
			let key = view.getUint16(offset);
			let len = view.getUint16(offset + 2);
			offset += 4;

			if (offset + len > buf.length) break;

			let valBuf = buf.slice(offset, offset + len);
			offset += len;

			let keyname = this.svcParamKeyFromNumber(key);

			// Handle empty-value flag "no-default-alpn"
			if (keyname === 'no-default-alpn' && valBuf.length === 0) {
				svcParams.push(keyname);
			} else {
				let valstr = this.decodeSvcParamValue(keyname, valBuf);
				svcParams.push(`${keyname}=${valstr}`);
			}
		}

		return {
			priority,
			target,
			params: svcParams
		};
	},

}
