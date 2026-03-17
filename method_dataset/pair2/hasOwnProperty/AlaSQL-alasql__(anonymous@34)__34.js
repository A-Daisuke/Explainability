function __method_wrapper__() {
	return function () {
		var query = this; // Keep reference to the query object

		// Exit if no data to pivot
		if (!query.data || query.data.length === 0) {
			query.columns = []; // Reset columns if no data
			return;
		}

		// --- Determine grouping columns robustly ---
		var firstRowKeys = Object.keys(query.data[0]);
		var cols = firstRowKeys.filter(function (key) {
			return key !== columnid && key !== exprcolid;
		});
		// -----------------------------------------

		var newcols = []; // Stores the new column headers (e.g., 'MON', 'TUE')
		var gnewcols = {}; // Tracks unique new columns encountered
		var gr = {}; // Stores the grouped & pivoted results (key: gx, value: g)
		var ga = {}; // Stores counts for AVG calculation (key: gx, value: {day: count})
		var data = []; // The final pivoted data array

		query.data.forEach(function (d) {
			// Skip row if the pivot column value is not in the IN list (if provided)
			if (inlist && inlist.indexOf(d[columnid]) === -1) {
				return;
			}

			var gx = cols
				.map(function (colid) {
					return d[colid] === undefined || d[colid] === null ? '' : d[colid];
				})
				.join('`');

			var g = gr[gx];
			if (!g) {
				g = {};
				gr[gx] = g;
				data.push(g);
				cols.forEach(function (colid) {
					g[colid] = d[colid];
				});
			}

			if (!ga[gx]) {
				ga[gx] = {};
			}

			var pivotColValue = d[columnid];
			var aggValue = d[exprcolid];

			// Increment count only for non-null/undefined values when calculating AVG
			if (ga[gx][pivotColValue]) {
				if (aggValue !== null && typeof aggValue !== 'undefined') {
					ga[gx][pivotColValue]++;
				}
			} else {
				ga[gx][pivotColValue] = aggValue !== null && typeof aggValue !== 'undefined' ? 1 : 0;
			}

			if (!gnewcols[pivotColValue]) {
				gnewcols[pivotColValue] = true;
				newcols.push(pivotColValue);
			}

			// Apply the specified aggregation
			if (aggr == 'SUM' || aggr == 'AVG' || aggr == 'TOTAL') {
				if (aggValue !== null && typeof aggValue !== 'undefined') {
					g[pivotColValue] =
						typeof g[pivotColValue] === 'undefined' || g[pivotColValue] === null
							? Number(aggValue)
							: g[pivotColValue] + Number(aggValue);
				} else if (typeof g[pivotColValue] === 'undefined') {
					g[pivotColValue] = null;
				}
			} else if (aggr == 'COUNT') {
				if (exprcolid === '*' || (aggValue !== null && typeof aggValue !== 'undefined')) {
					g[pivotColValue] = (g[pivotColValue] || 0) + 1;
				} else if (typeof g[pivotColValue] === 'undefined') {
					g[pivotColValue] = 0;
				}
			} else if (aggr == 'MIN') {
				if (aggValue !== null && typeof aggValue !== 'undefined') {
					if (
						typeof g[pivotColValue] === 'undefined' ||
						g[pivotColValue] === null ||
						aggValue < g[pivotColValue]
					) {
						g[pivotColValue] = aggValue;
					}
				} else if (typeof g[pivotColValue] === 'undefined') {
					g[pivotColValue] = null;
				}
			} else if (aggr == 'MAX') {
				if (aggValue !== null && typeof aggValue !== 'undefined') {
					if (
						typeof g[pivotColValue] === 'undefined' ||
						g[pivotColValue] === null ||
						aggValue > g[pivotColValue]
					) {
						g[pivotColValue] = aggValue;
					}
				} else if (typeof g[pivotColValue] === 'undefined') {
					g[pivotColValue] = null;
				}
			} else if (aggr == 'FIRST') {
				if (typeof g[pivotColValue] === 'undefined') {
					g[pivotColValue] = aggValue;
				}
			} else if (aggr == 'LAST') {
				g[pivotColValue] = aggValue;
			} else if (alasql.aggr[aggr]) {
				if (typeof g[pivotColValue] === 'undefined') {
					g[pivotColValue] = alasql.aggr[aggr](aggValue, undefined, 1);
				} else {
					g[pivotColValue] = alasql.aggr[aggr](aggValue, g[pivotColValue], 2);
				}
			} else {
				throw new Error('Unknown aggregator in PIVOT clause: ' + aggr);
			}
		});

		// Finalize AVG calculation
		if (aggr == 'AVG') {
			for (var gx in gr) {
				var d = gr[gx];
				for (var pivotColValue in ga[gx]) {
					if (d.hasOwnProperty(pivotColValue) && d[pivotColValue] !== null) {
						var count = ga[gx][pivotColValue];
						if (count > 0) {
							d[pivotColValue] = d[pivotColValue] / count;
						} else {
							d[pivotColValue] = null;
						}
					}
				}
			}
		}

		// --- Rebuild query.columns ---
		query.data = data;

		if (inlist) {
			newcols = inlist;
		} else {
			newcols.sort();
		}

		// Find original column definition - might be basic if SELECT * was used
		let aggColDef = query.columns.find(col => col.columnid === exprcolid);
		// If SELECT * was used, aggColDef might be missing, find it from the table definition if possible
		if (!aggColDef && query.sources && query.sources.length > 0) {
			let sourceTableId = query.sources[0].tableid;
			let sourceDbId = query.sources[0].databaseid;
			if (
				sourceTableId &&
				sourceDbId &&
				alasql.databases[sourceDbId]?.tables?.[sourceTableId]?.xcolumns
			) {
				aggColDef = alasql.databases[sourceDbId].tables[sourceTableId].xcolumns[exprcolid];
			}
		}
		// Provide a fallback if still not found
		aggColDef = aggColDef || {columnid: exprcolid, dbtypeid: 'OBJECT'};

		// Keep only the grouping columns initially
		query.columns = query.columns.filter(function (col) {
			return cols.includes(col.columnid);
		});

		// Add the new pivoted columns
		newcols.forEach(function (newColId) {
			var nc = cloneDeep(aggColDef);
			nc.columnid = newColId;

			// ---- Final Refined Type Logic ----
			const originalType = (aggColDef.dbtypeid || 'OBJECT').toUpperCase();
			const integerTypes = [
				'INT',
				'INTEGER',
				'SMALLINT',
				'BIGINT',
				'SERIAL',
				'SMALLSERIAL',
				'BIGSERIAL',
			];
			const numericTypes = [...integerTypes, 'NUMBER', 'FLOAT', 'DECIMAL', 'NUMERIC', 'MONEY'];

			if (aggr === 'COUNT') {
				nc.dbtypeid = 'INT';
			} else if (aggr === 'AVG') {
				// Keep INT type if original was INT-like, otherwise use FLOAT
				if (integerTypes.includes(originalType)) {
					nc.dbtypeid = aggColDef.dbtypeid; // Preserve original INT-like type
				} else {
					nc.dbtypeid = 'FLOAT';
				}
			} else if (aggr === 'SUM' || aggr === 'TOTAL') {
				// Preserve numeric types, default to FLOAT otherwise
				if (numericTypes.includes(originalType)) {
					nc.dbtypeid = aggColDef.dbtypeid;
				} else {
					nc.dbtypeid = 'FLOAT'; // Default for non-numeric or unknown sums
				}
			} else if (aggr === 'MIN' || aggr === 'MAX' || aggr === 'FIRST' || aggr === 'LAST') {
				// Preserve original type as comparisons work across types
				nc.dbtypeid = aggColDef.dbtypeid;
			}
			// For custom aggregators (AGGR, REDUCE), inherit type from clone, ensure fallback
			else if (!nc.dbtypeid) {
				nc.dbtypeid = 'OBJECT';
			}

			query.columns.push(nc);
		});
	};

}
