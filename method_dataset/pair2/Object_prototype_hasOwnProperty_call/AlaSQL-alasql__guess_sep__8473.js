	function guess_sep(str) {
		var cnt = {}, instr = false, end = 0, cc = 0;
		for(;end < str.length;++end) {
			if((cc=str.charCodeAt(end)) == 0x22) instr = !instr;
			else if(!instr && cc in guess_seps) cnt[cc] = (cnt[cc]||0)+1;
		}

		cc = [];
		for(end in cnt) if ( Object.prototype.hasOwnProperty.call(cnt, end) ) {
			cc.push([ cnt[end], end ]);
		}

		if ( !cc.length ) {
			cnt = guess_sep_weights;
			for(end in cnt) if ( Object.prototype.hasOwnProperty.call(cnt, end) ) {
				cc.push([ cnt[end], end ]);
			}
		}

		cc.sort(function(a, b) { return a[0] - b[0] || guess_sep_weights[a[1]] - guess_sep_weights[b[1]]; });

		return guess_seps[cc.pop()[1]] || 0x2C;
	}
