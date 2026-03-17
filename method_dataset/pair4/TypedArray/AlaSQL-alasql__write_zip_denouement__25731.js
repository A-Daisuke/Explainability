function write_zip_denouement(z, o) {
	var oopts = {};
	var ftype = has_buf ? "nodebuffer" : (typeof Uint8Array !== "undefined" ? "array" : "string");
	if(o.compression) oopts.compression = 'DEFLATE';
	if(o.password) oopts.type = ftype;
	else switch(o.type) {
		case "base64": oopts.type = "base64"; break;
		case "binary": oopts.type = "string"; break;
		case "string": throw new Error("'string' output type invalid for '" + o.bookType + "' files");
		case "buffer":
		case "file": oopts.type = ftype; break;
		default: throw new Error("Unrecognized type " + o.type);
	}
	var out = z.FullPaths ? CFB.write(z, {fileType:"zip", type: {"nodebuffer": "buffer", "string": "binary"}[oopts.type] || oopts.type, compression: !!o.compression}) : z.generate(oopts);
	if(typeof Deno !== "undefined") {
		if(typeof out == "string") {
			if(o.type == "binary" || o.type == "base64") return out;
			out = new Uint8Array(s2ab(out));
		}
	}
/*jshint -W083 */
	if(o.password && typeof encrypt_agile !== 'undefined') return write_cfb_ctr(encrypt_agile(out, o.password), o); // eslint-disable-line no-undef
/*jshint +W083 */
	if(o.type === "file") return write_dl(o.file, out);
	return o.type == "string" ? utf8read(out) : out;
}
