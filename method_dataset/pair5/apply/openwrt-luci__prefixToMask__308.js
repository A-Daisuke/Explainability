function prefixToMask(bits, v6) {
	var w = v6 ? 128 : 32,
	    m = [];

	if (bits > w)
		return null;

	for (var i = 0; i < w / 16; i++) {
		var b = Math.min(16, bits);
		m.push((0xffff << (16 - b)) & 0xffff);
		bits -= b;
	}

	if (v6)
		return String.prototype.format.apply('%x:%x:%x:%x:%x:%x:%x:%x', m).replace(/:0(?::0)+$/, '::');
	else
		return '%d.%d.%d.%d'.format(m[0] >>> 8, m[0] & 0xff, m[1] >>> 8, m[1] & 0xff);
}
