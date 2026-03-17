function parse_zip(zip, opts) {
	make_ssf();
	opts = opts || {};
	fix_read_opts(opts);

	/* OpenDocument Part 3 Section 2.2.1 OpenDocument Package */
	if(safegetzipfile(zip, 'META-INF/manifest.xml')) return parse_ods(zip, opts);
	/* UOC */
	if(safegetzipfile(zip, 'objectdata.xml')) return parse_ods(zip, opts);
	/* Numbers */
	if(safegetzipfile(zip, 'Index/Document.iwa')) {
		if(typeof Uint8Array == "undefined") throw new Error('NUMBERS file parsing requires Uint8Array support');
		if(typeof parse_numbers_iwa != "undefined") {
			if(zip.FileIndex) return parse_numbers_iwa(zip, opts);
			var _zip = CFB.utils.cfb_new();
			zipentries(zip).forEach(function(e) { zip_add_file(_zip, e, getzipbin(zip, e)); });
			return parse_numbers_iwa(_zip, opts);
		}
		throw new Error('Unsupported NUMBERS file');
	}
	if(!safegetzipfile(zip, '[Content_Types].xml')) {
		if(safegetzipfile(zip, 'index.xml.gz')) throw new Error('Unsupported NUMBERS 08 file');
		if(safegetzipfile(zip, 'index.xml')) throw new Error('Unsupported NUMBERS 09 file');
		var index_zip = CFB.find(zip, 'Index.zip');
		if(index_zip) {
			opts = dup(opts);
			delete opts.type;
			if(typeof index_zip.content == "string") opts.type = "binary";
			// TODO: Bun buffer bug
			if(typeof Bun !== "undefined" && Buffer.isBuffer(index_zip.content)) return readSync(new Uint8Array(index_zip.content), opts);
			return readSync(index_zip.content, opts);
		}
		throw new Error('Unsupported ZIP file');
	}

	var entries = zipentries(zip);
	var dir = parse_ct((getzipstr(zip, '[Content_Types].xml')));
	var xlsb = false;
	var sheets, binname;
	if(dir.workbooks.length === 0) {
		binname = "xl/workbook.xml";
		if(getzipdata(zip,binname, true)) dir.workbooks.push(binname);
	}
	if(dir.workbooks.length === 0) {
		binname = "xl/workbook.bin";
		if(!getzipdata(zip,binname,true)) throw new Error("Could not find workbook");
		dir.workbooks.push(binname);
		xlsb = true;
	}
	if(dir.workbooks[0].slice(-3) == "bin") xlsb = true;

	var themes = ({});
	var styles = ({});
	if(!opts.bookSheets && !opts.bookProps) {
		strs = [];
		if(dir.sst) try { strs=parse_sst(getzipdata(zip, strip_front_slash(dir.sst)), dir.sst, opts); } catch(e) { if(opts.WTF) throw e; }

		if(opts.cellStyles && dir.themes.length) themes = parse_theme_xml(getzipstr(zip, dir.themes[0].replace(/^\//,''), true)||"", opts);

		if(dir.style) styles = parse_sty(getzipdata(zip, strip_front_slash(dir.style)), dir.style, themes, opts);
	}

	/*var externbooks = */dir.links.map(function(link) {
		try {
			var rels = parse_rels(getzipstr(zip, get_rels_path(strip_front_slash(link))), link);
			return parse_xlink(getzipdata(zip, strip_front_slash(link)), rels, link, opts);
		} catch(e) {}
	});

	var wb = parse_wb(getzipdata(zip, strip_front_slash(dir.workbooks[0])), dir.workbooks[0], opts);

	var props = {}, propdata = "";

	if(dir.coreprops.length) {
		propdata = getzipdata(zip, strip_front_slash(dir.coreprops[0]), true);
		if(propdata) props = parse_core_props(propdata);
		if(dir.extprops.length !== 0) {
			propdata = getzipdata(zip, strip_front_slash(dir.extprops[0]), true);
			if(propdata) parse_ext_props(propdata, props, opts);
		}
	}

	var custprops = {};
	if(!opts.bookSheets || opts.bookProps) {
		if (dir.custprops.length !== 0) {
			propdata = getzipstr(zip, strip_front_slash(dir.custprops[0]), true);
			if(propdata) custprops = parse_cust_props(propdata, opts);
		}
	}

	var out = ({});
	if(opts.bookSheets || opts.bookProps) {
		if(wb.Sheets) sheets = wb.Sheets.map(function pluck(x){ return x.name; });
		else if(props.Worksheets && props.SheetNames.length > 0) sheets=props.SheetNames;
		if(opts.bookProps) { out.Props = props; out.Custprops = custprops; }
		if(opts.bookSheets && typeof sheets !== 'undefined') out.SheetNames = sheets;
		if(opts.bookSheets ? out.SheetNames : opts.bookProps) return out;
	}
	sheets = {};

	var deps = {};
	if(opts.bookDeps && dir.calcchain) deps=parse_cc(getzipdata(zip, strip_front_slash(dir.calcchain)),dir.calcchain,opts);

	var i=0;
	var sheetRels = ({});
	var path, relsPath;

	{
		var wbsheets = wb.Sheets;
		props.Worksheets = wbsheets.length;
		props.SheetNames = [];
		for(var j = 0; j != wbsheets.length; ++j) {
			props.SheetNames[j] = wbsheets[j].name;
		}
	}

	var wbext = xlsb ? "bin" : "xml";
	var wbrelsi = dir.workbooks[0].lastIndexOf("/");
	var wbrelsfile = (dir.workbooks[0].slice(0, wbrelsi+1) + "_rels/" + dir.workbooks[0].slice(wbrelsi+1) + ".rels").replace(/^\//,"");
	if(!safegetzipfile(zip, wbrelsfile)) wbrelsfile = 'xl/_rels/workbook.' + wbext + '.rels';
	var wbrels = parse_rels(getzipstr(zip, wbrelsfile, true), wbrelsfile.replace(/_rels.*/, "s5s"));

	if((dir.metadata || []).length >= 1) {
		/* TODO: MDX and other types of metadata */
		opts.xlmeta = parse_xlmeta(getzipdata(zip, strip_front_slash(dir.metadata[0])),dir.metadata[0],opts);
	}

	if((dir.people || []).length >= 1) {
		opts.people = parse_people_xml(getzipdata(zip, strip_front_slash(dir.people[0])),opts);
	}

	if(wbrels) wbrels = safe_parse_wbrels(wbrels, wb.Sheets);

	/* Numbers iOS hack */
	var nmode = (getzipdata(zip,"xl/worksheets/sheet.xml",true))?1:0;
	wsloop: for(i = 0; i != props.Worksheets; ++i) {
		var stype = "sheet";
		if(wbrels && wbrels[i]) {
			path = 'xl/' + (wbrels[i][1]).replace(/[\/]?xl\//, "");
			if(!safegetzipfile(zip, path)) path = wbrels[i][1];
			if(!safegetzipfile(zip, path)) path = wbrelsfile.replace(/_rels\/.*$/,"") + wbrels[i][1];
			stype = wbrels[i][2];
		} else {
			path = 'xl/worksheets/sheet'+(i+1-nmode)+"." + wbext;
			path = path.replace(/sheet0\./,"sheet.");
		}
		relsPath = path.replace(/^(.*)(\/)([^\/]*)$/, "$1/_rels/$3.rels");
		if(opts && opts.sheets != null) switch(typeof opts.sheets) {
			case "number": if(i != opts.sheets) continue wsloop; break;
			case "string": if(props.SheetNames[i].toLowerCase() != opts.sheets.toLowerCase()) continue wsloop; break;
			default: if(Array.isArray && Array.isArray(opts.sheets)) {
				var snjseen = false;
				for(var snj = 0; snj != opts.sheets.length; ++snj) {
					if(typeof opts.sheets[snj] == "number" && opts.sheets[snj] == i) snjseen=1;
					if(typeof opts.sheets[snj] == "string" && opts.sheets[snj].toLowerCase() == props.SheetNames[i].toLowerCase()) snjseen = 1;
				}
				if(!snjseen) continue wsloop;
			}
		}
		safe_parse_sheet(zip, path, relsPath, props.SheetNames[i], i, sheetRels, sheets, stype, opts, wb, themes, styles);
	}

	out = ({
		Directory: dir,
		Workbook: wb,
		Props: props,
		Custprops: custprops,
		Deps: deps,
		Sheets: sheets,
		SheetNames: props.SheetNames,
		Strings: strs,
		Styles: styles,
		Themes: themes,
		SSF: dup(table_fmt)
	});
	if(opts && opts.bookFiles) {
		if(zip.files) {
			out.keys = entries;
			out.files = zip.files;
		} else {
			out.keys = [];
			out.files = {};
			zip.FullPaths.forEach(function(p, idx) {
				p = p.replace(/^Root Entry[\/]/, "");
				out.keys.push(p);
				out.files[p] = zip.FileIndex[idx];
			});
		}
	}
	if(opts && opts.bookVBA) {
		if(dir.vba.length > 0) out.vbaraw = getzipdata(zip,strip_front_slash(dir.vba[0]),true);
		else if(dir.defaults && dir.defaults.bin === CT_VBA) out.vbaraw = getzipdata(zip, 'xl/vbaProject.bin',true);
	}
	// TODO: pass back content types metdata for xlsm/xlsx resolution
	out.bookType = xlsb ? "xlsb" : "xlsx";
	return out;
}
