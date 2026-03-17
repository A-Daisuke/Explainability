var bconcat = has_buf ? function(bufs) { return Buffer.concat(bufs.map(function(buf) { return Buffer.isBuffer(buf) ? buf : Buffer_from(buf); })); } : function(bufs) {
	if(typeof Uint8Array !== "undefined") {
		var i = 0, maxlen = 0;
		for(i = 0; i < bufs.length; ++i) maxlen += bufs[i].length;
		var o = new Uint8Array(maxlen);
		var len = 0;
		for(i = 0, maxlen = 0; i < bufs.length; maxlen += len, ++i) {
			len = bufs[i].length;
			if(bufs[i] instanceof Uint8Array) o.set(bufs[i], maxlen);
			else if(typeof bufs[i] == "string") o.set(new Uint8Array(s2a(bufs[i])), maxlen);
			else o.set(new Uint8Array(bufs[i]), maxlen);
		}
		return o;
	}
	return [].concat.apply([], bufs.map(function(buf) { return Array.isArray(buf) ? buf : [].slice.call(buf); }));
};
