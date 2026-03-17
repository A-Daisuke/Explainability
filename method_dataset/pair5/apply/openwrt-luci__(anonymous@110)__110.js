function __method_wrapper__() {
			return Promise.all(tasks).then(L.bind(function(datasets) {
				for (var gi = 0; gi < graphPolls.length; gi++) {
					var ctx = graphPolls[gi],
					    data = datasets[gi],
					    values = ctx.values,
					    lines = ctx.lines,
					    info = ctx.info;

					var data_scale = 0;
					var data_wanted = Math.floor(ctx.width / ctx.step);
					var last_timestamp = NaN;

					for (var i = 0, di = 0; di < lines.length; di++) {
						if (lines[di] == null)
							continue;

						var multiply = (lines[di].multiply != null) ? lines[di].multiply : 1,
						    offset = (lines[di].offset != null) ? lines[di].offset : 0;

						for (var j = ctx.timestamp ? 0 : 1; j < data.length; j++) {
							/* skip overlapping entries */
							if (data[j][0] <= ctx.timestamp)
								continue;

							if (i == 0) {
								ctx.fill++;
								last_timestamp = data[j][0];
							}

							if (lines[di].counter) {
								/* normalize difference against time interval */
								if (j > 0) {
									var time_delta = data[j][0] - data[j - 1][0];
									if (time_delta) {
										info.line_current[i] = (data[j][di + 1] * multiply - data[j - 1][di + 1] * multiply) / time_delta;
										info.line_current[i] -= Math.min(info.line_current[i], offset);
										values[i].push(info.line_current[i]);
									}
								}
							}
							else {
								info.line_current[i] = data[j][di + 1] * multiply;
								info.line_current[i] -= Math.min(info.line_current[i], offset);
								values[i].push(info.line_current[i]);
							}
						}

						i++;
					}

					/* cut off outdated entries */
					ctx.fill = Math.min(ctx.fill, data_wanted);

					for (var i = 0; i < values.length; i++) {
						var len = values[i].length;
						values[i] = values[i].slice(len - data_wanted, len);

						/* find peaks, averages */
						info.line_peak[i] = NaN;
						info.line_average[i] = 0;

						for (var j = 0; j < values[i].length; j++) {
							info.line_peak[i] = isNaN(info.line_peak[i]) ? values[i][j] : Math.max(info.line_peak[i], values[i][j]);
							info.line_average[i] += values[i][j];
						}

						info.line_average[i] = info.line_average[i] / ctx.fill;
					}

					info.peak = Math.max.apply(Math, info.line_peak);

					/* remember current timestamp, calculate horizontal scale */
					if (!isNaN(last_timestamp))
						ctx.timestamp = last_timestamp;

					var size = Math.floor(Math.log2(info.peak)),
					    div = Math.pow(2, size - (size % 10)),
					    mult = info.peak / div,
					    mult = (mult < 5) ? 2 : ((mult < 50) ? 10 : ((mult < 500) ? 100 : 1000));

					info.peak = info.peak + (mult * div) - (info.peak % (mult * div));

					data_scale = ctx.height / info.peak;

					/* plot data */
					for (var i = 0, di = 0; di < lines.length; di++) {
						if (lines[di] == null)
							continue;

						var el = ctx.svg.firstElementChild.getElementById(lines[di].line),
						    pt = '0,' + ctx.height,
						    y = 0;

						if (!el)
							continue;

						for (var j = 0; j < values[i].length; j++) {
							var x = j * ctx.step;

							y = ctx.height - Math.floor(values[i][j] * data_scale);
							//y -= Math.floor(y % (1 / data_scale));

							y = isNaN(y) ? ctx.height : y;

							pt += ' ' + x + ',' + y;
						}

						pt += ' ' + ctx.width + ',' + y + ' ' + ctx.width + ',' + ctx.height;

						el.setAttribute('points', pt);

						i++;
					}

					info.label_25 = 0.25 * info.peak;
					info.label_50 = 0.50 * info.peak;
					info.label_75 = 0.75 * info.peak;

					if (typeof(ctx.cb) == 'function')
						ctx.cb(ctx.svg, info);
				}
			}, this));

}
