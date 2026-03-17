function readSync(data/*:RawData*/, opts/*:?ParseOpts*/)/*:Workbook*/ {
	reset_cp();
	var o = opts||{};
	if(o.codepage && typeof $cptable === "undefined") console.error("Codepage tables are not loaded.  Non-ASCII characters may not give expected results");
	if(typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) return readSync(new Uint8Array(data), (o = dup(o), o.type = "array", o));
	if(typeof Uint8Array !== 'undefined' && data instanceof Uint8Array && !o.type) o.type = typeof Deno !== "undefined" ? "buffer" : "array";
	var d = data, n = [0,0,0,0], str = false;
	if(o.cellStyles) { o.cellNF = true; o.sheetStubs = true; }
	_ssfopts = {};
	if(o.dateNF) _ssfopts.dateNF = o.dateNF;
	if(!o.type) o.type = (has_buf && Buffer.isBuffer(data)) ? "buffer" : "base64";
	if(o.type == "file") { o.type = has_buf ? "buffer" : "binary"; d = read_binary(data); if(typeof Uint8Array !== 'undefined' && !has_buf) o.type = "array"; }
	if(o.type == "string") { str = true; o.type = "binary"; o.codepage = 65001; d = bstrify(data); }
	if(o.type == 'array' && typeof Uint8Array !== 'undefined' && data instanceof Uint8Array && typeof ArrayBuffer !== 'undefined') {
		// $FlowIgnore
		var ab=new ArrayBuffer(3), vu=new Uint8Array(ab); vu.foo="bar";
		// $FlowIgnore
		if(!vu.foo) {o=dup(o); o.type='array'; return readSync(ab2a(d), o);}
	}
	switch((n = firstbyte(d, o))[0]) {
		case 0xD0: if(n[1] === 0xCF && n[2] === 0x11 && n[3] === 0xE0 && n[4] === 0xA1 && n[5] === 0xB1 && n[6] === 0x1A && n[7] === 0xE1) return read_cfb(CFB.read(d, o), o); break;
		case 0x09: if(n[1] <= 0x08) return parse_xlscfb(d, o); break;
		case 0x3C: return parse_xlml(d, o);
		case 0x49:
			if(n[1] === 0x49 && n[2] === 0x2a && n[3] === 0x00) throw new Error("TIFF Image File is not a spreadsheet");
			if(n[1] === 0x44) return read_wb_ID(d, o);
			break;
		case 0x54: if(n[1] === 0x41 && n[2] === 0x42 && n[3] === 0x4C) return DIF.to_workbook(d, o); break;
		case 0x50: return (n[1] === 0x4B && n[2] < 0x09 && n[3] < 0x09) ? read_zip(d, o) : read_prn(data, d, o, str);
		case 0xEF: return n[3] === 0x3C ? parse_xlml(d, o) : read_prn(data, d, o, str);
		case 0xFF:
			if(n[1] === 0xFE) { return read_utf16(d, o); }
			else if(n[1] === 0x00 && n[2] === 0x02 && n[3] === 0x00) return WK_.to_workbook(d, o);
			break;
		case 0x00:
			if(n[1] === 0x00) {
				if(n[2] >= 0x02 && n[3] === 0x00) return WK_.to_workbook(d, o);
				if(n[2] === 0x00 && (n[3] === 0x08 || n[3] === 0x09)) return WK_.to_workbook(d, o);
			}
			break;
		case 0x03: case 0x83: case 0x8B: case 0x8C: return DBF.to_workbook(d, o);
		case 0x7B: if(n[1] === 0x5C && n[2] === 0x72 && n[3] === 0x74) return rtf_to_workbook(d, o); break;
		case 0x0A: case 0x0D: case 0x20: return read_plaintext_raw(d, o);
		case 0x89: if(n[1] === 0x50 && n[2] === 0x4E && n[3] === 0x47) throw new Error("PNG Image File is not a spreadsheet"); break;
		case 0x08: if(n[1] === 0xE7) throw new Error("Unsupported Multiplan 1.x file!"); break;
		case 0x0C:
			if(n[1] === 0xEC) throw new Error("Unsupported Multiplan 2.x file!");
			if(n[1] === 0xED) throw new Error("Unsupported Multiplan 3.x file!");
			break;
	}
	if(DBF_SUPPORTED_VERSIONS.indexOf(n[0]) > -1 && n[2] <= 12 && n[3] <= 31) return DBF.to_workbook(d, o);
	return read_prn(data, d, o, str);
}
