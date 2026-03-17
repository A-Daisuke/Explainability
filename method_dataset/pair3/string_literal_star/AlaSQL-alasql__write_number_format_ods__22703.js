function write_number_format_ods(nf/*:string*/, nfidx/*:string*/)/*:string*/ {
	var type = "number", payload = "", nopts = { "style:name": nfidx }, c = "", i = 0;
	nf = nf.replace(/"[$]"/g, "$");
	/* TODO: replace with an actual parser based on a real grammar */
	j: {
		// TODO: support style maps
		if(nf.indexOf(";") > -1) {
			console.error("Unsupported ODS Style Map exported.  Using first branch of " + nf);
			nf = nf.slice(0, nf.indexOf(";"));
		}

		if(nf == "@") { type = "text"; payload = "<number:text-content/>"; break j; }

		/* currency flag */
		if(nf.indexOf(/\$/) > -1) { type = "currency"; }

		/* opening string literal */
		if(nf[i] == '"') {
			c = "";
			while(nf[++i] != '"' || nf[++i] == '"') c += nf[i]; --i;
			if(nf[i+1] == "*") {
				i++;
				payload += '<number:fill-character>' + escapexml(c.replace(/""/g, '"')) + '</number:fill-character>';
			} else {
				payload += '<number:text>' + escapexml(c.replace(/""/g, '"')) + '</number:text>';
			}
			nf = nf.slice(i+1); i = 0;
		}

		/* fractions */
		var t = nf.match(/# (\?+)\/(\?+)/);
		if(t) { payload += writextag("number:fraction", null, {"number:min-integer-digits":0, "number:min-numerator-digits": t[1].length, "number:max-denominator-value": Math.max(+(t[1].replace(/./g, "9")), +(t[2].replace(/./g, "9"))) }); break j; }
		if((t=nf.match(/# (\?+)\/(\d+)/))) { payload += writextag("number:fraction", null, {"number:min-integer-digits":0, "number:min-numerator-digits": t[1].length, "number:denominator-value": +t[2]}); break j; }

		/* percentages */
		if((t=nf.match(/(\d+)(|\.\d+)%/))) { type = "percentage"; payload += writextag("number:number", null, {"number:decimal-places": t[2] && t.length - 1 || 0, "number:min-decimal-places": t[2] && t.length - 1 || 0, "number:min-integer-digits": t[1].length }) + "<number:text>%</number:text>"; break j; }

		/* datetime */
		var has_time = false;
		if(["y","m","d"].indexOf(nf[0]) > -1) {
			type = "date";
			k: for(; i < nf.length; ++i) switch((c = nf[i].toLowerCase())) {
				case "h": case "s": has_time = true; --i; break k;
				case "m":
					l: for(var h = i+1; h < nf.length; ++h) switch(nf[h]) {
						case "y": case "d": break l;
						case "h": case "s": has_time = true; --i; break k;
					}
					/* falls through */
				case "y": case "d":
					while((nf[++i]||"").toLowerCase() == c[0]) c += c[0]; --i;
					switch(c) {
						case "y": case "yy": payload += "<number:year/>"; break;
						case "yyy": case "yyyy": payload += '<number:year number:style="long"/>'; break;
						case "mmmmm": console.error("ODS has no equivalent of format |mmmmm|");
							/* falls through */
						case "m": case "mm": case "mmm": case "mmmm":
							payload += '<number:month number:style="' + (c.length % 2 ? "short" : "long") + '" number:textual="' + (c.length >= 3 ? "true" : "false") + '"/>';
							break;
						case "d": case "dd": payload += '<number:day number:style="' + (c.length % 2 ? "short" : "long") + '"/>'; break;
						case "ddd": case "dddd": payload += '<number:day-of-week number:style="' + (c.length % 2 ? "short" : "long") + '"/>'; break;
					}
					break;
				case '"':
					while(nf[++i] != '"' || nf[++i] == '"') c += nf[i]; --i;
					payload += '<number:text>' + escapexml(c.slice(1).replace(/""/g, '"')) + '</number:text>';
					break;
				case '/': payload += '<number:text>' + escapexml(c) + '</number:text>'; break;
				default: console.error("unrecognized character " + c + " in ODF format " + nf);
			}
			if(!has_time) break j;
			nf = nf.slice(i+1); i = 0;
		}
		if(nf.match(/^\[?[hms]/)) {
			if(type == "number") type = "time";
			if(nf.match(/\[/)) {
				nf = nf.replace(/[\[\]]/g, "");
				nopts['number:truncate-on-overflow'] = "false";
			}
			for(; i < nf.length; ++i) switch((c = nf[i].toLowerCase())) {
				case "h": case "m": case "s":
					while((nf[++i]||"").toLowerCase() == c[0]) c += c[0]; --i;
					switch(c) {
						case "h": case "hh": payload += '<number:hours number:style="' + (c.length % 2 ? "short" : "long") + '"/>'; break;
						case "m": case "mm": payload += '<number:minutes number:style="' + (c.length % 2 ? "short" : "long") + '"/>'; break;
						case "s": case "ss":
							if(nf[i+1] == ".") do { c += nf[i+1]; ++i; } while(nf[i+1] == "0");
							payload += '<number:seconds number:style="' + (c.match("ss") ? "long" : "short") + '"' + (c.match(/\./) ? ' number:decimal-places="' + (c.match(/0+/)||[""])[0].length + '"' : "")+ '/>'; break;
					}
					break;
				case '"':
					while(nf[++i] != '"' || nf[++i] == '"') c += nf[i]; --i;
					payload += '<number:text>' + escapexml(c.slice(1).replace(/""/g, '"')) + '</number:text>';
					break;
				case '/': payload += '<number:text>' + escapexml(c) + '</number:text>'; break;
				case "a":
					if(nf.slice(i, i+3).toLowerCase() == "a/p") { payload += '<number:am-pm/>'; i += 2; break; } // Note: ODF does not support A/P
					if(nf.slice(i, i+5).toLowerCase() == "am/pm")  { payload += '<number:am-pm/>'; i += 4; break; }
					/* falls through */
				default: console.error("unrecognized character " + c + " in ODF format " + nf);
			}
			break j;
		}

		/* currency flag */
		if(nf.indexOf(/\$/) > -1) { type = "currency"; }

		/* should be in a char loop */
		if(nf[0] == "$") { payload += '<number:currency-symbol number:language="en" number:country="US">$</number:currency-symbol>'; nf = nf.slice(1); i = 0; }
		i = 0; if(nf[i] == '"') {
			while(nf[++i] != '"' || nf[++i] == '"') c += nf[i]; --i;
			if(nf[i+1] == "*") {
				i++;
				payload += '<number:fill-character>' + escapexml(c.replace(/""/g, '"')) + '</number:fill-character>';
			} else {
				payload += '<number:text>' + escapexml(c.replace(/""/g, '"')) + '</number:text>';
			}
			nf = nf.slice(i+1); i = 0;
		}

		/* number TODO: interstitial text e.g. 000)000-0000 */
		var np = nf.match(/([#0][0#,]*)(\.[0#]*|)(E[+]?0*|)/i);
		if(!np || !np[0]) console.error("Could not find numeric part of " + nf);
		else {
			var base = np[1].replace(/,/g, "");
			payload += '<number:' + (np[3] ? "scientific-" : "")+ 'number' +
				' number:min-integer-digits="' + (base.indexOf("0") == -1 ? "0" : base.length - base.indexOf("0")) + '"' +
				(np[0].indexOf(",") > -1 ? ' number:grouping="true"' : "") +
				(np[2] && ' number:decimal-places="' + (np[2].length - 1) + '"' || ' number:decimal-places="0"') +
				(np[3] && np[3].indexOf("+") > -1 ? ' number:forced-exponent-sign="true"' : "" ) +
				(np[3] ? ' number:min-exponent-digits="' + np[3].match(/0+/)[0].length + '"' : "" ) +
				'>' +
				/* TODO: interstitial text placeholders */
				'</number:' + (np[3] ? "scientific-" : "") + 'number>';
			i = np.index + np[0].length;
		}

		/* residual text */
		if(nf[i] == '"') {
			c = "";
			while(nf[++i] != '"' || nf[++i] == '"') c += nf[i]; --i;
			payload += '<number:text>' + escapexml(c.replace(/""/g, '"')) + '</number:text>';
		}
	}

	if(!payload) { console.error("Could not generate ODS number format for |" + nf + "|"); return ""; }
	return writextag("number:" + type + "-style", payload, nopts);
}
