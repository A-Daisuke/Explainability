function applyMask(addr, mask, v6) {
	const words = v6 ? validation.parseIPv6(addr) : validation.parseIPv4(addr);
	const bword = v6 ? 0xffff : 0xff;
	const bwlen = v6 ? 16 : 8;

	if (!words || mask < 0 || mask > (v6 ? 128 : 32))
		return null;

	for (let i = 0; i < words.length; i++) {
		const b = Math.min(mask, bwlen);
		words[i] &= (bword << (bwlen - b)) & bword;
		mask -= b;
	}

	return String.prototype.format.apply(
		v6 ? '%x:%x:%x:%x:%x:%x:%x:%x' : '%d.%d.%d.%d', words);
}
