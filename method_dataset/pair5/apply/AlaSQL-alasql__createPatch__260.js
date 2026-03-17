function __method_wrapper__() {
				createPatch: function (fileName, oldStr, newStr, oldHeader, newHeader) {
					var ret = [];

					ret.push('Index: ' + fileName);
					ret.push('===================================================================');
					ret.push('--- ' + fileName + (typeof oldHeader === 'undefined' ? '' : '\t' + oldHeader));
					ret.push('+++ ' + fileName + (typeof newHeader === 'undefined' ? '' : '\t' + newHeader));

					var diff = LineDiff.diff(oldStr, newStr);
					if (!diff[diff.length - 1].value) {
						diff.pop(); // Remove trailing newline add
					}
					diff.push({value: '', lines: []}); // Append an empty value to make cleanup easier

					function contextLines(lines) {
						return lines.map(function (entry) {
							return ' ' + entry;
						});
					}
					function eofNL(curRange, i, current) {
						var last = diff[diff.length - 2],
							isLast = i === diff.length - 2,
							isLastOfType =
								i === diff.length - 3 &&
								(current.added !== last.added || current.removed !== last.removed);

						// Figure out if this is the last line for the given file and missing NL
						if (!/\n$/.test(current.value) && (isLast || isLastOfType)) {
							curRange.push('\\ No newline at end of file');
						}
					}

					var oldRangeStart = 0,
						newRangeStart = 0,
						curRange = [],
						oldLine = 1,
						newLine = 1;
					for (var i = 0; i < diff.length; i++) {
						var current = diff[i],
							lines = current.lines || current.value.replace(/\n$/, '').split('\n');
						current.lines = lines;

						if (current.added || current.removed) {
							if (!oldRangeStart) {
								var prev = diff[i - 1];
								oldRangeStart = oldLine;
								newRangeStart = newLine;

								if (prev) {
									curRange = contextLines(prev.lines.slice(-4));
									oldRangeStart -= curRange.length;
									newRangeStart -= curRange.length;
								}
							}
							curRange.push.apply(
								curRange,
								lines.map(function (entry) {
									return (current.added ? '+' : '-') + entry;
								})
							);
							eofNL(curRange, i, current);

							if (current.added) {
								newLine += lines.length;
							} else {
								oldLine += lines.length;
							}
						} else {
							if (oldRangeStart) {
								// Close out any changes that have been output (or join overlapping)
								if (lines.length <= 8 && i < diff.length - 2) {
									// Overlapping
									curRange.push.apply(curRange, contextLines(lines));
								} else {
									// end the range and output
									var contextSize = Math.min(lines.length, 4);
									ret.push(
										'@@ -' +
											oldRangeStart +
											',' +
											(oldLine - oldRangeStart + contextSize) +
											' +' +
											newRangeStart +
											',' +
											(newLine - newRangeStart + contextSize) +
											' @@'
									);
									ret.push.apply(ret, curRange);
									ret.push.apply(ret, contextLines(lines.slice(0, contextSize)));
									if (lines.length <= 4) {
										eofNL(ret, i, current);
									}

									oldRangeStart = 0;
									newRangeStart = 0;
									curRange = [];
								}
							}
							oldLine += lines.length;
							newLine += lines.length;
						}
					}

					return ret.join('\n') + '\n';
				},

}
