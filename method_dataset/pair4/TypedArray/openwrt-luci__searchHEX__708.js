function __method_wrapper__() {
	searchHEX(pattern) {
		// Remove spaces and validate hex string
		const cleanedPattern = pattern.replace(/\s+/g, '');
		if (!/^[0-9a-fA-F]+$/.test(cleanedPattern)) {
			throw new Error('Invalid HEX pattern.');
		}
		if (cleanedPattern.length % 2 !== 0) {
			throw new Error('HEX pattern length must be even.');
		}

		// Convert hex string to byte array
		const bytePattern = new Uint8Array(cleanedPattern.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

		for (let i = 0; i <= this.data.length - bytePattern.length; i++) {
			let found = true;
			for (let j = 0; j < bytePattern.length; j++) {
				if (this.data[i + j] !== bytePattern[j]) {
					found = false;
					break;
				}
			}
			if (found) {
				this.matches.push({
					index: i,
					length: bytePattern.length
				});
			}
		}
		console.log(`searchHEX: Found ${this.matches.length} matches.`);
	}

}
