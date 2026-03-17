const __obj__ = {
				applyPatch: function (oldStr, uniDiff) {
					var diffstr = uniDiff.split('\n');
					var diff = [];
					var remEOFNL = false,
						addEOFNL = false;

					for (var i = diffstr[0][0] === 'I' ? 4 : 0; i < diffstr.length; i++) {
						if (diffstr[i][0] === '@') {
							var meh = diffstr[i].split(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/);
							diff.unshift({
								start: meh[3],
								oldlength: meh[2],
								oldlines: [],
								newlength: meh[4],
								newlines: [],
							});
						} else if (diffstr[i][0] === '+') {
							diff[0].newlines.push(diffstr[i].substr(1));
						} else if (diffstr[i][0] === '-') {
							diff[0].oldlines.push(diffstr[i].substr(1));
						} else if (diffstr[i][0] === ' ') {
							diff[0].newlines.push(diffstr[i].substr(1));
							diff[0].oldlines.push(diffstr[i].substr(1));
						} else if (diffstr[i][0] === '\\') {
							if (diffstr[i - 1][0] === '+') {
								remEOFNL = true;
							} else if (diffstr[i - 1][0] === '-') {
								addEOFNL = true;
							}
						}
					}

					var str = oldStr.split('\n');
					for (var i = diff.length - 1; i >= 0; i--) {
						var d = diff[i];
						for (var j = 0; j < d.oldlength; j++) {
							if (str[d.start - 1 + j] !== d.oldlines[j]) {
								return false;
							}
						}
						Array.prototype.splice.apply(str, [d.start - 1, +d.oldlength].concat(d.newlines));
					}

					if (remEOFNL) {
						while (!str[str.length - 1]) {
							str.pop();
						}
					} else if (addEOFNL) {
						str.push('');
					}
					return str.join('\n');
				},

};
