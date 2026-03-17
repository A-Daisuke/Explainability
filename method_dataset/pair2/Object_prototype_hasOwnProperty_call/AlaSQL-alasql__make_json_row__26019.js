function make_json_row(sheet/*:Worksheet*/, r/*:Range*/, R/*:number*/, cols/*:Array<string>*/, header/*:number*/, hdr/*:Array<any>*/, o/*:Sheet2JSONOpts*/)/*:MJRObject*/ {
	var rr = encode_row(R);
	var defval = o.defval, raw = o.raw || !Object.prototype.hasOwnProperty.call(o, "raw");
	var isempty = true, dense = (sheet["!data"] != null);
	var row/*:any*/ = (header === 1) ? [] : {};
	if(header !== 1) {
		if(Object.defineProperty) try { Object.defineProperty(row, '__rowNum__', {value:R, enumerable:false}); } catch(e) { row.__rowNum__ = R; }
		else row.__rowNum__ = R;
	}
	if(!dense || sheet["!data"][R]) for (var C = r.s.c; C <= r.e.c; ++C) {
		var val = dense ? (sheet["!data"][R]||[])[C] : sheet[cols[C] + rr];
		if(val === undefined || val.t === undefined) {
			if(defval === undefined) continue;
			if(hdr[C] != null) { row[hdr[C]] = defval; }
			continue;
		}
		var v = val.v;
		switch(val.t){
			case 'z': if(v == null) break; continue;
			case 'e': v = (v == 0 ? null : void 0); break;
			case 's': case 'd': case 'b': case 'n': break;
			default: throw new Error('unrecognized type ' + val.t);
		}
		if(hdr[C] != null) {
			if(v == null) {
				if(val.t == "e" && v === null) row[hdr[C]] = null;
				else if(defval !== undefined) row[hdr[C]] = defval;
				else if(raw && v === null) row[hdr[C]] = null;
				else continue;
			} else {
				row[hdr[C]] = raw && (val.t !== "n" || (val.t === "n" && o.rawNumbers !== false)) ? v : format_cell(val,v,o);
			}
			if(v != null) isempty = false;
		}
	}
	return { row: row, isempty: isempty };
}
