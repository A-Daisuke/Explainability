function write_xls_props(wb, cfb) {
	var DSEntries = [], SEntries = [], CEntries = [];
	var i = 0, Keys;
	var DocSummaryRE = evert_key(DocSummaryPIDDSI, "n");
	var SummaryRE = evert_key(SummaryPIDSI, "n");
	if(wb.Props) {
		Keys = keys(wb.Props);
		// $FlowIgnore
		for(i = 0; i < Keys.length; ++i) (Object.prototype.hasOwnProperty.call(DocSummaryRE, Keys[i]) ? DSEntries : Object.prototype.hasOwnProperty.call(SummaryRE, Keys[i]) ? SEntries : CEntries).push([Keys[i], wb.Props[Keys[i]]]);
	}
	if(wb.Custprops) {
		Keys = keys(wb.Custprops);
		// $FlowIgnore
		for(i = 0; i < Keys.length; ++i) if(!Object.prototype.hasOwnProperty.call((wb.Props||{}), Keys[i])) (Object.prototype.hasOwnProperty.call(DocSummaryRE, Keys[i]) ? DSEntries : Object.prototype.hasOwnProperty.call(SummaryRE, Keys[i]) ? SEntries : CEntries).push([Keys[i], wb.Custprops[Keys[i]]]);
	}
	var CEntries2 = [];
	for(i = 0; i < CEntries.length; ++i) {
		if(XLSPSSkip.indexOf(CEntries[i][0]) > -1 || PseudoPropsPairs.indexOf(CEntries[i][0]) > -1) continue;
		if(CEntries[i][1] == null) continue;
		CEntries2.push(CEntries[i]);
	}
	if(SEntries.length) CFB.utils.cfb_add(cfb, "/\u0005SummaryInformation", write_PropertySetStream(SEntries, PSCLSID.SI, SummaryRE, SummaryPIDSI));
	if(DSEntries.length || CEntries2.length) CFB.utils.cfb_add(cfb, "/\u0005DocumentSummaryInformation", write_PropertySetStream(DSEntries, PSCLSID.DSI, DocSummaryRE, DocSummaryPIDDSI, CEntries2.length ? CEntries2 : null, PSCLSID.UDI));
}
