function parse_xlscfb(cfb, options) {
if(!options) options = {};
fix_read_opts(options);
reset_cp();
if(options.codepage) set_ansi(options.codepage);
var CompObj, WB;
if(cfb.FullPaths) {
	if(CFB.find(cfb, '/encryption')) throw new Error("File is password-protected");
	CompObj = CFB.find(cfb, '!CompObj');
	WB = CFB.find(cfb, '/Workbook') || CFB.find(cfb, '/Book');
} else {
	switch(options.type) {
		case 'base64': cfb = s2a(Base64_decode(cfb)); break;
		case 'binary': cfb = s2a(cfb); break;
		case 'buffer': break;
		case 'array': if(!Array.isArray(cfb)) cfb = Array.prototype.slice.call(cfb); break;
	}
	prep_blob(cfb, 0);
	WB = ({content: cfb});
}
var WorkbookP;

var _data;
if(CompObj) parse_compobj(CompObj);
if(options.bookProps && !options.bookSheets) WorkbookP = ({});
else {
	var T = has_buf ? 'buffer' : 'array';
	if(WB && WB.content) WorkbookP = parse_workbook(WB.content, options);
	/* Quattro Pro 7-8 */
	else if((_data=CFB.find(cfb, 'PerfectOffice_MAIN')) && _data.content) WorkbookP = WK_.to_workbook(_data.content, (options.type = T, options));
	/* Quattro Pro 9 */
	else if((_data=CFB.find(cfb, 'NativeContent_MAIN')) && _data.content) WorkbookP = WK_.to_workbook(_data.content, (options.type = T, options));
	/* Works 4 for Mac */
	else if((_data=CFB.find(cfb, 'MN0')) && _data.content) throw new Error("Unsupported Works 4 for Mac file");
	else throw new Error("Cannot find Workbook stream");
	if(options.bookVBA && cfb.FullPaths && CFB.find(cfb, '/_VBA_PROJECT_CUR/VBA/dir')) WorkbookP.vbaraw = make_vba_xls(cfb);
}

var props = {};
if(cfb.FullPaths) parse_xls_props(cfb, props, options);

WorkbookP.Props = WorkbookP.Custprops = props; /* TODO: split up properties */
if(options.bookFiles) WorkbookP.cfb = cfb;
/*WorkbookP.CompObjP = CompObjP; // TODO: storage? */
return WorkbookP;
}
