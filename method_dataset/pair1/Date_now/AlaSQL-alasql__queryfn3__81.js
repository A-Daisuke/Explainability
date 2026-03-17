function queryfn3(query) {
	var scope = query.scope,
		jlen;

	// Preindexation of data sources
	preIndex(query);

	// Prepare variables
	query.data = [];
	query.xgroups = {};
	query.groups = [];

	// Level of Joins
	var h = 0;

	// Start walking over data
	doJoin(query, scope, h);

	// If grouping, then filter groups with HAVING function
	if (query.groupfn) {
		query.data = [];
		if (query.groups.length === 0 && query.allgroups.length === 0) {
			var g = {};
			if (query.selectGroup.length > 0) {
				query.selectGroup.forEach(function (sg) {
					if (
						sg.aggregatorid == 'COUNT' ||
						sg.aggregatorid == 'SUM' ||
						sg.aggregatorid == 'TOTAL'
					) {
						g[sg.nick] = 0;
					} else {
						g[sg.nick] = undefined;
					}
				});
			}
			query.groups = [g];
		}

		if (query.aggrKeys.length > 0) {
			var gfns = '';
			query.aggrKeys.forEach(function (col) {
				gfns += `
				g[${JSON.stringify(col.nick)}] = alasql.aggr[${JSON.stringify(
					col.funcid
				)}](undefined,g[${JSON.stringify(col.nick)}],3); `;
			});
			var gfn = new Function('g,params,alasql', 'var y;' + gfns);
		}

		for (var i = 0, ilen = query.groups.length; i < ilen; i++) {
			var g = query.groups[i];

			if (gfn) gfn(g, query.params, alasql);

			if (!query.havingfn || query.havingfn(g, query.params, alasql)) {
				var d = query.selectgfn(g, query.params, alasql);

				for (const key in query.groupColumns) {
					// ony remove columns where the alias is also not a column in the result
					if (
						query.groupColumns[key] !== key &&
						d[query.groupColumns[key]] &&
						!query.groupColumns[query.groupColumns[key]]
					) {
						delete d[query.groupColumns[key]];
					}
				}
				query.data.push(d);
			}
		}
	}
	// Remove distinct values
	doDistinct(query);

	// UNION / UNION ALL
	if (query.unionallfn) {
		// TODO Simplify this part of program
		var ud, nd;
		if (query.corresponding) {
			if (!query.unionallfn.query.modifier) query.unionallfn.query.modifier = undefined;
			ud = query.unionallfn(query.params);
		} else {
			if (!query.unionallfn.query.modifier) query.unionallfn.query.modifier = 'RECORDSET';
			nd = query.unionallfn(query.params);
			ud = [];
			ilen = nd.data.length;
			for (var i = 0; i < ilen; i++) {
				var r = {};
				if (query.columns.length) {
					jlen = Math.min(query.columns.length, nd.columns.length);
					for (var j = 0; j < jlen; j++) {
						r[query.columns[j].columnid] = nd.data[i][nd.columns[j].columnid];
					}
				} else {
					jlen = nd.columns.length;
					for (var j = 0; j < jlen; j++) {
						r[nd.columns[j].columnid] = nd.data[i][nd.columns[j].columnid];
					}
				}
				ud.push(r);
			}
		}
		query.data = query.data.concat(ud);
	} else if (query.unionfn) {
		if (query.corresponding) {
			if (!query.unionfn.query.modifier) query.unionfn.query.modifier = 'ARRAY';
			ud = query.unionfn(query.params);
		} else {
			if (!query.unionfn.query.modifier) query.unionfn.query.modifier = 'RECORDSET';
			nd = query.unionfn(query.params);
			ud = [];
			ilen = nd.data.length;
			for (var i = 0; i < ilen; i++) {
				r = {};
				if (query.columns.length) {
					jlen = Math.min(query.columns.length, nd.columns.length);
					for (var j = 0; j < jlen; j++) {
						r[query.columns[j].columnid] = nd.data[i][nd.columns[j].columnid];
					}
				} else {
					jlen = nd.columns.length;
					for (var j = 0; j < jlen; j++) {
						r[nd.columns[j].columnid] = nd.data[i][nd.columns[j].columnid];
					}
				}
				ud.push(r);
			}
		}

		query.data = arrayUnionDeep(query.data, ud);
	} else if (query.exceptfn) {
		if (query.corresponding) {
			if (!query.exceptfn.query.modifier) query.exceptfn.query.modifier = 'ARRAY';
			var ud = query.exceptfn(query.params);
		} else {
			if (!query.exceptfn.query.modifier) query.exceptfn.query.modifier = 'RECORDSET';
			var nd = query.exceptfn(query.params);
			var ud = [];
			for (var i = 0, ilen = nd.data.length; i < ilen; i++) {
				var r = {};
				for (var j = Math.min(query.columns.length, nd.columns.length) - 1; 0 <= j; j--) {
					r[query.columns[j].columnid] = nd.data[i][nd.columns[j].columnid];
				}
				ud.push(r);
			}
		}

		query.data = arrayExceptDeep(query.data, ud);
	} else if (query.intersectfn) {
		if (query.corresponding) {
			if (!query.intersectfn.query.modifier) query.intersectfn.query.modifier = undefined;
			ud = query.intersectfn(query.params);
		} else {
			if (!query.intersectfn.query.modifier) query.intersectfn.query.modifier = 'RECORDSET';
			nd = query.intersectfn(query.params);
			ud = [];
			ilen = nd.data.length;
			for (i = 0; i < ilen; i++) {
				r = {};
				jlen = Math.min(query.columns.length, nd.columns.length);
				for (j = 0; j < jlen; j++) {
					r[query.columns[j].columnid] = nd.data[i][nd.columns[j].columnid];
				}
				ud.push(r);
			}
		}

		query.data = arrayIntersectDeep(query.data, ud);
	}

	// Ordering
	if (query.orderfn) {
		if (query.explain) var ms = Date.now();
		query.data = query.data.sort(query.orderfn);
		if (query.explain) {
			query.explaination.push({
				explid: query.explid++,
				description: 'QUERY BY',
				ms: Date.now() - ms,
			});
		}
	}

	// Reduce to limit and offset
	doLimit(query);

	// TODO: Check what artefacts rest from Angular.js
	if (typeof angular != 'undefined') {
		query.removeKeys.push('$$hashKey');
	}

	if (query.removeKeys.length > 0) {
		var removeKeys = query.removeKeys;

		// Remove from data
		jlen = removeKeys.length;
		if (jlen > 0) {
			ilen = query.data.length;
			for (i = 0; i < ilen; i++) {
				for (j = 0; j < jlen; j++) {
					delete query.data[i][removeKeys[j]];
				}
			}
		}

		// Remove from columns list
		if (query.columns.length > 0) {
			query.columns = query.columns.filter(function (column) {
				var found = false;
				removeKeys.forEach(function (key) {
					if (column.columnid == key) found = true;
				});
				return !found;
			});
		}
	}

	if (typeof query.removeLikeKeys != 'undefined' && query.removeLikeKeys.length > 0) {
		var removeLikeKeys = query.removeLikeKeys;

		// Remove unused columns
		// SELECT * REMOVE COLUMNS LIKE "%b"
		for (var i = 0, ilen = query.data.length; i < ilen; i++) {
			r = query.data[i];
			for (var k in r) {
				for (j = 0; j < query.removeLikeKeys.length; j++) {
					if (alasql.utils.like(query.removeLikeKeys[j], k)) {
						delete r[k];
					}
				}
			}
		}

		if (query.columns.length > 0) {
			query.columns = query.columns.filter(function (column) {
				var found = false;
				removeLikeKeys.forEach(function (key) {
					if (alasql.utils.like(key, column.columnid)) {
						found = true;
					}
				});
				return !found;
			});
		}
	}

	if (query.pivotfn) query.pivotfn();

	if (query.unpivotfn) query.unpivotfn();

	if (query.intoallfn) {
		var res = query.intoallfn(query.columns, query.cb, query.params, query.alasql);
		return res;
	}

	if (query.intofn) {
		ilen = query.data.length;
		for (i = 0; i < ilen; i++) {
			query.intofn(query.data[i], i, query.params, query.alasql);
		}
		if (query.cb) query.cb(query.data.length, query.A, query.B);
		return query.data.length;
	}
	res = query.data;
	if (query.cb) res = query.cb(query.data, query.A, query.B);
	return res;
}
