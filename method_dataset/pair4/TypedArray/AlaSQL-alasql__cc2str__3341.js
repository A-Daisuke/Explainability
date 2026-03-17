function cc2str(arr, debomit) {
	if(has_buf && Buffer.isBuffer(arr)) {
		if(debomit && buf_utf16le) {
			// TODO: temporary patch
			if(arr[0] == 0xFF && arr[1] == 0xFE) return utf8write(arr.slice(2).toString("utf16le"));
			if(arr[1] == 0xFE && arr[2] == 0xFF) return utf8write(utf16beread(arr.slice(2).toString("binary")));
		}
		return arr.toString("binary");
	}

	if(typeof TextDecoder !== "undefined") try {
		if(debomit) {
			if(arr[0] == 0xFF && arr[1] == 0xFE) return utf8write(new TextDecoder("utf-16le").decode(arr.slice(2)));
			if(arr[0] == 0xFE && arr[1] == 0xFF) return utf8write(new TextDecoder("utf-16be").decode(arr.slice(2)));
		}
		var rev = {
			"\u20ac": "\x80", "\u201a": "\x82", "\u0192": "\x83", "\u201e": "\x84",
			"\u2026": "\x85", "\u2020": "\x86", "\u2021": "\x87", "\u02c6": "\x88",
			"\u2030": "\x89", "\u0160": "\x8a", "\u2039": "\x8b", "\u0152": "\x8c",
			"\u017d": "\x8e", "\u2018": "\x91", "\u2019": "\x92", "\u201c": "\x93",
			"\u201d": "\x94", "\u2022": "\x95", "\u2013": "\x96", "\u2014": "\x97",
			"\u02dc": "\x98", "\u2122": "\x99", "\u0161": "\x9a", "\u203a": "\x9b",
			"\u0153": "\x9c", "\u017e": "\x9e", "\u0178": "\x9f"
		};
		if(Array.isArray(arr)) arr = new Uint8Array(arr);
		return new TextDecoder("latin1").decode(arr).replace(/[€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/g, function(c) { return rev[c] || c; });
	} catch(e) {}

	var o = [];
	for(var i = 0; i != arr.length; ++i) o.push(String.fromCharCode(arr[i]));
	return o.join("");
}
